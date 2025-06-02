const { swMileageToken } = require("../models");
async function getLatestSwMileageTokenAddress() {
  const latest = await swMileageToken.findOne({
    where: { is_confirmed: 1 },
    order: [["created_at", "DESC"]],
  });
  //console.log(latest.dataValues.contract_address);
  return latest ? latest.dataValues.contract_address : null;
}

async function updateTokenStatus(contractAddress,status,block, txHash) {
  try {
    await swMileageToken.update(
      { is_confirmed: status, last_block: block },
      { where: { contract_address: contractAddress, transaction_hash: txHash } }
    );
    console.log("updateTokenStatus 성공:", contractAddress, status, txHash);
  } catch (err) {
    console.error("updateTokenStatus 에러:", err);
    throw err; // 에러를 호출한 쪽으로 던짐
  }
}


module.exports = {
  getLatestSwMileageTokenAddress,
  updateTokenStatus,
};
