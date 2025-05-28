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

module.exports = {
  updateTokenHistoryStatus,
};