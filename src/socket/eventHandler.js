const {updateDocStatus} = require('../db/swMileage');
const {updateStudentStatus} = require('../db/student');
const {addAdminStatus, removeAdminStatus} = require('../db/admin');

const handlers = {
    DocSubmitted: async (args, log) => {
        const documentIndex = Number(args[0]);
        console.log('DocSubmitted:', documentIndex, updateDocStatus);
        await updateDocStatus(documentIndex, 1, log.transactionHash);
        console.log('[확정] DocSubmitted:', documentIndex, log.transactionHash);
    },
    DocApproved: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER DocApproved:', args, log.transactionHash);
    },
    DocRejected: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER DocRejected:', args, log.transactionHash);
    },
    AccountChangeProposed: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER AccountChangeProposed:', args, log.transactionHash);
    },
    AccountChangeConfirmed: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER AccountChangeConfirmed:', args, log.transactionHash);
    },
    AccountChanged: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER AccountChanged:', args, log.transactionHash);
    },
    AdminAdded: async (args, log) => {
        // AdminAdded 이벤트가 두 컨트랙트에 중복됨
        const account = args[0];
        console.log('[확정] Both..? AdminAdded:', args, log.transactionHash);
        await addAdminStatus(account, 1, log.transactionHash);
        console.log('[확정] AdminAdded:', args, log.transactionHash);
    },
    AdminRemoved: async (args, log) => {
        // AdminRemoved 이벤트가 두 컨트랙트에 중복됨
        const account = args[0];
        console.log('[확정] Both..? AdminRemoved:', args, log.transactionHash);
        await removeAdminStatus(account, 0, log.transactionHash);
        console.log('[확정] AdminRemoved:', args, log.transactionHash);
    },
    MileageBurned: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER MileageBurned:', args, log.transactionHash);
    },
    Paused: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER Paused:', args, log.transactionHash);
    },
    Unpaused: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER Unpaused:', args, log.transactionHash);
    },
    StudentRecordUpdated: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER StudentRecordUpdated:', args, log.transactionHash);
    },
    StudentRegistered: async (args, log) => {
        const studentId = args[0];
        const account = args[1];
        console.log('[확정] STUDENT_MANAGER StudentRegistered:', args, log.transactionHash);
        await updateStudentStatus(account, 1, log.transactionHash);
    },
    Initialized: async (args, log) => {
        // Initialized 이벤트가 두 컨트랙트에 중복됨
        console.log('[확정] Initialized:', args, log.transactionHash);
    },
    transferMileageToken: async (args, log) => {
        console.log('[확정] STUDENT_MANAGER transferMileageToken:', args, log.transactionHash);
    },

    // SW_MILEAGE_CONTRACT_ADDRESS_EVENT
    UpdateElement: async (args, log) => {
        console.log('[확정] SW_MILEAGE UpdateElement:', args, log.transactionHash);
    },
    RemoveElement: async (args, log) => {
        console.log('[확정] SW_MILEAGE RemoveElement:', args, log.transactionHash);
    },
    Approval: async (args, log) => {
        console.log('[확정] SW_MILEAGE Approval:', args, log.transactionHash);
    },
    Transfer: async (args, log) => {
        console.log('[확정] SW_MILEAGE Transfer:', args, log.transactionHash);
    },
    AddAdministrator: async (args, log) => {
        console.log('[확정] SW_MILEAGE AddAdministrator:', args, log.transactionHash);
    },
    RemoveAdministrator: async (args, log) => {
        console.log('[확정] SW_MILEAGE RemoveAdministrator:', args, log.transactionHash);
    },
};

module.exports = handlers;