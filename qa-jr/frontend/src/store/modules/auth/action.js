import {
  USER_LOGIN_SUCCESS,
  USER_SESSION_UPDATE_SUCCESS,
  USER_CHANGE_OPERATION_STATES
} from "./reducer";
import storage from "redux-persist/lib/storage";
import { api } from "services/api";
import qs from "qs";
import { getUsersScreens } from "utils/verifyUserAccess";
import { enableScreens, loadOrganization } from "store/modules";
import { toast } from "react-toastify";
import { localizedStrings } from "constants/localizedStrings";
import { HTTP_STATUS } from "constants/environment";

export function userChangeOperationStates({
  loginSuccess = true,
  loginFail = false,
  loginLoading = false,
  logoutSuccess = true,
  logoutFail = false,
  logoutLoading = false,
  forgotFail = false,
  forgotSuccess = false,
  forgotLoading = false,
  recoverLoading = false,
  recoverSuccess = false,
  recoverFail = false,
}) {
  return {
    type: USER_CHANGE_OPERATION_STATES,
    payload: {
      loginSuccess,
      loginFail,
      loginLoading,
      logoutSuccess,
      logoutFail,
      logoutLoading,
      forgotFail,
      forgotSuccess,
      forgotLoading,
      recoverLoading,
      recoverSuccess,
      recoverFail,
    }
  };
}
export function fetchLoginSuccess({ user }) {
  return {
    type: USER_LOGIN_SUCCESS,
    payload: {
      user
    }
  };
}
export function updateUserInSession(user) {
  return {
    type: USER_SESSION_UPDATE_SUCCESS,
    payload: {
      user
    }
  };
}

export function fetchLogoutSuccess() {
  return {
    type: "RESET_STATE",
  };
}

export const forgotPassword = ({
  email
}) => async dispatch => {
  dispatch(userChangeOperationStates({ forgotLoading: true }))
  try {

    const URL = "/forgot/v1";
    const params = {
      forgot: {
        email,
      },
    };

    const {
      status
    } = await api.put(URL, qs.stringify(params));

    if (status !== HTTP_STATUS.SUCCESS) throw Error('error: forgot password');

    dispatch(userChangeOperationStates({ forgotSuccess: true }));


  } catch (error) {
    dispatch(userChangeOperationStates({ forgotFail: true }))
  }
};
export const recoverPassword = ({
  password,
  token,
  email,
}) => async dispatch => {
  dispatch(userChangeOperationStates({ recoverLoading: true }))
  try {

    const URL = "/user/v1/recovery-password";
    const params = {
      user: {
        email,
        token,
        password,
      },
    };

    const {
      status
    } = await api.put(URL, qs.stringify(params),
      {
        headers: {
          Authorization: "Bearer " + token
        }
      });

    if (status !== HTTP_STATUS.SUCCESS) throw new Error('error: recover password');

    toast.success(localizedStrings.passwordChangedSuccessfully);

    dispatch(userChangeOperationStates({ recoverSuccess: true }));

  } catch (error) {
    dispatch(userChangeOperationStates({ recoverFail: true }))
  }
};
export const login = (data) => async (dispatch) => {
  dispatch(userChangeOperationStates({ loginLoading: true }))
  try {
    const { email, password } = data;
    const organization_id = (data && data.organization_id) || false;

    const URL = "/login/v1";
    const params = {
      login: {
        email,
        password,
      },
    };

    if(organization_id) params.organization_id = Number(organization_id);

    const {
      data: { user }
    } = await api.post(URL, qs.stringify(params));

    if (!user) return toast.error(localizedStrings.loginPage.somethingUnexpectedHappen);
    if (!user.status) return toast.error(localizedStrings.loginPage.userInactive);

    await storage.setItem("@token", JSON.stringify({ token: user.token }));
    await storage.setItem("@credential", JSON.stringify({ email, password }));

    const {
      screens
    } = getUsersScreens({
      role_id: user.role_id,
    })

    if (!Array.isArray(screens) || !screens?.length) throw new Error('Error: cannot get screens to user');

    dispatch(enableScreens({
      screens
    }))
    const isOrganizationActive = await dispatch(loadOrganization({
      organization_id: Number(organization_id) || user.organization_id
    }))

    if (!isOrganizationActive) return toast.error(localizedStrings.loginPage.organizationInactive);

    await storage.setItem("user_settings", JSON.stringify({ user_settings: user?.user_settings }));

    dispatch(fetchLoginSuccess({
      user: {
        id: user.id,
        is_admin: user.is_admin,
        has_logged: user.has_logged,
        name: user.user_settings?.name,
        phone: user.user_settings?.phone,
        company_name: user.company_name,
        email: user.email,
        organization_id: Number(organization_id) || user.organization_id,
        organization_settings: user.organization_settings,
        role_id: user.role_id,
        status: user.status,
        token: user.token,
        user_settings: {
          country: user.user_settings?.country,
          created: user.user_settings?.created,
          currency: user.user_settings?.currency,
          decimal_separators: user.user_settings?.decimal_separators,
          distance_unit: user.user_settings?.distance_unit,
          language: user.user_settings?.language,
          modified: user.user_settings?.modified,
          short_date_format: user.user_settings?.short_date_format,
          short_time_format: user.user_settings?.short_time_format,
          thousands_separators: user.user_settings?.thousands_separators,
          timezone: user.user_settings?.timezone,
          consultant_user: user.user_settings?.consultant_user,
          volumetric_measurement_unit: user.user_settings?.volumetric_measurement_unit,
        },
        vehicles: user.vehicles,
        groups: user.groups,
        clients: user.clients,
      }
    }));

    const URL_ORG = "/organization/v1/";
    const response = await api.get(`${URL_ORG}?user_id=${user.id}&limit=1000`);

    await storage.setItem("@associated_organization", JSON.stringify({organizations: response?.data?.organizations}));

    dispatch(userChangeOperationStates({ loginSuccess: true }));

  } catch (error) {
    dispatch(userChangeOperationStates({ loginFail: true }))
  }
};

export const logout = data => async dispatch => {
  dispatch(userChangeOperationStates({ logoutLoading: true }))
  try {
    const URL = "/logout/v1";

    await api.post(URL);

    dispatch(fetchLogoutSuccess());
    dispatch(userChangeOperationStates({ logoutSuccess: true }))
  } catch (error) {
    dispatch(fetchLogoutSuccess());
    dispatch(userChangeOperationStates({ logoutFail: true }))
  }
};
