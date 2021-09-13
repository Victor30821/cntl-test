export const CONSUMPTION_MONTH_REPORT_LOAD_SUCCESS = "consumption_month_report_load_success";
export const CONSUMPTION_MONTH_REPORT_EXPORT_SUCCESS = "consumption_month_report_export_success";
export const CONSUMPTION_MONTH_REPORT_CHANGE_OPERATION_STATES = "consumption_month_report_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const consumptionMonthReport = [];

const INITIAL_STATE = {
  consumptionMonth: consumptionMonthReport,
  total: consumptionMonthReport.length,
  ...operationStates
};

export default function consumptionMonthReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    consumption_month_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    consumption_month_report_load_success() {
      return {
        ...state,
        consumptionMonth: action.payload.consumptionMonth,
        total: action.payload.total,
      };
    },

  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
