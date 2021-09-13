import {
    FUELSUPPLIE_CREATE_SUCCESS,
    FUELSUPPLIE_CREATE_REQUEST,
    FUELSUPPLIE_CREATE_FAIL,
    FUELSUPPLIE_CREATE_RESET,
    FUELSUPPLIE_LOAD_REQUEST,
    FUELSUPPLIE_LOAD_FAIL,
} from './reducer';
import qs from 'qs'

import { api } from 'services/api'

export function fuelSupplieLoadRequest() {
    return { type: FUELSUPPLIE_LOAD_REQUEST, };
}

export function fuelSupplieLoadFail() {
    return { type: FUELSUPPLIE_LOAD_FAIL };
}

export function fuelSupplieCreateSuccess(fuelSupplie) {
    return {
        type: FUELSUPPLIE_CREATE_SUCCESS,
        payload: {
            fuelSupplie
        }
    };
}

export function fuelSupplieCreateFail() {
    return { type: FUELSUPPLIE_CREATE_FAIL };
}
export function fuelSupplieCreateRequest() {
    return { type: FUELSUPPLIE_CREATE_REQUEST };
}

export function resetCreateFuelSupplie() {
    return {
        type: FUELSUPPLIE_CREATE_RESET,
    };
}


export const getFuelSupplies = data => async dispatch => {
    const URL = "/fuel/v1/";
    const params = {
    }
    dispatch(fuelSupplieCreateRequest())

    const res = await api.get(URL, qs.stringify(params))
                        .then(res => {
                            res && dispatch(fuelSupplieCreateSuccess(fuelData));
                            !res && dispatch(fuelSupplieCreateFail())
                            return res;
                        })
                        .catch(err => {
                            dispatch(fuelSupplieCreateFail())
                            console.log("err", err);
                        })

};