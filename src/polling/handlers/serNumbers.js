const web3 = require('./utils/web3'); // @kaiachain/web3js-ext
const { Event } = require('../db/models'); // Sequelize
const lastSyncedBlock = await getLastSyncedBlock(); // DB에서 마지막 블록 번호 불러오기

const latestBlock = await web3.eth.getBlockNumber();
const contractAddress = "0x95Be48...";
const setNumberTopic = web3.utils.sha3("SetNumber(uint256)");

const logs = await web3.eth.getPastLogs({
  fromBlock: web3.utils.toHex(lastSyncedBlock + 1),
  toBlock: web3.utils.toHex(latestBlock),
  address: contractAddress,
  topics: [setNumberTopic],
});

for (const log of logs) {
  const txHash = log.transactionHash;
  const blockNumber = parseInt(log.blockNumber);
  const value = web3.utils.hexToNumber(log.data); // event SetNumber(uint256)

  await Event.create({
    txHash,
    blockNumber,
    value,
  });
}

// 동기화 완료 시 마지막 블록 저장
await saveLastSyncedBlock(latestBlock);