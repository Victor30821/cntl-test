export const CHECKLIST_REPORT_LOAD_SUCCESS = "checklist_report_load_success";
export const CHECKLIST_REPORT_EXPORT_SUCCESS = "checklist_report_export_success";
export const CHECKLIST_REPORT_CHANGE_OPERATION_STATES = "checklist_report_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const checklistReport = [];

const INITIAL_STATE = {
    checklist: checklistReport,
    total: checklistReport.length,
    ...operationStates
};

export default function checklistReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    checklist_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    checklist_report_load_success() {
      return {
        ...state,
        checklist: action.payload.checklist,
        total: action.payload.total,
      };
    },

  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
