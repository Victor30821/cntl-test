import {
  ORGANIZATION_LOAD_SUCCESS,
  ORGANIZATION_LOAD_LIST_SUCCESS,
  ORGANIZATION_LOAD_FAIL,
  ORGANIZATION_LOAD_REQUEST,
  ORGANIZATION_UPDATE_SUCCESS,
  ORGANIZATION_UPDATE_FAIL,
  ORGANIZATION_UPDATE_REQUEST,
} from "./reducer";
import { api } from "services/api";
import { validateData } from "../helpers";
import qs from "qs";

export function fetchLoadListSuccess ({ organizations }) {
  return {
    type: ORGANIZATION_LOAD_LIST_SUCCESS,
    payload: {
      organizations
    },
  };
}

export function fetchLoadSuccess({ organization, organizations  }) {
  return {
    type: ORGANIZATION_LOAD_SUCCESS,
    payload: {
      organization,
      organizations
    },
  };
}

export function fetchLoadFail(messageFail = "") {
  return {
    type: ORGANIZATION_LOAD_FAIL,
    payload: {
      messageFail,
    },
  };
}

export function fetchLoadRequest() {
  return { type: ORGANIZATION_LOAD_REQUEST };
}

export function fetchUpdateSuccess({ organization }) {
  return {
    type: ORGANIZATION_UPDATE_SUCCESS,
    payload: {
      organization,
    },
  };
}

export function fetchUpdateFail(messageFail = "") {
  return {
    type: ORGANIZATION_UPDATE_FAIL,
    payload: {
      messageFail,
    },
  };
}

export function fetchUpdateRequest() {
  return { type: ORGANIZATION_UPDATE_REQUEST };
}

export const loadOrganization = (data) => async (dispatch) => {
  try {
    const URL_ORG = "/organization/v1/";

    dispatch(fetchLoadRequest());
    let responseOrg = await validateData(
      api.get(URL_ORG + data.organization_id),
      "organization"
    );

    if (!responseOrg?.data?.organization?.status) return false

    dispatch(
      fetchLoadSuccess({
        organization: responseOrg.data.organization,
      })
    );
    return true
  } catch (error) {
    dispatch(fetchLoadFail());
    //   dispatch(driverCreateFail());
    console.log("err", error);
  }
};

export const updateOrganization = (data) => async (dispatch) => {
  try {
    const URL_ORG = "/organization/v1/" + data.organization_id;
    const [preparedData] = [data.data.organization].map(org => {
      return {
        addresses: org.addresses || [],
        company_name: org.company_name,
        country: org.country,
        currency: org.currency,
        id: org.id,
        identification: org.identification,
        status: org.status,
        trading_name: org.trading_name
      }
    });

    dispatch(fetchUpdateRequest());
    const response = await validateData(
      api.put(URL_ORG, qs.stringify({ organization: preparedData })),
      "organization"
    );

    dispatch(fetchUpdateSuccess(response.data));
  } catch (error) {
    dispatch(fetchUpdateFail("Aconteceu algo de errado, tente novamente"));
  }
};


export const listOrganizations = (data) => async (dispatch) => {
  try {
    const URL_ORG = "/organization/v1/";
    const response = await api.get(`${URL_ORG}?user_id=${data}&limit=1000`);
    dispatch(
      fetchLoadListSuccess({
        organizations: response?.data?.organizations || [],
      })
    );
  } catch (error) {
    dispatch(fetchLoadFail());
    console.log("err", error);
  }
};
