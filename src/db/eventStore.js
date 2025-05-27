// eventStore.js
const { eventLog, swMileageToken, pollingData } = require("../models");

async function getLastProcessedBlockLegacy() {
  const row = await pollingData.findByPk("last_processed_block");
  return row ? Number(row.value) : 0;
}

async function getLastProcessedBlock(contractAddress = null) {
  // contractAddress를 지정하지 않으면 최신 토큰 사용
  if (!contractAddress) {
    const latest = await swMileageToken.findOne({ order: [['created_at', 'DESC']] });
    contractAddress = latest ? latest.contract_address : null;
  }
  if (!contractAddress) return 0;
  const row = await swMileageToken.findOne({ where: { contract_address: contractAddress } });
  return row && row.last_block ? Number(row.last_block) : 0;
}

async function setLastProcessedBlockLegacy(blockNumber) {
  await pollingData.upsert({
    key: "last_processed_block",
    value: String(blockNumber),
  });
}

async function setLastProcessedBlock(blockNumber, contractAddress = null) {
  // contractAddress를 지정하지 않으면 최신 토큰 사용
  if (!contractAddress) {
    const latest = await swMileageToken.findOne({ order: [['created_at', 'DESC']] });
    contractAddress = latest ? latest.contract_address : null;
  }
  if (!contractAddress) return;
  await swMileageToken.update(
    { last_block: blockNumber },
    { where: { contract_address: contractAddress } }
  );
}

// 중복 체크
async function isDuplicateInDB(txHash, logIndex) {
  const found = await eventLog.findOne({
    where: { tx_hash: txHash, log_index: logIndex, status:1 },
    attributes: ["id"],
  });
  return !!found;
}

// 삽입 또는 업데이트 (Upsert)
async function insertOrUpdateEvent({
  txHash,
  logIndex,
  eventName,
  blockNumber,
  data,
  status,
}) {
  const safeData = JSON.stringify(data, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
  await eventLog.upsert({
    tx_hash: txHash,
    log_index: logIndex,
    event_name: eventName,
    block_number: blockNumber,
    data: safeData,
    status: status,
  });
}

// 상태 업데이트
async function updateEventStatus(txHash, logIndex, status) {
  await eventLog.update(
    { status },
    { where: { tx_hash: txHash, log_index: logIndex } }
  );
}

module.exports = {
  getLastProcessedBlock,
  setLastProcessedBlock,
  isDuplicateInDB,
  insertOrUpdateEvent,
  updateEventStatus,
};
