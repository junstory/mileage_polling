const {student} =  require('../models');

// 상태 업데이트
async function confirmStudent(studentHash) {
  try {
    await student.update(
      { is_confirmed: 1 },
      { where: { student_hash: studentHash } }
    );
    console.log('confirmStudent 성공:', studentHash);
  } catch (err) {
    console.error('confirmStudent 에러:', err);
    throw err;  // 에러를 호출한 쪽으로 던짐
  }
}

module.exports = {
    confirmStudent,
};