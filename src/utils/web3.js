const web3 = require('web3');
const {fromHex, bytesToString} = require('viem');

const bytes32ToStr = (bytes32) => {
    // 한글 변환도 가능
    return bytesToString(fromHex(bytes32, {size: 32}));
}

console.log(bytes32ToStr("0xec9588eb8595ed9598ec84b8ec9a94")) // 안녕하세요
console.log(bytes32ToStr("0x3230313831303232333100000000000000000000000000000000000000000000")) // 2018102231

module.exports = {
    web3,
    bytes32ToStr
};