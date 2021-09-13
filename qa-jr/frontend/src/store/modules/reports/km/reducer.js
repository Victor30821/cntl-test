export const KM_REPORT_LOAD_SUCCESS = "km_report_load_success";
export const KM_REPORT_EXPORT_SUCCESS = "km_report_export_success";

export const KM_REPORT_CHANGE_OPERATION_STATES = "km_report_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const INITIAL_STATE = {
  kmReports: [],
  total: 0,
  summary: {},
  ...operationStates
};

export default function kmReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    km_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    km_report_load_success() {
      return {
        ...state,
        kmReports: action.payload.kmReports,
        total: action.payload.total,
        summary: action.payload.summary,
      };
    },

  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
