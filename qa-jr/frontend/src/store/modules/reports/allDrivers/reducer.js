export const ALL_DRIVERS_REPORT_LOAD_SUCCESS = "all_drivers_report_load_success";
export const ALL_DRIVERS_REPORT_EXPORT_SUCCESS = "all_drivers_report_export_success";
export const ALL_DRIVERS_REPORT_CHANGE_OPERATION_STATES = "all_drivers_report_change_operation_states";
export const ALL_DRIVERS_SET_NIGHT_LOADING = "all_drivers_set_night_loading";
export const CHANGE_LOADING_OPERATION_STATES = "change_loading_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const INITIAL_STATE = {
  allDrivers: [],
  total: 0,
  ...operationStates,
};

export default function allDriversReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    all_drivers_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    all_drivers_report_load_success() {
      return {
        ...state,
        allDrivers: action.payload.allDrivers,
        total: action.payload.total,
      };
    },
    change_loading_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    }
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
