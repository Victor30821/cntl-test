export const PRODUCTIVITY_REPORT_LOAD_SUCCESS = "productivity_report_load_success";
export const PRODUCTIVITY_REPORT_EXPORT_SUCCESS = "productivity_report_export_success";
export const PRODUCTIVITY_REPORT_CHANGE_OPERATION_STATES = "productivity_report_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const productivityReport = []
const INITIAL_STATE = {
  productivityRoutes: productivityReport,
  total: 0,
  summary: {},
  ...operationStates
};

export default function productivityReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    productivity_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    productivity_report_load_success() {
      return {
        ...state,
        productivityRoutes: action.payload.productivityRoutes,
        summary: action.payload.summary,
        total: action.payload.total,
      };
    },

  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
