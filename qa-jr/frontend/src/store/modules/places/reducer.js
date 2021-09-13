export const PLACE_CHANGE_OPERATION_STATES = "place_change_operation_states";
export const PLACE_CREATE_SUCCESS = "place_create_success";

export const PLACE_LOAD_SUCCESS = "place_load_success";
export const PLACE_UPDATE_SUCCESS = "place_update_success";

export const PLACE_UPDATE_FAIL = "place_update_fail";
export const PLACE_EDIT_SUCCESS = "place_edit_success";
export const PLACE_UPDATE = "place_update";
export const PLACE_CHANGE_SELECTORS = "place_change_selectors";

export const FETCH_ADDRESS_SUCCESS = 'fetch_address_success'


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
}

const INITIAL_STATE = {
  places: [],
  total: 0,
  selectors: {},
  searchedAddress: {},
  ...operationStates,
};

export default function places(state = INITIAL_STATE, action) {
  const actionTypes = {
    fetch_address_success() {
      return {
        ...state,
        searchedAddress: { ...action.payload.address },
      }
    },
    place_change_selectors() {
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
    place_change_operation_states() {
      return {
        ...state,
        ...action.payload
      };
    },
    place_create_success() {
      return {
        ...state,
        places: [...state.places, action.payload.place],
      };
    },
    place_load_success() {
      return {
        ...state,
        places: action.payload.places,
        total: action.payload.total,
      };
    },
    place_update_success() {
      return {
        ...state,
        places: action.editPlace(state.places, action.payload)
      };
    },
    place_update_fail() {
      return {
        ...state,
        places: action.editPlace(state.places, action.payload)
      };
    },
    place_edit_success() {
      return {
        ...state,
        places: action.editPlace(state.places, action.payload)
      };
    },
    place_update() {
      return {
        ...state,
        places: action.editPlace(state.places, action.payload)
      };
    },
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
