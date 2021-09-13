import {
  USAGE_LOAD_SUCCESS,
  USAGE_LOAD_REQUEST,
  USAGE_LOAD_FAIL,
} from "./reducer";
import { api } from "services/api";

export function fetchLoadSuccess({ usage  }) {
  return {
    type: USAGE_LOAD_SUCCESS,
    payload: {
      usage
    },
  };
}

export function fetchLoadFail(messageFail = "") {
  return {
    type: USAGE_LOAD_FAIL,
    payload: {
      messageFail,
    },
  };
}

export function fetchLoadRequest() {
  return { type: USAGE_LOAD_REQUEST };
}
  
export const loadOrganizationAchievements = (data) => async (dispatch) => {
    try {
      const URL = "/organization/v1/achievement_score";

      dispatch(fetchLoadRequest());
      const response = await api.get(`${URL}?organization_id=${data}`);
  
      if(!response?.data) throw new Error("Response error");
      dispatch(
        fetchLoadSuccess({
          usage: response.data,
        })
      );
      return true;
    }catch (error) {
      dispatch(fetchLoadFail());
      console.log("err", error);
    }
}