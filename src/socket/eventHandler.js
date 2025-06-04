const { bytes32ToStr } = require("../utils/web3");
const { confirmStudent, getStudentByStudentHash } = require("../db/student");
const { confirmAdmin } = require("../db/admin");
const { confirmDoc, approveDoc, rejectDoc } = require("../db/swMileage");
const { createTokenHistory } = require("../db/swMileageTokenHistory");
const { getActiveTokenInfo } = require("../db/swMileageToken");

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

  // event DocSubmitted(uint256 indexed documentIndex, bytes32 indexed studentId, bytes32 docHash);
  DocSubmitted: async (args, log) => {
    const documentIndex = Number(args[0]);
    const docHash = args[2];
    try {
      await confirmDoc(documentIndex, docHash);
    } catch (err) {
      console.error("[에러] DocSubmitted 에러:", err);
    }
    console.log("[확정] DocSubmitted:", documentIndex, docHash);
  },

  // event DocApproved(uint256 indexed documentIndex, bytes32 indexed studentId, uint256 amount)
  DocApproved: async (args, log) => {
    const documentIndex = Number(args[0]);
    const studentHash = args[1];
    const amount = Number(args[2]);

    //TODO: DB transaction 처리?
    try {
      // 학생 정보 조회
      const student = await getStudentByStudentHash(studentHash);
      if (!student) {
        throw new Error("학생 정보를 찾을 수 없습니다.");
      }
      const studentId = student.student_id;

      // student_id, doc_index로 sw_mileage 특정 후 상태값 변경
      await approveDoc(studentId, documentIndex);

      // history 생성
      const activeToken = await getActiveTokenInfo();
      await createTokenHistory({
        token_contract_address: activeToken.contract_address,
        token_name: activeToken.sw_mileage_token_name,
        student_id: studentId,
        student_address: student.wallet_address,
        admin_address: null,
        amount: amount,
        type: "DOC_APPROVED",
        note: null,
      });
    } catch (err) {
      console.error("[에러] DocApproved 에러:", err);
    }

    console.log(
      "[확정] STUDENT_MANAGER DocApproved:",
      args,
      log.transactionHash
    );
  },
  // event DocRejected(uint256 indexed documentIndex, bytes32 indexed studentId, bytes32 reasonHash)
  DocRejected: async (args, log) => {
    const documentIndex = Number(args[0]);
    const studentHash = args[1];
    const amount = Number(args[2]);
    // 우선 별 다른 처리는 없습니다.

    //
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

  // event MileageBurned(bytes32 indexed studentId, address indexed account, address indexed admin, uint256 amount)
  MileageBurned: async (args, log) => {
    const studentHash = args[0];
    const studentAddress = args[1];
    const adminAddress = args[2];
    const amount = Number(args[3]);

    //TODO: DB transaction 처리?
    try {
      // 학생 정보 조회
      const student = await getStudentByStudentHash(studentHash);
      if (!student) {
        throw new Error("학생 정보를 찾을 수 없습니다.");
      }
      const studentId = student.student_id;

      const activeToken = await getActiveTokenInfo();
      await createTokenHistory({
        token_contract_address: activeToken.contract_address,
        token_name: activeToken.sw_mileage_token_name,
        student_id: studentId,
        student_address: studentAddress,
        admin_address: adminAddress,
        amount: amount,
        type: "DIRECT_BURN",
        transaction_hash: log.transactionHash,
        note: null,
      });
    } catch (err) {
      console.error("[에러] MileageBurned 에러:", err);
    }

    console.log(
      "[확정] STUDENT_MANAGER MileageBurned:",
      args,
      log.transactionHash
    );
  },
  // event MileageMinted(bytes32 indexed studentId, address indexed account, address indexed admin, uint256 amount)
  MileageMinted: async (args, log) => {
    const studentHash = args[0];
    const studentAddress = args[1];
    const adminAddress = args[2];
    const amount = Number(args[3]);

    try {
      const student = await getStudentByStudentHash(studentHash);
      if (!student) {
        throw new Error("학생 정보를 찾을 수 없습니다.");
      }
      const studentId = student.student_id;

      const activeToken = await getActiveTokenInfo();
      await createTokenHistory({
        token_contract_address: activeToken.contract_address,
        token_name: activeToken.sw_mileage_token_name,
        student_id: studentId,
        student_address: studentAddress,
        admin_address: adminAddress,
        amount: amount,
        type: "DIRECT_MINT",
        transaction_hash: log.transactionHash,
        note: null,
      });
    } catch (err) {
      console.error("[에러] MileageMinted 에러:", err);
    }
    console.log(
      "[확정] STUDENT_MANAGER MILEAGE_MINTED:",
      args,
      log.transactionHash
    );
  },
};

module.exports = handlers;
