const ethers = require('ethers');  

const reasonStr  = "가입보상";
const reasonHash = ethers.keccak256(ethers.toUtf8Bytes(reasonStr));

console.log(reasonHash);