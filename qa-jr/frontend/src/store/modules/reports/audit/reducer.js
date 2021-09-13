import { localizedStrings } from "constants/localizedStrings";

export const AUDIT_LOAD_SUCCESS = "audit_load_success";
export const AUDIT_CHANGE_OPERATION_STATES = "audit_change_operation_states";
export const AUDIT_CHANGE_LOADING_TEXT = "audit_change_loading_text";
export const AUDIT_CHANGE_LOADING_EMAIL = "audit_change_loading_email";


const operationStates = {
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const loading_send_email = {
  loadLoadingSendEmail: false,
  loadSuccessSendEmail: false,
  loadFailSendEmail: false
}

const INITIAL_STATE = {
  trackings: [],
  ...operationStates,
  ...loading_send_email,
  loadingAuditText: localizedStrings.messageModalPleaseWait,
  loadingPaginationText: "",
  loadingPagination: false,
};

export default function audit(state = INITIAL_STATE, action) {
  const actionTypes = {
    audit_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    audit_load_success() {
      return {
        ...state,
        ...action.payload
      };
    },
    audit_change_loading_text() {
      return {
        ...state,
        ...action.payload,
      }
    },
    audit_change_loading_email() {
      return {
        ...state,
        ...action.payload,
      }
    }
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
