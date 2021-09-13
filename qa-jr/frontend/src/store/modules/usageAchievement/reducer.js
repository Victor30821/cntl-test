export const USAGE_LOAD_SUCCESS = "usage_load_success";
export const USAGE_LOAD_REQUEST = "usage_load_request";
export const USAGE_LOAD_FAIL = "usage_load_fail";

const INITIAL_STATE = {
  loadLoading: true,
  loadFail: false,
  loadSuccess: false,
  usage: {
    vehicles: {},
    basis: {},
    general: {},
  }
};

export default function usage(state = INITIAL_STATE, action) {
  const actionTypes = {
    usage_load_request() {
      return {
        ...state,
        loadLoading: true,
        loadSuccess: false,
        loadFail: false
      };
    },
    usage_load_success() {
      return {
        ...state,
        usage: action.payload?.usage,
        loadSuccess: true,
        loadLoading: false,
        loadFail: false
      };
    },
    usage_load_fail() {
      return {
        ...state,
        loadSuccess: false,
        loadLoading: false,
        loadFail: true,
        messageFail: action.payload.messageFail
      };
    }
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
