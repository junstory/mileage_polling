const {admin} =  require('../models');

// 상태 업데이트
async function addAdminStatus(account, is_activate, txHash) {
  try {
    await admin.update(
      { is_activate: is_activate },
      { where: { transaction_hash: txHash, wallet_address: account } }
    );
    console.log('addAdminStatus 성공:', txHash);
  } catch (err) {
    console.error('addAdminStatus 에러:', err);
    throw err; 
  }
}

async function removeAdminStatus(account, is_activate, txHash) {
  try {
    await admin.update(
      { is_activate: is_activate },
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