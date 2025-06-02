const {admin} =  require('../models');

// 상태 업데이트
async function addAdminStatus(account, is_confirmed, txHash) {
  try {
    await admin.update(
      { is_confirmed: is_confirmed },
      { where: { wallet_address: account } }
    );
    console.log('addAdminStatus 성공:', txHash);
  } catch (err) {
    console.error('addAdminStatus 에러:', err);
    throw err; 
  }
}

// 현재 사용하지 않음. 어드민 삭제는 고려하지 않은 상태.
async function removeAdminStatus(account, is_confirmed, txHash) {
  try {
    await admin.update(
      { is_confirmed: is_confirmed },
      { where: { transaction_hash: txHash, wallet_address: account } }
    );
    console.log('removeAdminStatus 성공:', txHash);
  } catch (err) {
    console.error('removeAdminStatus 에러:', err);
    throw err; 
  }
}

module.exports = {
    addAdminStatus,
    removeAdminStatus,
};