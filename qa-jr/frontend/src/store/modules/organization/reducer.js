export const ORGANIZATION_LOAD_SUCCESS = "organization_load_success";
export const ORGANIZATION_LOAD_LIST_SUCCESS = "organization_load_list_success";
export const ORGANIZATION_LOAD_REQUEST = "organization_load_request";
export const ORGANIZATION_LOAD_FAIL = "organization_load_fail";
export const ORGANIZATION_UPDATE_SUCCESS = "organization_update_success";
export const ORGANIZATION_UPDATE_REQUEST = "organization_update_request";
export const ORGANIZATION_UPDATE_FAIL = "organization_update_fail";

const INITIAL_STATE = {
  updateLoading: false,
  updateFail: false,
  updateSuccess: false,
  loadLoading: true,
  loadFail: false,
  loadSuccess: false,
  organization: {}
};

export default function organization(state = INITIAL_STATE, action) {
  const actionTypes = {
    organization_update_request() {
      return {
        ...state,
        updateLoading: true,
        updateSuccess: false,
        updateFail: false
      };
    },
    organization_update_success() {
      return {
        ...state,
        organization: action.payload.organization,
        updateSuccess: true,
        updateLoading: false,
        updateFail: false
      };
    },
    organization_update_fail() {
      return {
        ...state,
        updateLoading: false,
        updateSuccess: false,
        updateFail: true,
        messageFail: action.payload.messageFail
      };
    },
    organization_load_request() {
      return {
        ...state,
        loadLoading: true,
        loadSuccess: false,
        loadFail: false
      };
    },
    organization_load_success() {
      return {
        ...state,
        organization: action.payload?.organization,
        organizations: action.payload?.organizations,
        user: action.payload?.user,
        loadSuccess: true,
        loadLoading: false,
        loadFail: false
      };
    },
    organization_load_list_success() {
      return {
        ...state,
        organizations: action.payload?.organizations,
        loadSuccess: true,
        loadLoading: false,
        loadFail: false
      };
    },
    organization_load_fail() {
      return {
        ...state,
        loadSuccess: false,
        loadLoading: false,
        loadFail: true,
        messageFail: action.payload.messageFail
      };
    }
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
