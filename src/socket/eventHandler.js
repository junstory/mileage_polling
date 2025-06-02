const { bytes32ToStr } = require("../utils/web3");
const { confirmStudent } = require("../db/student");
const { confirmAdmin } = require("../db/admin");
const {
  updateDocStatus,
  updateDocStatusToApproved,
  updateDocStatusToRejected,
} = require("../db/swMileage");
const { updateTokenHistoryStatus } = require("../db/swMileageTokenHistory");

const handlers = {
  // event AdminAdded(address indexed account)
  AdminAdded: async (args, log) => {
    const account = args[0];
    try {
      await confirmAdmin(account);
      console.log("[확정] AdminAdded:", args, log.transactionHash);
    } catch (err) {
      console.error("[확정] AdminAdded 에러:", err);
    }
  },

  // event StudentRegistered(bytes32 indexed studentId, address indexed account)
  StudentRegistered: async (args, log) => {
    const studentHash = args[0];
    try {
      await confirmStudent(studentHash);
    } catch (err) {
      console.error("[에러] StudentRegistered 에러:", err);
    }
    console.log(
      "[확정] STUDENT_MANAGER StudentRegistered:",
      args,
      log.transactionHash
    );
  },

  // event DocSubmitted(uint256 indexed documentIndex)
  DocSubmitted: async (args, log) => {
    const documentIndex = Number(args[0]);
    const transactionHash = log.transactionHash;
    await updateDocStatus(documentIndex, 1, transactionHash);
    console.log("[확정] DocSubmitted:", documentIndex, transactionHash);
  },
  // event DocApproved(uint256 indexed documentIndex, bytes32 indexed studentId, uint256 amount)
  DocApproved: async (args, log) => {
    const documentIndex = Number(args[0]);
    const studentId = args[1];
    const amount = Number(args[2]);
    console.log("DocApproved:", documentIndex, studentId, amount);
    await updateDocStatusToApproved(documentIndex, studentId);
    await updateTokenHistoryStatus(1, log.transactionHash);
    console.log(
      "[확정] STUDENT_MANAGER DocApproved:",
      args,
      log.transactionHash
    );
  },
  // event DocRejected(uint256 indexed documentIndex, bytes32 indexed studentId, bytes32 reasonHash)
  DocRejected: async (args, log) => {
    const documentIndex = Number(args[0]);
    const studentIdBytes = args[1];
    const reasonHash = args[2];

    const studentId = bytes32ToStr(studentIdBytes);
    const reason = bytes32ToStr(reasonHash);
    await updateDocStatusToRejected(documentIndex, studentId, reason);

    console.log(
      "[확정] STUDENT_MANAGER DocRejected:",
      args,
      log.transactionHash
    );
  },
  // event AccountChangeProposed(address indexed account)
  AccountChangeProposed: async (args, log) => {
    console.log(
      "[확정] STUDENT_MANAGER AccountChangeProposed:",
      args,
      log.transactionHash
    );
  },
  // event AccountChangeConfirmed(address indexed account)
  AccountChangeConfirmed: async (args, log) => {
    // 변경 요청 상태 1 로 바꾸기
    console.log(
      "[확정] STUDENT_MANAGER AccountChangeConfirmed:",
      args,
      log.transactionHash
    );
  },
  // event AccountChanged(address indexed account)
  AccountChanged: async (args, log) => {
    // 학생 회원가입 is_active를 다시 사용할지??아니면 새로 status를 만들어서 관리할지
    console.log(
      "[확정] STUDENT_MANAGER AccountChanged:",
      args,
      log.transactionHash
    );
  },
  // event StudentRecordUpdated(bytes32 indexed studentId, address indexed account)
  StudentRecordUpdated: async (args, log) => {
    //관리자가 계정 강제 변경
    console.log(
      "[확정] STUDENT_MANAGER StudentRecordUpdated:",
      args,
      log.transactionHash
    );
  },

  // event MileageBurned(bytes32 indexed studentId, uint256 amount)
  MileageBurned: async (args, log) => {
    // 토큰 히스토리의 is_activate를 1로 변경
    console.log(
      "[확정] STUDENT_MANAGER MileageBurned:",
      args,
      log.transactionHash
    );
  },
  // event MileageMinted(bytes32 indexed studentId, uint256 amount)
  MileageMinted: async (args, log) => {
    // 토큰 히스토리의 is_activate를 1로 변경
    console.log(
      "[확정] STUDENT_MANAGER MileageBurned:",
      args,
      log.transactionHash
    );
  },
};

module.exports = handlers;
