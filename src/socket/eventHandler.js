const { updateDocStatus } = require("../db/swMileage");
const { updateStudentStatus } = require("../db/student");
const { addAdminStatus, removeAdminStatus } = require("../db/admin");
const { updateTokenStatus } = require("../db/swMileageToken");
const { updateTokenHistoryStatus } = require("../db/swMileageTokenHistory");

const handlers = {
  DocSubmitted: async (args, log) => {
    const documentIndex = Number(args[0]);
    console.log("DocSubmitted:", documentIndex, updateDocStatus);
    await updateDocStatus(documentIndex, 1, log.transactionHash);
    console.log("[확정] DocSubmitted:", documentIndex, log.transactionHash);
  },
  DocRejected: async (args, log) => {
    //await updateTokenHistoryStatus(1, log.transactionHash);
    console.log(
      "[확정] STUDENT_MANAGER DocRejected:",
      args,
      log.transactionHash
    );
  },
  DocApproved: async (args, log) => {
    await updateTokenHistoryStatus(1, log.transactionHash);
    console.log(
      "[확정] STUDENT_MANAGER DocApproved:",
      args,
      log.transactionHash
    );
  },
  MileageBurned: async (args, log) => {
    // 토큰 히스토리의 is_activate를 1로 변경
    console.log(
      "[확정] STUDENT_MANAGER MileageBurned:",
      args,
      log.transactionHash
    );
  },
  MileageMinted: async (args, log) => {
    // 토큰 히스토리의 is_activate를 1로 변경
    console.log(
      "[확정] STUDENT_MANAGER MileageBurned:",
      args,
      log.transactionHash
    );
  },
  AccountChanged: async (args, log) => {
    // 학생 회원가입 is_active를 다시 사용할지??아니면 새로 status를 만들어서 관리할지
    console.log(
      "[확정] STUDENT_MANAGER AccountChanged:",
      args,
      log.transactionHash
    );
  },
  AdminAdded: async (args, log) => {
    const account = args[0];
    console.log("[확정] Both..? AdminAdded:", args, log.transactionHash);
    await addAdminStatus(account, 1);
    console.log("[확정] AdminAdded:", args, log.transactionHash);
  },
  StudentRegistered: async (args, log) => {
    const studentId = args[0];
    const account = args[1];
    console.log(
      "[확정] STUDENT_MANAGER StudentRegistered:",
      args,
      log.transactionHash
    );
    await updateStudentStatus(studentId, account, 1);
  },
};

module.exports = handlers;
