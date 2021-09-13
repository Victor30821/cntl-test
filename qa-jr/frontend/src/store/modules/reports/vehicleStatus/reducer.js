export const VEHICLE_STATUS_LOAD_SUCCESS = "vehicle_status_load_success";
export const VEHICLE_STATUS_EXPORT_SUCCESS = "vehicle_status_export_success";

export const VEHICLE_STATUS_CHANGE_OPERATION_STATES = "vehicle_status_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const INITIAL_STATE = {
  vehicleStatusReports: [],
  total: 0,
  ...operationStates
};

export default function vehicleStatusReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    vehicle_status_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    vehicle_status_load_success() {
      return {
        ...state,
        vehicleStatusReports: action.payload.vehicleStatusReports,
        total: action.payload.total,
      };
    },

  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
