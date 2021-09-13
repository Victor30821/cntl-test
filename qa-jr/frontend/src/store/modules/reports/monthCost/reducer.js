export const MONTH_COST_REPORT_LOAD_SUCCESS = "month_cost_report_load_success";
export const MONTH_COST_REPORT_EXPORT_SUCCESS = "month_cost_report_export_success";
export const MONTH_COST_REPORT_CHANGE_OPERATION_STATES = "month_cost_report_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const monthCostReport = [];

const INITIAL_STATE = {
  monthCost: monthCostReport,
  total: 0,
  ...operationStates
};

export default function monthCostReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    month_cost_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    month_cost_report_load_success() {
      return {
        ...state,
        monthCost: action.payload.monthCost,
        total: action.payload.total,
      };
    },

  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
