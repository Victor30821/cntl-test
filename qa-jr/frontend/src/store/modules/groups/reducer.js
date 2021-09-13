export const GROUP_CREATE_SUCCESS = "group_create_success";
export const GROUP_LOAD_SUCCESS = "group_load_success";
export const GROUP_LOAD_TAGGING_BY_NAME_SUCCESS = "group_load_tagging_by_name_success";
export const GROUP_UPDATE_SUCCESS = "group_update_success";

export const GROUP_DELETE = "group_delete";
export const GROUP_UPDATE = "group_update";
export const GROUP_UPDATE_FAIL = "group_update_fail";

export const GROUP_CHANGE_OPERATION_STATES = "group_change_operation_states";

const operationStates = {
  updateLoading: false,
  updateFail: false,
  deleteLoading: false,
  deleteSuccess: false,
  deleteFail: false,
  editLoading: false,
  editSuccess: false,
  editFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
}

const INITIAL_STATE = {
  groups: [],
  total: 0,
  searchedGroup: [],
  searchedGroupTotal: 0,
  ...operationStates
};

export default function groups(state = INITIAL_STATE, action) {
  const actionTypes = {
    group_create_success() {
      return {
        ...state,
        groups: [...state.groups, action.payload.group],
      };
    },
    group_change_operation_states() {
      return {
        ...state,
        ...action.payload,
        searchedGroup: action.payload.resetSearchGroup ? [] : state.searchedGroup,
        searchedGroupTotal: action.payload.resetSearchGroup ? 0 : state.searchedGroupTotal,
      }
    },
    group_load_success() {
      return {
        ...state,
        groups: action.payload.groups,
        total: action.payload.total,
      };
    },
    group_load_tagging_by_name_success() {
      return {
        ...state,
        searchedGroup: action.payload.groups,
        searchedGroupTotal: action.payload.total,
      };
    },
    group_update() {
      return {
        ...state,
        groups: action.editGroup(state.groups, action.payload)
      };
    },
    group_update_success() {
      return {
        ...state,
        groups: action.editGroup(state.groups, action.payload)
      };
    },

    group_update_fail() {
      return {
        ...state,
        groups: action.editGroup(state.groups, action.payload)
      };
    },
 

    group_delete() {
      return {
        ...state,
        groups: action.deleteGroup(state.groups, action.payload.group)
      };
    },
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
