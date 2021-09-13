export const USER_CREATE_SUCCESS = "user_create_success";
export const USER_CREATE_FAIL = "user_create_fail";

export const USER_LOAD_SUCCESS = "user_load_success";

export const USER_UPDATE_FAIL = "user_update_fail";

export const USER_EDIT_FAIL = "user_edit_fail";
export const USER_EDIT_SUCCESS = "user_edit_success";
export const USER_EDIT_REQUEST = "user_edit_request";
export const USER_UPDATE = "user_update";

export const USER_CHANGE_OPERATION_STATES = "user_change_operation_states";
export const USER_CHANGE_SELECTORS = "user_change_selectors";

const operationStates = {
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
  editLoading: false,
  editSuccess: false,
  editFail: false,
  updateLoading: false,
  updateSuccess: false,
  updateFail: false,
};
const defaultSelectorsValues = {
  country: { label: "Brasil", value: "BR" },
  language: { label: "Português", value: "pt" },
  timezone: { label: "(GMT-03:00) Sao Paulo", value: "America/Sao_Paulo" },
  short_date_format: { label: "DD/MM/YYYY", value: "DD/MM/YYYY", },
  short_time_format: { value: "HH:MM:SS", label: "HH:MM:SS" },
  decimal_separators: { value: ",", label: "," },
  thousands_separators: { value: ".", label: "." },
  distance_unit: { value: "km", label: "km" },
  volumetric_measurement_unit: { value: 1, label: "ℓ - Liter" },
  currency: { value: "BRL", label: "Real" },
  groups: [],
}
const INITIAL_STATE = {
  ...operationStates,
  users: [],
  total: 0,
  messageFail: "",
  selectors: {
    ...defaultSelectorsValues
  },
  user: {
    user_setting: {},
    vehicles: [],
  },
};

export default function users(
  state = INITIAL_STATE,
  action = { payload: { messageFail: "" } }
) {
  const actionTypes = {
    user_update() {
      return {
        ...state,
        users: action.editUser(state.users, action.payload.newUser)
      };
    },
    user_change_operation_states() {
      return {
        ...state,
        ...action.payload
      };
    },
    user_change_selectors() {
      if (action.payload.reset) {
        return {
          ...state,
          selectors: {
            ...defaultSelectorsValues
          }
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
    user_create_success() {
      return {
        ...state,
        users: [...state.users, action.payload.user],
      };
    },
    user_create_fail() {
      return {
        ...state,
        messageFail: action.payload.messageFail,
      };
    },

    user_load_success() {
      return {
        ...state,
        users: action.payload.users,
        user: action.payload.user,
        total: action.payload.total
      };
    },
    user_update_fail() {
      return {
        ...state,
        messageFail: action.payload.messageFail,
      };
    },
    user_edit_fail() {
      return {
        ...state,
        messageFail: action.payload.messageFail,
      };
    },
    user_edit_request() {
      return {
        ...state,
      };
    },
    user_edit_success() {
      return {
        ...state,
        users: action.payload.users,
        user: action.payload.user,
      };
    },
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
