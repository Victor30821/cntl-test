export const USER_SESSION_UPDATE_SUCCESS = "user_session_update_success";
export const USER_LOGIN_SUCCESS = "user_login_success";
export const USER_LOGOUT_SUCCESS = "user_logout_success";
export const USER_CHANGE_OPERATION_STATES = "user_change_operation_states";
export const CHANGE_ORGANIZATION = "change_organization";

const operationStates = {
  loginSuccess: true,
  loginFail: false,
  loginLoading: false,
  logoutSuccess: true,
  logoutFail: false,
  logoutLoading: false,
  forgotFail: false,
  forgotSuccess: false,
  forgotLoading: false,
  recoverLoading: false,
  recoverSuccess: false,
  recoverFail: false,
}

const INITIAL_STATE = {
  user: {},
  ...operationStates,
};

export default function auth(state = INITIAL_STATE, action) {
  const actionTypes = {
    user_change_operation_states() {
      return {
        ...state,
        ...action.payload
      };
    },
    user_session_update_success() {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.user,
          token: state.user?.token,
          id: state.user?.id,
        },
      };
    },
    user_login_success() {
      return {
        ...state,
        user: { ...action.payload.user },
      };
    },
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
