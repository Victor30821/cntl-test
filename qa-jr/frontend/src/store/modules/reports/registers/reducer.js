export const FUEL_REGISTERS_REPORT_LOAD_SUCCESS = "fuel_registers_report_load_success";
export const FUEL_REGISTERS_REPORT_EXPORT_SUCCESS = "fuel_registers_report_export_success";
export const FUEL_REGISTERS_REPORT_CHANGE_OPERATION_STATES = "fuel_registers_report_change_operation_states";

const operationStates = {
  exportLoading: false,
  exportSuccess: false,
  exportFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const fuelRegistersReport = []
const INITIAL_STATE = {
  fuels: fuelRegistersReport,
  total: fuelRegistersReport.length,
  ...operationStates
};

export default function fuelRegistersReports(state = INITIAL_STATE, action) {
  const actionTypes = {

    fuel_registers_report_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    fuel_registers_report_load_success() {
      return {
        ...state,
        fuels: action.payload.fuels,
        total: action.payload.total,
      };
    },

  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
