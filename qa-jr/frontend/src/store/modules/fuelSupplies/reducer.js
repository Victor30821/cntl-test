export const FUEL_SUPPLIE_CREATE_SUCCESS = "fuel_supplie_create_success";

export const FUEL_CHANGE_OPERATION_STATES = "fuel_change_operation_states";
export const FUEL_CHANGE_SELECTORS = "fuel_change_selectors";

const operationStates = {
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
}

const INITIAL_STATE = {
  fuelSupplies: [],
  total: 0,
  selectors: {},
  ...operationStates
};

export default function fuelSupplies(state = INITIAL_STATE, action) {
  const actionTypes = {
    fuel_change_selectors() {
      if (action.payload.reset) {
        return {
          ...state,
          selectors: {}
        }
      }
      return {
        ...state,
        selectors: {
          ...state.selectors,
          ...action.payload.selectors
        },
      };
    },
    fuel_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      };
    },
    fuel_supplie_create_success() {
      return {
        ...state,
        fuelSupplies: action.payload.fuelSupplies,
      };
    },
    
  }

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
