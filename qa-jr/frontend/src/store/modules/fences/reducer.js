export const FENCE_CHANGE_OPERATION_STATES = "fence_change_operation_states";
export const FENCE_CREATE_SUCCESS = "fence_create_success";
export const FENCE_CREATE_REQUEST = "fence_create_request";

export const FENCE_LOAD_SUCCESS = "fence_load_success";
export const FENCE_UPDATE_SUCCESS = "fence_update_success";

export const FENCE_UPDATE_FAIL = "fence_update_fail";
export const FENCE_EDIT_SUCCESS = "fence_edit_success";
export const FENCE_UPDATE = "fence_update";

const INITIAL_STATE = {
  fences: [],
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

export default function fences(state = INITIAL_STATE, action) {
  const actionTypes = {
    fence_change_operation_states() {
      return {
        ...state,
        ...action.payload
      };
    },
    fence_create_success() {
      return {
        ...state,
        fences: [...state.fences, action.payload.fence],
      };
    },
    fence_load_success() {
      return {
        ...state,
        fences: action.payload.fences,
        total: action.payload.total,
      };
    },
    fence_update() {
      return {
        ...state,
        fences: action.editFence(state.fences, action.payload)
      };
    },
    fence_update_success() {
      return {
        ...state,
        fences: action.editFence(state.fences, action.payload)
      };
    },

    fence_update_fail() {
      return {
        ...state,
        fences: action.editFence(state.fences, action.payload)
      };
    },
    fence_edit_success() {
      return {
        ...state,
        fences: action.editFence(state.fences, action.payload)
      };
    }
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
