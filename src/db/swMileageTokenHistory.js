const {swMileage, swMileageTokenHistory} = require('../models');

async function updateTokenHistoryStatus(is_activate, txHash) {
  try {
    await swMileageTokenHistory.update(
      { is_activate: is_activate },
      { where: { transaction_hash: txHash } }
    );
    console.log('updateTokenHistoryStatus 성공:', txHash);
  } catch (err) {
    console.error('updateTokenHistoryStatus 에러:', err);
    throw err;  // 에러를 호출한 쪽으로 던짐
  }
}

async function createTokenHistory({
  token_contract_address,
  token_name,
  student_id,
  student_address,
  admin_address,
  amount,
  type,
  note
}) {
  try {
    await swMileageTokenHistory.create({
      token_contract_address,
      token_name,
      student_id,
      student_address,
      admin_address,
      amount,
      type,
      note,
    });
    console.log('createTokenHistory 성공:');
  } catch (err) {
    console.error('createTokenHistory 에러:', err);
    throw err;  // 에러를 호출한 쪽으로 던짐
  }
}

module.exports = {
  createTokenHistory,
  updateTokenHistoryStatus,
};