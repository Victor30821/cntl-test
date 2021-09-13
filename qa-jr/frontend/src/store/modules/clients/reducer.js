export const CLIENT_CHANGE_OPERATION_STATES = "client_change_operation_states";
export const CLIENT_CREATE_SUCCESS = "client_create_success";

export const CLIENT_LOAD_SUCCESS = "client_load_success";
export const CLIENT_UPDATE_SUCCESS = "client_update_success";

export const CLIENT_UPDATE_FAIL = "client_update_fail";
export const CLIENT_EDIT_SUCCESS = "client_edit_success";
export const CLIENT_UPDATE = "client_update";
export const CLIENT_CHANGE_SELECTORS = "client_change_selectors";

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
  clients: [],
  total: 0,
  selectors: {},
  searchedAddress: {},
  ...operationStates,
};

export default function clients(state = INITIAL_STATE, action) {
  const actionTypes = {
    fetch_address_success() {
      return {
        ...state,
        searchedAddress: { ...action.payload.address },
      }
    },
    client_change_selectors() {
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
    client_change_operation_states() {
      return {
        ...state,
        ...action.payload
      };
    },
    client_create_success() {
      return {
        ...state,
        clients: [...state.clients, action.payload.client],
      };
    },
    client_load_success() {
      return {
        ...state,
        clients: action.payload.clients,
        total: action.payload.total,
      };
    },
    client_update_success() {
      return {
        ...state,
        clients: action.editClient(state.clients, action.payload)
      };
    },
    client_update_fail() {
      return {
        ...state,
        clients: action.editClient(state.clients, action.payload)
      };
    },
    client_edit_success() {
      return {
        ...state,
        clients: action.editClient(state.clients, action.payload)
      };
    },
    client_update() {
      return {
        ...state,
        clients: action.editClient(state.clients, action.payload)
      };
    },
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
