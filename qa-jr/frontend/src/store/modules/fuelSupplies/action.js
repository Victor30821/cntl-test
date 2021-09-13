import {
    FUEL_SUPPLIE_CREATE_SUCCESS,
    FUEL_CHANGE_OPERATION_STATES,
    FUEL_CHANGE_SELECTORS,
} from './reducer';
import qs from 'qs'

import { api } from 'services/api'
import { toast } from 'react-toastify';
import { localizedStrings } from 'constants/localizedStrings';
import { showErrorToUser } from 'utils/errors';

export function fuelChangeOperationStates({
    createLoading = false,
    createSuccess = false,
    createFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: FUEL_CHANGE_OPERATION_STATES,
        payload: {
            createLoading,
            createSuccess,
            createFail,
            loadLoading,
            loadSuccess,
            loadFail,
        }
    };
}

export function fuelSupplieCreateSuccess(fuelSupplie) {
    return {
        type: FUEL_SUPPLIE_CREATE_SUCCESS,
        payload: {
            fuelSupplie
        }
    };
}
export function fuelChangeSelectors({
    selectors
}, reset) {
    return {
        type: FUEL_CHANGE_SELECTORS,
        payload: {
            selectors,
            reset
        }
    };
}


const imageToBase64 = async (img) => {
    const reader = new FileReader();
    let base = {};
    reader.readAsDataURL(img);
    await (reader.onload = async () => {
        base.base64 = reader.result.split(',')[1];
    });

    return base;
}


export const uploadFile = async data => {
    const URL = "/upload/v1/";
    const params = {
        uploads: [{
            "bucket": data.bucket,
            "prefix": data.prefix,
            "name": data.name,
            "headers": [
                { "Expires": 60 },
                { "ContentType": data.headers.ContentType }
            ]
        }
        ]
    }
    try {
        const {
            data: { uploads }
        } = await api.post(URL, qs.stringify(params))
        const [signedUrl] = uploads;
        const [file] = data.file
        const base64 = await imageToBase64(file);
        return await api.put(signedUrl, qs.stringify(base64))
    } catch (error) {
        console.log(error);
    }
};
export const createFuelSupplie = data => async dispatch => {
    const URL = "/fuel/v1/";
    const params = {
        fuels: [
            data
        ]
    }
    try {
        dispatch(fuelChangeOperationStates({ createLoading: true }))

        const {
            data: { fuels }
        } = await api.post(URL, qs.stringify(params))

        const [{ id }] = fuels;

        if (data.upload?.name) {
            await uploadFile({
                ...data.upload,
                prefix: 'fuel/' + id
            })
        }

        dispatch(fuelSupplieCreateSuccess(data))
        dispatch(fuelChangeOperationStates({ createSuccess: true }))

    } catch (error) {
        dispatch(fuelChangeOperationStates({ createFail: true }));

        const isBadRequest = error?.response?.status === 400;

        if (isBadRequest) return showErrorToUser(error?.response?.data?.errMsg);

        toast.error(localizedStrings.error.create.fuel);
    }
};
