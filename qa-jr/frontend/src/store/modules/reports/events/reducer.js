export const EVENTS_REPORT_LOAD_SUCCESS = "events_report_load_success";
export const EVENTS_REPORT_EXPORT_SUCCESS = "events_report_export_success";
export const EVENTS_REPORT_CHANGE_OPERATION_STATES = "events_report_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const eventsReport = [];

const INITIAL_STATE = {
  events: eventsReport,
  total: eventsReport.length,
  ...operationStates
};

export default function eventsReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    events_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    events_report_load_success() {
      return {
        ...state,
        events: action.payload.events,
        total: action.payload.total,
      };
    },

  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
