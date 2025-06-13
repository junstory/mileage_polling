const { ethers } = require("ethers");

const config = { ETH_NODE_WSS: "wss://public-en-kairos.node.kaia.io/ws" };
const logger = console;
const {
  setLastProcessedBlock,
  getLastProcessedBlock,
  setLastProcessedBlockLegacy,
  getLastProcessedBlockLegacy,
  insertOrUpdateEvent,
  isDuplicateInDB,
  updateEventStatus,
} = require("../db/eventStore");
const { getLatestSwMileageTokenAddress } = require("../db/swMileageToken");
const handlers = require("./eventHandler");
const contracts = require("./contract");

const EXPECTED_PONG_BACK = 15000; // Time to wait for a pong response in milliseconds
const KEEP_ALIVE_CHECK_INTERVAL = 7500; // Interval for sending ping messages in milliseconds
const MAX_RECONNECT_ATTEMPTS = 5; // Maximum number of reconnection attempts
const RECONNECT_INTERVAL_BASE = 1000; // Base delay in milliseconds for reconnections

let reconnectAttempts = 0;

const pendingEvents = [];
let latestBlock = 0;

let provider = new ethers.WebSocketProvider(config.ETH_NODE_WSS);

async function startSocketConnection() {
  provider = new ethers.WebSocketProvider(config.ETH_NODE_WSS);

  contracts.forEach((contractMeta) => {
    // 주소없는 컨트랙트는 패스
    if (!contractMeta.address) return;
    const contract = new ethers.Contract(
      contractMeta.address,
      contractMeta.abi,
      provider
    );
    contractMeta.events.forEach((eventName) => {
      contract.on(eventName, async (...args) => {
        const event = args[args.length - 1]; // 마지막은 event 객체
        const log = event.log || event;
        const txHash = log.transactionHash;
        const blockNumber = log.blockNumber;
        const logIndex = log.index;
        const removed = log.removed;
        console.log("🔔 RewardIssued:", {
          txHash: event.transactionHash,
          ...args,
        });
        console.log("txHash:", txHash);
        console.log("logIndex:", logIndex);
        // TODO: DB 반영 및 리오그 처리
        // if (removed) {
        //     // 리오그 발생 처리 (모든 이벤트에 대해 공통 처리)
        //     console.log(`[리오그] removed 이벤트 감지: ${eventName}, txHash: ${txHash}, logIndex: ${logIndex}`);
        //     await updateEventStatus(txHash, logIndex, 0); // status=0(실패)

        //     // 이벤트별 추가 리버스 처리
        //     if (eventName === "DocSubmitted") {
        //         const docIndex = args[0].toString();
        //         await updateDocsTable(docIndex, 0, txHash, blockNumber);
        //     }
        //     // 다른 이벤트별 리버스 처리 필요 시 추가

        //     // pendingEvents 큐에서도 제거 (중복 방지)
        //     const idx = pendingEvents.findIndex(
        //         e => e.txHash === txHash && e.logIndex === logIndex
        //     );
        //     if (idx > -1) pendingEvents.splice(idx, 1);
        //     return;
        // }

        // 진행중 이벤트 logs 기록 (pending)
        // 감지되는 이벤트는 일단 모두 로그를 남긴다. (이때는 미확정 pending상태 -> status:2)
        // TODO: contract도 주소도 남기도록 수정. token 주소가 바뀔 수 있으므로
        await insertOrUpdateEvent({
          txHash,
          logIndex,
          eventName,
          blockNumber,
          data: args.slice(0, -1),
          status: 2,
        });

        // 중복 없이 pendingEvents에 추가
        if (
          !pendingEvents.some(
            (e) => e.txHash === txHash && e.logIndex === logIndex
          )
        ) {
          pendingEvents.push({
            eventName,
            args: args.slice(0, -1),
            log,
            txHash,
            blockNumber,
            logIndex,
          });
        }
      });
      //original
      // contract.on(eventName, async (...args) => {
      //   const event = args[args.length-1]; // 마지막은 event 객체
      //   // if (handlers[eventName]) {
      //   //   await handlers[eventName](args, event);
      //   // }
      // });
    });

    // raw log 방식도 필요하다면 아래처럼
    // provider.on({ address: contractMeta.address }, async log => {
    //   try {
    //     const parsed = contract.interface.parseLog(log);
    //     if (handlers[parsed.name]) {
    //       await handlers[parsed.name](parsed.args, log);
    //     }
    //   } catch (e) { /* log parse error 무시 */ }
    // });
  });

  let pingTimeout = null;
  let keepAliveInterval = null;

  function scheduleReconnection() {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      let delay = RECONNECT_INTERVAL_BASE * Math.pow(2, reconnectAttempts);
      setTimeout(startSocketConnection, delay);
      reconnectAttempts++;
      logger.log(
        `Scheduled reconnection attempt ${reconnectAttempts} in ${delay} ms`
      );
    } else {
      logger.error("Maximum reconnection attempts reached. Aborting.");
    }
  }

  //=====================
  // 재연결 및 에러 처리
  // =====================
  
  provider.websocket.on("open", () => {
    reconnectAttempts = 0;
    keepAliveInterval = setInterval(() => {
      logger.debug("Checking if the connection is alive, sending a ping");
      provider.websocket.ping();

      pingTimeout = setTimeout(() => {
        logger.error("No pong received, terminating WebSocket connection");
        provider.websocket.terminate();
      }, EXPECTED_PONG_BACK);
    }, KEEP_ALIVE_CHECK_INTERVAL);
  });

  provider.websocket.on("close", () => {
    logger.error("The websocket connection was closed");
    clearInterval(keepAliveInterval);
    clearTimeout(pingTimeout);
    scheduleReconnection();
  });

  provider.websocket.on("pong", () => {
    logger.debug("Received pong, connection is alive");
    clearTimeout(pingTimeout);
  });

  provider.on("block", (blockNumber) => {
    logger.log(`New Block: ${blockNumber}`);
    latestBlock = blockNumber;
  });

  provider.on("error", (error) => {
    logger.error("WebSocket error:", error);
    scheduleReconnection();
  });
}

//====================
// 폴링서버
//====================
// 폴링: 확정 블록만 반영

function partition(arr, predicate) {
  const yes = [],
    no = [];
  arr.forEach((item) => (predicate(item) ? yes : no.push(item)));
  return [yes, no];
}

const rpcUrls = [
  "https://public-en-kairos.node.kaia.io",
  "https://responsive-green-emerald.kaia-kairos.quiknode.pro/",
  "https://kaia-kairos.blockpi.network/v1/rpc/public",
];
const providers = rpcUrls.map(url => new ethers.JsonRpcProvider(url));

async function getLogsWithFallback(params) {
  for (let p of providers) {
    try {
      return await p.getLogs(params);
    } catch (err) {
      logger.warn("[getLogs] provider 실패, 다음 후보 시도:", err.message);
    }
  }
  logger.error("[getLogs] 모든 provider 실패, 블록:", params.fromBlock, params.toBlock);
  return []; // 또는 throw new Error(...) 할 수도
}

setInterval(async () => {
  // const contractAddress = await getLatestSwMileageTokenAddress();
  // if (!contractAddress) {
  //   console.log("[경고] SW 마일리지 토큰이 DB에 등록되어 있지 않습니다.");
  //   throw new Error("SW 마일리지 토큰이 등록되지 않았습니다.");
  // }
  const confirmBlock = latestBlock - 3;
  let lastBlock = await getLastProcessedBlockLegacy();
  console.log("확정 블록 확인", { confirmBlock, lastBlock });
  for (let b = lastBlock + 1; b <= confirmBlock; b++) {
    for (const contractMeta of contracts) {
      // const logs = await provider.getLogs({
      //   fromBlock: b,
      //   toBlock: b,
      //   address: contractMeta.address,
      // });
      const logs = await getLogsWithFallback({
        fromBlock: b,
        toBlock: b,
        address: contractMeta.address,
      });

      const iface = new ethers.Interface(contractMeta.abi);
      for (const log of logs) {
        try {
          //console.log("확정 블록 로그:", log);
          const parsed = iface.parseLog(log);
          const eventName = parsed.name;
          const txHash = log.transactionHash;
          const logIndex = log.index;

          // 중복/실패 확인
          //if (await isDuplicateInDB(txHash, logIndex)) continue;
          // logs status=1(확정)로 저장
          // 감지된 이벤트는 일단 모두 로그를 남긴다.
          // TODO: contract도 주소도 남기도록 수정. token 주소가 바뀔 수 있으므로
          // 비즈니스 테이블 등 확정 처리
          if (handlers[eventName]) {
            if (await isDuplicateInDB(txHash, logIndex)) continue; // 중복 이벤트는 무시
            console.log("in...확정 블록 핸들러:", eventName, parsed.args, log);
            await handlers[eventName](parsed.args, log);
          }
          await insertOrUpdateEvent({
            txHash,
            logIndex,
            eventName,
            blockNumber: log.blockNumber,
            data: parsed.args,
            status: 1,
          });
          
        } catch (e) {
          /*파싱불가 로그 무시*/
        }
      }
    }
    await setLastProcessedBlockLegacy(b);
  }

  // pendingEvents 중 확정된 블록만 반영
  const [toConfirm, stillPending] = partition(
    pendingEvents,
    (e) => e.blockNumber <= confirmBlock
  );
  for (const evt of toConfirm) {
    if (await isDuplicateInDB(evt.txHash, evt.logIndex)) continue;
    if (handlers[evt.eventName]) {
      console.log("확정 블록 핸들러:", evt.args, evt.log);
      await handlers[evt.eventName](evt.args, evt.log);
    }
    await insertOrUpdateEvent({
      txHash: evt.txHash,
      logIndex: evt.logIndex,
      eventName: evt.eventName,
      blockNumber: evt.blockNumber,
      data: evt.args,
      status: 1,
    });
    
  }
  pendingEvents.length = 0;
  pendingEvents.push(...stillPending);
}, 3000); // 3초마다
// Initiate the connection
//startConnection();
module.exports = startSocketConnection;
