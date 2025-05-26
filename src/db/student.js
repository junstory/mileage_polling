const {student} =  require('../models');

// 상태 업데이트
async function updateStudentStatus(account, is_activate, txHash) {
  try {
    await student.update(
      { is_activate: is_activate },
      { where: { transaction_hash: txHash, wallet_address: account } }
    );
    console.log('updateStudentStatus 성공:', txHash);
  } catch (err) {
    console.error('updateStudentStatus 에러:', err);
    throw err;  // 에러를 호출한 쪽으로 던짐
  }
}

module.exports = {
    updateStudentStatus,
};