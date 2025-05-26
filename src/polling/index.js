const { Web3 } = require("@kaiachain/web3js-ext");

const provider = new Web3.providers.HttpProvider("https://public-en-kairos.node.kaia.io");
const web3 = new Web3(provider);

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

const { saveReward,getLastProcessedBlock, setLastProcessedBlock } = require('../db/eventStore');

// (간단 예시) 메모리 상에만 저장하는 마지막 폴링 블록
let lastCheckedBlock = await getLastProcessedBlock();

const polling = async () => {
  try {
    // 1) 최신 블록 번호 조회
    const rawLatest = await web3.eth.getBlockNumber();
    const latestBlock = Number(rawLatest);

    // 2) 최초 실행 시엔, 너무 과거까지 조회하지 않도록 살짝 앞으로 잡아둡니다.
    if (lastCheckedBlock === 0) {
      lastCheckedBlock = latestBlock - 10; 
      if (lastCheckedBlock < 0) lastCheckedBlock = 0;
    }

    console.log(`▶ Polling RewardIssued events from block ${lastCheckedBlock} to ${latestBlock}`);

    // 3) Contract 인스턴스 생성
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    // 4) getPastEvents 로 RewardIssued 이벤트 가져오기
    const events = await contract.getPastEvents("RewardIssued", {
      fromBlock: lastCheckedBlock,
      toBlock: latestBlock
    });

    // 5) 이벤트 처리
    for (const ev of events) {
      const { receiver, reasonHash, amount, token } = ev.returnValues;
      console.log("Pollig!!! RewardIssued detected:");
      console.log("   txHash     :", ev.transactionHash);
      console.log("   blockNumber:", ev.blockNumber);
      console.log("   receiver   :", receiver);
      console.log("   reasonHash :", reasonHash);
      console.log("   amount     :", amount);
      console.log("   token      :", token);
      // TODO: 여기에 DB upsert 로직 추가
      await setLastProcessedBlock(ev.blockNumber+1n);
      await saveReward({
    txHash:      ev.transactionHash,
    blockNumber: ev.blockNumber,
    receiver:    ev.returnValues.receiver,
    reasonHash:  ev.returnValues.reasonHash,
    amount:      ev.returnValues.amount,
    token:       ev.returnValues.token
  });
    }

    // 6) 다음 폴링을 위해 기준 블록 갱신
    lastCheckedBlock = getLastProcessedBlock();

  } catch (err) {
    console.error("Polling failed:", err.message);
  }
};

// 예: 15초마다 폴링
//setInterval(polling, 10 * 1000);
// 혹은 express 등에서 직접 호출할 수도 있습니다.

module.exports = polling;