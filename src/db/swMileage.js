const {swMileage} =  require('../models');

// 상태 업데이트
async function updateDocStatus(docs_index, is_activate, txHash) {
  try {
    await swMileage.update(
      { docs_index: docs_index, is_activate: is_activate },
      { where: { transaction_hash: txHash } }
    );
    console.log('updateDocStatus 성공:', docs_index, txHash);
  } catch (err) {
    console.error('updateDocStatus 에러:', err);
    throw err;  // 에러를 호출한 쪽으로 던짐
  }
}

module.exports = {
    updateDocStatus,
};