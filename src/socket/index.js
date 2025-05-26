const { ethers } = require('ethers');

const config = { ETH_NODE_WSS: 'wss://public-en-kairos.node.kaia.io/ws' };
const logger = console;
const { saveReward, setLastProcessedBlock, getLastProcessedBlock } = require('../db/eventStore');
const contract = require('./contract');

//컨트랙트 관련 설정
const CONTRACT_ADDRESS= '0xe45f9E3616C2A7E2dFcA51E02e75c780a5ADaD6b';
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "reasonHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "RewardIssued",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "reasonHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "issueReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const EXPECTED_PONG_BACK = 15000; // Time to wait for a pong response in milliseconds
const KEEP_ALIVE_CHECK_INTERVAL = 7500; // Interval for sending ping messages in milliseconds
const MAX_RECONNECT_ATTEMPTS = 5; // Maximum number of reconnection attempts
const RECONNECT_INTERVAL_BASE = 1000; // Base delay in milliseconds for reconnections
const SIMULATE_DISCONNECT_INTERVAL = 30000; // Interval to simulate disconnection (e.g., 30 seconds)

// Toggle for the disconnect simulation feature
const simulateDisconnect = false; // Set to false to disable disconnect simulation

// Variable to track the number of reconnection attempts
let reconnectAttempts = setLastProcessedBlock(185609159);

// Function to simulate a broken connection
function simulateBrokenConnection(provider) {
    logger.warn('Simulating broken WebSocket connection');
    provider.websocket.close();
}

// Function to start and manage the WebSocket connection
function startSocketConnection() {
    // Initializing WebSocket provider with the Ethereum node URL
    let provider = new ethers.WebSocketProvider(config.ETH_NODE_WSS);

    //컨트랙트 연결
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    // 1) 이벤트 기반 감지
//   contract.on("RewardIssued", async (receiver, reasonHash, amount, token, event) => {
//     console.log("🔔 RewardIssued:", { txHash: event.transactionHash, receiver, reasonHash, amount: amount.toString(), token });
//     // TODO: DB 반영
    
//   });

  // 2) (선택) raw 로그 필터링
  provider.on({ address: CONTRACT_ADDRESS }, async log => {
    console.log("✅ Filtered RewardIssued:", {
    txHash: log.transactionHash,
  });
    const parsed = contract.interface.parseLog(log);
    if (parsed.name === "RewardIssued") {
      const { receiver, reasonHash, amount, token } = parsed.args;
      console.log("⚡ Raw Log Parsed:", { receiver, reasonHash, amount: amount.toString(), token });
        await setLastProcessedBlock(log.blockNumber+1);
        await saveReward({
            txHash:      log.transactionHash,
            blockNumber: log.blockNumber,
            receiver,
            reasonHash,
            amount:      amount.toString(),
            token
        });
    }
  });

  // 3) (선택) pending tx 모니터링
  provider.on("pending", async txHash => {
    const tx = await provider.getTransaction(txHash);
    if (tx?.to?.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()) {
      console.log("⏳ Pending Tx:", txHash, tx);
    }
  });

    // Variables for managing keep-alive mechanism
    let pingTimeout = null;
    let keepAliveInterval = null;

    // Function to schedule a reconnection attempt
    function scheduleReconnection() {
        // Check if maximum reconnection attempts haven't been reached
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            // Calculate delay for reconnection based on the number of attempts
            let delay = RECONNECT_INTERVAL_BASE * Math.pow(2, reconnectAttempts);
            // Schedule next reconnection attempt
            setTimeout(startSocketConnection, delay);
            reconnectAttempts++;
            logger.log(`Scheduled reconnection attempt ${reconnectAttempts} in ${delay} ms`);
        } else {
            logger.error('Maximum reconnection attempts reached. Aborting.');
        }
    }

    // Event listener for 'open' event on WebSocket connection
    provider.websocket.on('open', () => {
        reconnectAttempts = 0;
        keepAliveInterval = setInterval(() => {
            logger.debug('Checking if the connection is alive, sending a ping');
            provider.websocket.ping();

            pingTimeout = setTimeout(() => {
                logger.error('No pong received, terminating WebSocket connection');
                provider.websocket.terminate();
            }, EXPECTED_PONG_BACK);
        }, KEEP_ALIVE_CHECK_INTERVAL);

        // Schedule a simulated disconnect if the feature is enabled
        if (simulateDisconnect) {
            setTimeout(() => simulateBrokenConnection(provider), SIMULATE_DISCONNECT_INTERVAL);
        }
    });

    // Event listener for 'close' event on WebSocket connection
    provider.websocket.on('close', () => {
        logger.error('The websocket connection was closed');
        clearInterval(keepAliveInterval);
        clearTimeout(pingTimeout);
        scheduleReconnection();
    });

    // Event listener for 'pong' response to ping
    provider.websocket.on('pong', () => {
        logger.debug('Received pong, connection is alive');
        clearTimeout(pingTimeout);
    });

    // Event listener for new blocks on the Ethereum blockchain
    provider.on('block', (blockNumber) => {
        logger.log(`New Block: ${blockNumber}`);
    });

    // Event listener for errors on WebSocket connection
    provider.on('error', (error) => {
        logger.error('WebSocket error:', error);
        scheduleReconnection();
    });
}

// Initiate the connection
//startConnection();
module.exports = startSocketConnection;


// function startSocketConnection() {
//   let provider = new ethers.WebSocketProvider(config.ETH_NODE_WSS);

//   // 전체 컨트랙트 순회하며 리스너 등록
//   contracts.forEach(contractMeta => {
//     const contract = new ethers.Contract(contractMeta.address, contractMeta.abi, provider);
//     contractMeta.events.forEach(eventName => {
//       contract.on(eventName, async (...args) => {
//         const event = args[args.length-1]; // 마지막은 event 객체
//         if (handlers[eventName]) {
//           await handlers[eventName](args, event);
//         }
//       });
//     });

//     // raw log 방식도 필요하다면 아래처럼
//     provider.on({ address: contractMeta.address }, async log => {
//       try {
//         const parsed = contract.interface.parseLog(log);
//         if (handlers[parsed.name]) {
//           await handlers[parsed.name](parsed.args, log);
//         }
//       } catch (e) { /* log parse error 무시 */ }
//     });
//   });

//   // 아래는 기존 keepalive, reconnect, block, error 이벤트 등 유지
// }