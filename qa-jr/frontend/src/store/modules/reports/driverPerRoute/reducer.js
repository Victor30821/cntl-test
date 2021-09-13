export const DRIVERS_PER_ROUTE_REPORT_LOAD_SUCCESS = "drivers_per_route_report_load_success";
export const DRIVERS_PER_ROUTE_REPORT_EXPORT_SUCCESS = "drivers_per_route_report_export_success";
export const DRIVERS_PER_ROUTE_REPORT_CHANGE_OPERATION_STATES = "drivers_per_route_report_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const INITIAL_STATE = {
  driversPerRoute: [],
  newDriversPerRoute: [],
  summary: {},
  total: 0,
  ...operationStates
};

export default function driversPerRouteReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    drivers_per_route_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    drivers_per_route_report_load_success() {
      return {
        ...state,
        driversPerRoute: action.payload.driversPerRoute,
        newDriversPerRoute: action.payload.newDriversPerRoute,
        summary: action.payload.summary,
        total: action.payload.total,
      };
    },

  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
