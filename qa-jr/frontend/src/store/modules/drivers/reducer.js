export const DRIVER_CHANGE_OPERATION_STATES = "driver_change_operation_states";
export const DRIVER_CREATE_SUCCESS = "driver_create_success";
export const DRIVER_CREATE_FAIL = "driver_create_fail";

export const DRIVER_LOAD_SUCCESS = "driver_load_success";
export const DRIVER_UPDATE_SUCCESS = "driver_update_success";

export const DRIVER_UPDATE_FAIL = "driver_update_fail";
export const DRIVER_EDIT_SUCCESS = "driver_edit_success";
export const DRIVER_EDIT_FAIL = "driver_edit_fail";
export const DRIVER_UPDATE = "driver_update";
export const DRIVER_DELETE = "driver_delete";
export const DRIVER_DELETE_FAIL = "driver_delete_fail";
export const DRIVERS_BY_IDS = "drivers_by_ids";

export const DRIVERS_ADD_DRIVER = "drivers_add_driver";

const INITIAL_STATE = {
  all_drivers: [],
  drivers: [],
  driversByids: [],
  messageFail: "",
  total: 0,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
  editLoading: false,
  editSuccess: false,
  editFail: false,
  updateLoading: false
};

export default function drivers(state = INITIAL_STATE, action) {
  const actionTypes = {
    driver_change_operation_states() {
      return {
        ...state,
        ...action.payload
      };
    },
    driver_create_success() {
      return {
        ...state,
        drivers: [...state.drivers, action.payload.driver],
      };
    },
    driver_create_fail() {
      return {
        ...state,
        messageFail: action.payload.messageFail,
      };
    },
    driver_load_success() {
      return {
        ...state,
        ...action.payload,
        all_drivers: action.payload.all_drivers || action.payload.drivers
      };
    },
    driver_update_success() {
      return {
        ...state,
        drivers: action.editDriver(state.drivers, action.payload)
      };
    },

    driver_update_fail() {
      return {
        ...state,
        drivers: action.editDriver(state.drivers, action.payload)
      };
    },
    driver_edit_fail() {
      return {
        ...state,
        messageFail: action.payload.messageFail,
      };
    },
    driver_edit_success() {
      return {
        ...state,
        drivers: action.editDriver(state.drivers, action.payload)
      };
    },
    driver_update() {
      return {
        ...state,
        drivers: action.editDriver(state.drivers, action.payload)
      };
    },
    driver_delete() {
      state.drivers.splice(action.payload.driverIndex, 1);
      return {
        ...state,
      };
    },
    driver_delete_fail() {
      state.drivers.splice(action.payload.driverIndex, 0, action.payload.driver);

      return {
        ...state,
      };
    },
    drivers_by_ids() {
      if(action.payload.clear) state.driversByids = [];
      state.driversByids.push(action.payload.driver);
      return {
          ...state,
          driversByids: state.driversByids
      }
  },
  drivers_add_driver() {
    const [insert_driver={}] = action.payload.all_drivers.filter(driver => driver.id === action.payload.value.driver.driver_id);
    state.drivers.push(insert_driver);
    state.drivers = state.drivers.sort((a, b) => a.id - b.id);
    return {
      ...state,
    }
  }
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
