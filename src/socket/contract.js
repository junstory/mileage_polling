const STUDENT_MANAGER_CONTRACT_ADDRESS_ABI = require('../utils/data/contract/StudentManager.abi.json');
const SW_MILEAGE_CONTRACT_ADDRESS_ABI = require('../utils/data/contract/SwMileageToken.abi.json');
const SW_MILEAGE_FACTORY_CONTRACT_ADDRESS_ABI = require('../utils/data/contract/SwMileageTokenFactory.abi.json');

const STUDENT_MANAGER_CONTRACT_ADDRESS_EVENT = [
    "DocSubmitted",             //제출
    "DocApproved",              //승인(history)  
    "DocRejected",              //거절
    "AccountChanged",           //계정 변경 완료(history)  
    "AdminAdded",               //관리자 추가 
    "StudentRegistered",        //학생 등록
    "MileageBurned",            //마일리지 소모(history)  
    "MileageMinted",            //마일리지 발행(history)  
    //삭제 예정 이벤트
    "AccountChangeProposed",    //계정 변경 요청 (삭제 예정)
    "AccountChangeConfirmed",   //계정 변경 승인 (삭제 예정)
    "AdminRemoved",             //관리자 제거    (삭제 예정)
    "StudentRecordUpdated",     //학생 기록 업데이트(계정) (삭제 예정)
    "transferMileageToken",     //마일리지 토큰 전송  (삭제 예정)
    "Initialized",              // (삭제 예정)
    "Paused",                   // (삭제 예정)
    "Unpaused",                 // (삭제 예정)
];

const abiEvents = STUDENT_MANAGER_CONTRACT_ADDRESS_ABI.filter(item => item.type === "event").map(item => item.name);
const missing = STUDENT_MANAGER_CONTRACT_ADDRESS_EVENT.filter(e => !abiEvents.includes(e));
console.log("ABI에 없는 이벤트:", missing);

module.exports = [
  {
    address: process.env.STUDENT_MANAGER_CONTRACT_ADDRESS,
    abi: STUDENT_MANAGER_CONTRACT_ADDRESS_ABI,
    events: STUDENT_MANAGER_CONTRACT_ADDRESS_EVENT,
  },
];