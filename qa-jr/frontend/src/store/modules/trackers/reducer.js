export const TRACKER_CREATE_SUCCESS = "tracker_create_success";
export const TRACKER_LOAD_SUCCESS = "tracker_load_success";
export const TRACKER_LOAD_ONE_SUCCESS = "tracker_load_one_success";
export const TRACKER_CHANGE_OPERATION_STATES = "tracker_change_operation_states";
export const TRACKER_CHANGE_SELECTORS = "tracker_change_selectors";
export const SEND_SMS = "send_sms_command";

const operationStates = {
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
  editLoading: false,
  editSuccess: false,
  editFail: false
}

const INITIAL_STATE = {
  trackers: [],
  total: 0,
  searchedTracker: {},
  ...operationStates,
};

export default function trackers(state = INITIAL_STATE, action) {
  const actionTypes = {
    tracker_change_operation_states() {
      return {
        ...state,
        ...action.payload
      };
    },
    tracker_load_success() {
      return {
        ...state,
        trackers: action.payload.trackers,
        total: action.payload.total
      };
    },
    tracker_load_one_success() {
      return {
        ...state,
        searchedTracker: action.payload.tracker,
      };
    },
    tracker_change_selectors() {
      if (action.payload.reset) {
        return {
          ...state,
          selectors: {},
        }
      }
      return {
        ...state,
        selectors: {
          ...state.selectors,
          ...action.payload.selectors
        },
      };
    },
    send_sms_command() {
      return {
        ...state,
        loadingSendSMS: action.payload.loadingSendSMS
      };
    }
  };
  return actionTypes[action.type]?.() ?? state;
}
