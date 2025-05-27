const STUDENT_MANAGER_CONTRACT_ADDRESS_ABI = require('../utils/data/contract/StudentManager.abi.json');
const SW_MILEAGE_CONTRACT_ADDRESS_ABI = require('../utils/data/contract/SwMileageToken.abi.json');
const SW_MILEAGE_FACTORY_CONTRACT_ADDRESS_ABI = require('../utils/data/contract/SwMileageTokenFactory.abi.json');

const STUDENT_MANAGER_CONTRACT_ADDRESS_EVENT = [
    "DocSubmitted",             //제출
    "DocApproved",              //승인  
    "DocRejected",              //거절
    "AccountChangeProposed",    //계정 변경 요청
    "AccountChangeConfirmed",   //계정 변경 승인
    "AccountChanged",           //계정 변경 완료
    "AdminAdded",               //관리자 추가 
    "AdminRemoved",             //관리자 제거
    "MileageBurned",            //마일리지 소모
    "StudentRecordUpdated",     //학생 기록 업데이트(계정)
    "StudentRegistered",        //학생 등록
    "transferMileageToken",     //마일리지 토큰 전송
    "Initialized",
    "Paused",
    "Unpaused",
];

const SW_MILEAGE_CONTRACT_ADDRESS_EVENT = [
    "UpdateElement",
    "RemoveElement",
    "AdminAdded",
    "AdminRemoved",
    "Approval",
    "Initialized",
    "Transfer",
    //"AddAdministrator",
    //"RemoveAdministrator",
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
  {
    address: null, // null로 설정하여 나중에 동적으로 할당
    abi: SW_MILEAGE_CONTRACT_ADDRESS_ABI,
    events: SW_MILEAGE_CONTRACT_ADDRESS_EVENT,
  },
  {
    address: process.env.SW_MILEAGE_FACTORY_CONTRACT_ADDRESS,
    abi: SW_MILEAGE_FACTORY_CONTRACT_ADDRESS_ABI,
    events: ["MileageTokenCreated"],
  },
  // ...필요한 만큼
];