const {swMileage} =  require('../models');

// 상태 업데이트
async function updateDocStatus(docs_index, is_confirmed, student_hash, doc_hash) {
  try {
    await swMileage.update(
      { docs_index: docs_index, is_confirmed: is_confirmed },
      { where: { student_hash: student_hash, doc_hash: doc_hash } }
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