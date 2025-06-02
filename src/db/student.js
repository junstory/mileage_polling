const {student} =  require('../models');

// 상태 업데이트
async function updateStudentStatus(student_hash, account, is_confirmed) {
  try {
    await student.update(
      { is_confirmed: is_confirmed },
      { where: { student_hash: student_hash, wallet_address: account } }
    );
    console.log('updateStudentStatus 성공:', account, student_hash, is_confirmed);
  } catch (err) {
    console.error('updateStudentStatus 에러:', err);
    throw err;  // 에러를 호출한 쪽으로 던짐
  }
}

module.exports = {
    updateStudentStatus,
};