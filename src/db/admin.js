const {admin} =  require('../models');

// 상태 업데이트
async function confirmAdmin(account) {
  try {
    await admin.update(
      { is_confirmed: 1 },
      { where: { wallet_address: account } }
    );
    console.log('confirmAdmin 성공:', account);
  } catch (err) {
    console.error('confirmAdmin 에러:', err);
    throw err; 
  }
}

module.exports = {
    confirmAdmin,
};