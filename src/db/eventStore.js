// eventStore.js
const { eventLog, pollingData } = require('../models');

async function getLastProcessedBlock() {
  const row = await pollingData.findByPk('last_processed_block');
  return row ? Number(row.value) : 0;
}

async function setLastProcessedBlock(blockNumber) {
  await pollingData.upsert({
    key:   'last_processed_block',
    value: String(blockNumber)
  });
}

// 중복 체크
async function isDuplicateInDB(txHash, logIndex) {
  const found = await eventLog.findOne({
    where: { tx_hash: txHash, log_index: logIndex },
    attributes: ['id'],
  });
  return !!found;
}

// 삽입 또는 업데이트 (Upsert)
async function insertOrUpdateEvent({ txHash, logIndex, eventName, blockNumber, data, status }) {
  const safeData = JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
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