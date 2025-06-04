const { swMileageToken } = require("../models");
const { ethers } = require("ethers");
const contracts = require("../socket/contract");
const config = { ETH_NODE_WSS: "wss://public-en-kairos.node.kaia.io/ws" };

async function getActiveTokenInfo() {
  try {
    //TODO: 코드 중복
    let provider = new ethers.WebSocketProvider(config.ETH_NODE_WSS);
    const contract = new ethers.Contract(
      contracts[0].address,
      contracts[0].abi,
      provider
    );
    const activeTokenAddress = await contract.mileageToken();
    const activeToken = await swMileageToken.findOne({
      where: { contract_address: activeTokenAddress },
    });
    return activeToken;
  } catch (err) {
    console.error("getActiveTokenInfo 에러:", err);
  }
}

module.exports = {
  getActiveTokenInfo,
};
