const {swMileage} =  require('../models');

//TODO: 상수 관리
const CONFIRMED = 1;
const DOC_APPROVED = 1;
const DOC_REJECTED = 0;

async function confirmDoc(documentIndex, docHash) {
  try {
    await swMileage.update(
      { is_confirmed:  CONFIRMED, doc_index: documentIndex},
      { where: { doc_hash: docHash } }
    );
  } catch (err) {
    console.error("confirmDoc 에러:", err);
    throw err; // 에러를 호출한 쪽으로 던짐
  }
}

async function approveDoc(studentId, documentIndex) {
  try {
    await swMileage.update(
      { status:  DOC_APPROVED},
      { where: { student_id: studentId, doc_index: documentIndex } }
    );
  } catch (err) {
    console.error("updateTokenStatusToApproved 에러:", err);
    throw err; // 에러를 호출한 쪽으로 던짐
  }
}

async function rejectDoc(documentIndex, studentId) {
  try {
    await swMileage.update(
      { status:  DOC_REJECTED},
      { where: { student_id: studentId, doc_index: documentIndex } }
    );
  } catch (err) {
    console.error("updateTokenStatusToApproved 에러:", err);
    throw err; // 에러를 호출한 쪽으로 던짐
  }
}

module.exports = {
    confirmDoc,
    approveDoc,
    rejectDoc
};