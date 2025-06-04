const {walletHistory} = require('../models');

async function updateWalletHistory(address, targetAddress, isConfirmed) {
    try {
        const [updatedRows] = await walletHistory.update(
            { is_confirmed: isConfirmed },
            {
                where: {
                    address: address,
                    target_address: targetAddress,
                }
            }
        );
        console.log('updateWalletHistory 성공:', address, targetAddress, updatedRows);
    } catch (err) {
        console.error('updateWalletHistory 에러:', err);
        throw err; 
    }
}

module.exports = {
    updateWalletHistory,
};