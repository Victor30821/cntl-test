export const FUELSUPPLIE_CREATE_SUCCESS = "fuelsupplie_create_success";
export const FUELSUPPLIE_CREATE_REQUEST = "fuelsupplie_create_request";
export const FUELSUPPLIE_CREATE_FAIL = "fuelsupplie_create_fail";
export const FUELSUPPLIE_CREATE_RESET = "fuelsupplie_create_reset";

export const FUELSUPPLIE_LOAD_SUCCESS = "fuelsupplie_load_success";
export const FUELSUPPLIE_LOAD_REQUEST = "fuelsupplie_load_request";
export const FUELSUPPLIE_LOAD_FAIL = "fuelsupplie_load_fail";

const INITIAL_STATE = {
  fuelSupplies: [
    {
      id: 12,
      name: "Fulano",
      nickname: "Fulaninho",
      phone: "+5513999999999",
      driver_license: "76850104888",
      code: "XXXXX",
      expire_driver_license: "2020-07-22",
      organization_id: 13,
      status: 1,
      pin: 2271,
      created: "2020-07-22",
      modified: "2020-07-22"
    }
  ],
  total: 0,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
};

export default function fuelSupplies(state = INITIAL_STATE, action) {
  const actionTypes = {
    fuelSupplie_create_request() {
      return {
        ...state,
        createLoading: true,
        createSuccess: false,
        createFail: false
      };
    },
    fuelSupplie_create_success() {
      return {
        ...state,
        drivers: [...state.drivers, action.payload.driver],
        createSuccess: true,
        createLoading: false,
        createFail: false
      };
    },
    fuelSupplie_create_fail() {
      return {
        ...state,
        createLoading: false,
        createSuccess: false,
        createFail: true
      };
    },
    fuelSupplie_create_reset() {
      return {
        ...state,
        createLoading: false,
        createSuccess: false,
        createFail: false
      };
    },
    fuelSupplie_load_success() {
      return {
        ...state,
        drivers: action.payload.drivers,
        total: action.payload.total,
        loadLoading: false,
        loadSuccess: true,
        loadFail: false
      };
    },
    fuelSupplie_load_request() {
      return {
        ...state,
        loadLoading: true,
        loadSuccess: false,
        loadFail: false
      };
    },
    fuelSupplie_load_fail() {
      return {
        ...state,
        loadLoading: false,
        loadSuccess: false,
        loadFail: true
      };
    },
  }

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
