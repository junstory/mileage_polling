const { student } = require("../models");

// 상태 업데이트
async function confirmStudent(studentHash) {
  try {
    await student.update(
      { is_confirmed: 1 },
      { where: { student_hash: studentHash } }
    );
    console.log("confirmStudent 성공:", studentHash);
  } catch (err) {
    console.error("confirmStudent 에러:", err);
    throw err; // 에러를 호출한 쪽으로 던짐
  }
}

async function getStudentByStudentHash(studentHash) {
  try {
    const result = await student.findOne({
      where: { student_hash: studentHash },
    });
    return result;
  } catch (err) {
    console.error("getStudent 에러:", err);
    throw err; // 에러를 호출한 쪽으로 던짐
  }
}

async function updateStudentAddress(
  studentHash,
  previousAddress,
  targetAddress
) {
  try {
    const result = await student.update(
      { wallet_address: targetAddress },
      { where: { student_hash: studentHash, wallet_address: previousAddress } }
    );
    return result;
  } catch (err) {
    console.error("getStudent 에러:", err);
    throw err; // 에러를 호출한 쪽으로 던짐
  }
}

module.exports = {
  confirmStudent,
  getStudentByStudentHash,
  updateStudentAddress,
};
