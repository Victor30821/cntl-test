import {
  USER_LOAD_SUCCESS,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAIL,
  USER_UPDATE_FAIL,
  USER_EDIT_SUCCESS,
  USER_CHANGE_OPERATION_STATES,
  USER_CHANGE_SELECTORS,
  USER_UPDATE,
} from "./reducer";
import qs from "qs";
import { validateData } from "../helpers";
import { api } from "services/api";
import { toast } from "react-toastify";
import { localizedStrings } from "constants/localizedStrings";
import { updateUserInSession, enableScreens } from 'store/modules';
import { getUsersScreens } from "utils/verifyUserAccess";

const editExistingUser = (users, newUser) => {
  return users.map(user => {
    if (user.id === newUser.id) {
      user = { ...user, ...newUser.user }
    }
    return user;
  })
}
function userChangeOperationStates({
  loadLoading = false,
  loadSuccess = false,
  loadFail = false,
  createLoading = false,
  createSuccess = false,
  updateLoading = false,
  updateSuccess = false,
  updateFail = false,
  createFail = false,
  editLoading = false,
  editSuccess = false,
  editFail = false
}) {
  return {
    type: USER_CHANGE_OPERATION_STATES,
    payload: {
      loadLoading,
      loadSuccess,
      loadFail,
      createLoading,
      createSuccess,
      createFail,
      updateLoading,
      updateSuccess,
      updateFail,
      editLoading,
      editSuccess,
      editFail,
    }
  };
}
/* LOAD  */
export function fetchLoadSuccess({ users = [], user = {}, total = 0 }) {
  return {
    type: USER_LOAD_SUCCESS,
    payload: {
      users,
      user,
      total,
    },
  };
}
export function userChangeSelectors({
  selectors
}, reset) {
  return {
    type: USER_CHANGE_SELECTORS,
    payload: {
      selectors,
      reset
    }
  };
}
export function fetchUserCreateSuccess(user) {
  return {
    type: USER_CREATE_SUCCESS,
    payload: {
      user,
    },
  };
}

export function fetchUserCreateFail(messageFail) {
  return {
    type: USER_CREATE_FAIL,
    payload: {
      messageFail,
    },
  };
}

export function fetchUserUpdateFail(messageFail) {
  return {
    type: USER_UPDATE_FAIL,
    payload: {
      messageFail,
    },
  };
}
export function updateOneUser({ newUser }) {
  return {
    type: USER_UPDATE,
    payload: {
      newUser,
    },
    editUser: editExistingUser
  };
}


export function fetchUserEditSuccess({ users = [], user = {}, total = 0 }) {
  return {
    type: USER_EDIT_SUCCESS,
    payload: {
      users,
      user,
      total,
    },
  };
}

export const loadProfileUser = (data) => async (dispatch) => {
  try {
    const URL = '/user/v1/' + data.id;

    dispatch(userChangeOperationStates({ editLoading: true }));
    const response = await api.get(URL)

    dispatch(fetchUserEditSuccess({ users: [], user: response.data.user }));
    dispatch(userChangeOperationStates({ editSuccess: true }));
  } catch (error) {
    toast.error(localizedStrings.errorWhenCreatingUser)
    dispatch(userChangeOperationStates({ editFail: true }));

  }
};

export const deleteUser = data => async (dispatch) => {
  const rollbackData = JSON.parse(JSON.stringify(data));
  const URL = '/user/v1/' + data?.id;
  try {
    data.status = 0;
    dispatch(updateOneUser({ newUser: data }));
    dispatch(userChangeOperationStates({ updateLoading: true }));

    toast.info(localizedStrings.pending.update.user);

    await api.delete(URL);

    dispatch(userChangeOperationStates({ updateSuccess: true }));
    toast.success(localizedStrings.success.update.user);
  } catch (error) {
    dispatch(updateOneUser({ newUser: rollbackData }));
    toast.error(localizedStrings.error.update.user);
    dispatch(userChangeOperationStates({ updateFail: true }));
  }
};

export const editUserStatus = (data) => async (dispatch) => {
  dispatch(userChangeOperationStates({ updateLoading: true }));

  const URL = '/user/v1/' + data?.user?.id;

  let rollbackData = {}

  const newUser = {
    user: {
      ...data?.user,
      status: 1,
    },
    id: data?.user?.id,
  };

  try {

    rollbackData = JSON.parse(JSON.stringify(data?.user));

    toast.info(localizedStrings.pending.update.user);
    dispatch(updateOneUser({ newUser }));

    const {
      // eslint-disable-next-line
      data: { user: userData }
    } = await api.put(URL, qs.stringify({
      user: {
        status: 1,
      }
    }));

    toast.success(localizedStrings.success.update.user);
    dispatch(userChangeOperationStates({ updateSuccess: true }));

  } catch (error) {

    dispatch(updateOneUser({ newUser: rollbackData }));

    toast.error(localizedStrings.error.update.user);
    dispatch(userChangeOperationStates({ updateFail: true }));
  }
};

const getValues = item => item.value;

export const updateUser = (data) => async (dispatch) => {
  dispatch(userChangeOperationStates({ editLoading: true }));
  try {
    const URL = '/user/v1/' + data.id;

    const userData = {
      status: data.status,
      name: data.name,
      email: data.email,
      type: data.type?.value,
      groups: data?.groups?.map(getValues),
      clients: data?.clients?.map(getValues),
      vehicles: data?.vehicles?.map(vehicle => vehicle.value),
      phone: data.phone.replace(/[( )-]/g, ""),
      password: data?.password,
      user_setting: {
        timezone: data?.timezone?.value,
        country: data?.country?.value,
        language: data?.language?.value,
        distance_unit: data?.distance_unit?.value,
        thousands_separators: data?.thousands_separators?.value,
        decimal_separators: data?.decimal_separators?.value,
        short_date_format: data?.short_date_format?.value,
        short_time_format: data?.short_time_format?.value,
        volumetric_measurement_unit: data?.volumetric_measurement_unit?.value,
        currency: data?.currency?.value,
      },
    };
    if (!userData.password) delete userData.password;
    const {
      // eslint-disable-next-line
      data: { user }
    } = await api.put(URL, qs.stringify({ user: userData }));

    if (data?.updateUserSession) {

      dispatch(updateUserInSession({
        name: user?.name,
        phone: user?.phone,
        email: user?.email,
        role_id: user?.type,
        user_settings: {
          country: user?.user_setting?.country,
          currency: user?.user_setting?.currency,
          decimal_separators: user?.user_setting?.decimal_separators,
          distance_unit: user?.user_setting?.distance_unit,
          language: user?.user_setting?.language,
          short_date_format: user?.user_setting?.short_date_format,
          short_time_format: user?.user_setting?.short_time_format,
          thousands_separators: user?.user_setting?.thousands_separators,
          timezone: user?.user_setting?.timezone,
          volumetric_measurement_unit: user?.user_setting?.volumetric_measurement_unit,
        },
        vehicles: user?.vehicles,
        groups: user?.groups,
        clients: user?.clients,
      }));

      const {
        screens
      } = getUsersScreens({
        role_id: user?.type,
      })

      if (!Array.isArray(screens) || !screens?.length) throw new Error('Error: cannot get screens to user');

      dispatch(enableScreens({
        screens
      }))
    }

    toast.success(localizedStrings.success.update.user);
    dispatch(userChangeOperationStates({ editSuccess: true }));
  } catch (error) {
    toast.error(localizedStrings.error.update.user);
    dispatch(userChangeOperationStates({ editFail: true }));
  }
};

export const createUser = (data) => async (dispatch) => {
  try {
    const URL = "/user/v1";

    const usersData = [{
      status: 1,
      name: data.name,
      email: data.email,
      type: data.type?.value,
      groups: data?.groups?.map(getValues),
      clients: data?.clients?.map(getValues),
      vehicles: data?.vehicles?.map(getValues),
      phone: data.phone.replace(/[( )-]/g, ""),
      password: data.email?.split("@").shift(),
      user_setting: {
        timezone: data?.timezone?.value,
        country: data?.country?.value,
        language: data?.language?.value,
        distance_unit: data?.distance_unit?.value,
        thousands_separators: data?.thousands_separators?.value,
        decimal_separators: data?.decimal_separators?.value,
        short_date_format: data?.short_date_format?.value,
        short_time_format: data?.short_time_format?.value,
        volumetric_measurement_unit: data?.volumetric_measurement_unit?.value,
        currency: data?.currency?.value,
      },
      organization_id: data.organization_id,
    }];

    dispatch(userChangeOperationStates({ createLoading: true }));
    const {
      // eslint-disable-next-line
      data: { users }
    } = await api.post(URL, qs.stringify({ users: usersData }));
    toast.success(localizedStrings.success.create.user);

    dispatch(userChangeOperationStates({ createSuccess: true }));

  } catch (error) {
    console.log(error);
    if (error?.response?.status === 409) {
      toast.error(localizedStrings.error.user.create[error.response.status]);
    } else {
      toast.error(localizedStrings.error.create.user);
    }
    dispatch(userChangeOperationStates({ createFail: true }));
  }
};

export const loadUsers = data => async (dispatch) => {
  dispatch(userChangeOperationStates({ loadLoading: true }));
  try {
    const params = [];
    const filters = {
      organization_id: val => val && params.push("organization_id=" + val),
      limit: val => val && params.push("limit=" + val),
      offset: val => params.push("offset=" + val),
      start_date: val => val && params.push("start_date=" + val),
      search_term: val => val && params.push("search_term=" + val),
      status: val => params.push("status=" + val),
      sort: val => val && params.push("sort=" + val),
    }
    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

    const URL = "/user/v1/?" + params.join("&");
    const {
      data: { users = [] }
    } = await validateData(api.get(URL), "users");

    const filterUsers = users.length && users.filter(user => user.email !== "migracao-v1@contele.com.br");

    dispatch(
      fetchLoadSuccess({ users: filterUsers || [], total: filterUsers?.length || 0 })
    );
    dispatch(userChangeOperationStates({ loadSuccess: true }));
  } catch (error) {
    dispatch(userChangeOperationStates({ loadFail: true }));
  }
};
