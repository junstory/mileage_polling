const { walletHistory, student } = require("../models");

async function updateWalletHistory(address, targetAddress, isConfirmed) {
  try {
    const [updatedRows] = await walletHistory.update(
      { is_confirmed: isConfirmed },
      {
        where: {
          address: address,
          target_address: targetAddress,
        },
      }
    );
    console.log(
      "updateWalletHistory 성공:",
      address,
      targetAddress,
      updatedRows
    );
  } catch (err) {
    console.error("updateWalletHistory 에러:", err);
    throw err;
  }
}

async function getWalletHistoryByStudentHash(studentHash) {
  try {
    return await walletHistory.findOne({
      where: {
        student_hash: studentHash,
        is_confirmed: 0,
      },
    });
  } catch (e) {
    console.error(e);
  }
}

async function confirmWalletLost(walletHistoryId) {
  try {
    return await walletHistory.update(
      {
        is_confirmed: 1,
      },
      {
        where: { wallet_history_id: walletHistoryId },
      }
    );
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  updateWalletHistory,
  getWalletHistoryByStudentHash,
  confirmWalletLost,
};
