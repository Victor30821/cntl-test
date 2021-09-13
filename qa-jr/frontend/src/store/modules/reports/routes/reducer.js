export const ROUTES_REPORT_LOAD_SUCCESS = "routes_report_load_success";
export const ROUTES_LOAD_SUCCESS = "route_load_success";
export const ROUTES_REPORT_LOAD_ADDRESS_SUCCESS = "routes_report_load_address_sucess";
export const ROUTES_REPORT_LOAD_SUCCESS_SUMMARY = "routes_report_load_success_summary";
export const ROUTES_REPORT_EXPORT_SUCCESS = "routes_report_export_success";
export const ROUTES_REPORT_CHANGE_OPERATION_STATES_ATTACH_DRIVER = "routes_report_change_operation_states_attach_driver";
export const ROUTES_REPORT_CHANGE_OPERATION_STATES = "routes_report_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const operationStatesAttachDriver = {
  attachLoading: false,
  attachSuccess: false,
  attachFail: false,
}

const INITIAL_STATE = {
  driver: {},
  last_positions: [],
  last_positions_osrm: [],
  pointsfromDirection: {},
  vehicle: {},
  route: {},
  routes: [],
  total: 0,
  summary: {},
  address: [],
  ...operationStates,
  ...operationStatesAttachDriver,
};

export default function routesReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    routes_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    routes_report_load_success() {
      return {
        ...state,
        routes: action.payload.routes,
        total: action.payload.total,
        summary: action.payload.summary,
      };
    },
    routes_report_load_address_sucess() {
      return {
        ...state,
        address: action.payload.address,
        routes: state.routes,
        total: state.total,
      }
    },
    routes_report_load_success_summary() {
      return {
        ...state,
        summary: action.payload.summary
      };
    },
    routes_report_change_operation_states_attach_driver() {
      return {
        ...state,
        ...action.payload,
      }
    },
    route_load_success() {
      return {
        ...state,
        ...action.payload,
      }
    },
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
