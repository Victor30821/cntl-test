import {
    FENCE_CREATE_SUCCESS,
    FENCE_CREATE_REQUEST,
    FENCE_LOAD_SUCCESS,
    FENCE_UPDATE_SUCCESS,
    FENCE_UPDATE_FAIL,
    FENCE_EDIT_SUCCESS,
    FENCE_UPDATE,
    FENCE_CHANGE_OPERATION_STATES,
} from './reducer';
import qs from 'qs'

import { api } from "services/api";
import { toast } from 'react-toastify';
import { localizedStrings } from 'constants/localizedStrings';
const editExistingFence = (fences, newFence) => {
    return fences.map(fence => {
        if (fence.id === newFence.fence.id) {
            fence = { ...fence, ...newFence.fence }
        }
        return fence;
    })
}
export function fenceChangeOperationStates({
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
    createLoading = false,
    createSuccess = false,
    createFail = false,
    editLoading = false,
    editSuccess = false,
    editFail = false,
    updateLoading = false,
    updateSuccess = false,
    updateFail = false,
}) {
    return {
        type: FENCE_CHANGE_OPERATION_STATES,
        payload: {
            loadLoading,
            loadSuccess,
            loadFail,
            createLoading,
            createSuccess,
            createFail,
            editLoading,
            editSuccess,
            editFail,
            updateLoading,
            updateSuccess,
            updateFail,
        }
    };
}
export function fenceUpdateSuccess(fence) {
    return {
        type: FENCE_UPDATE_SUCCESS,
        editFence: editExistingFence,
        payload: {
            fence
        }
    };
}

export function fenceUpdate(fence) {
    return {
        type: FENCE_UPDATE,
        editFence: editExistingFence,
        payload: {
            fence
        }
    };
}

export function fenceUpdateFail(fence) {
    return {
        type: FENCE_UPDATE_FAIL,
        editFence: editExistingFence,
        payload: {
            fence
        }
    };
}
export function fenceLoadSuccess(fences, total) {
    return {
        type: FENCE_LOAD_SUCCESS,
        editFence: editExistingFence,
        payload: {
            fences,
            total,
        }
    };
}

export function fenceEditSuccess(fence) {
    return {
        type: FENCE_EDIT_SUCCESS,
        editFence: editExistingFence,
        payload: {
            fence
        }
    };
}
export function fenceCreateSuccess(fence) {
    return {
        type: FENCE_CREATE_SUCCESS,
        payload: {
            fence
        }
    };
}
export function fenceCreateRequest() {
    return { type: FENCE_CREATE_REQUEST };
}


export const createFence = data => async dispatch => {
    dispatch(fenceChangeOperationStates({ createLoading: true }))
    try {
        const URL = "/fence/v1/";
        const params = {
            fences: [{
                name: data.fenceName,
                speed_in_km_h: data.speedLimit,
                vehicles: data?.vehicles?.map(vehicle => vehicle.value),
                coordinates: data.fence,
                status: 1,
                show_map: 1,
                organization_id: data.organization_id,
                all_vehicles: data.allVehicles
            }]
        }

        await api.post(URL, qs.stringify(params));

        dispatch(fenceCreateSuccess(data));
        dispatch(fenceChangeOperationStates({ createSuccess: true }));
        toast.success(localizedStrings.success.create.fence);
    } catch (error) {
        console.log(error);
        toast.error(localizedStrings.error.create.fence);
        dispatch(fenceChangeOperationStates({ createFail: true }))
    }
};



export const editFence = data => async dispatch => {
    dispatch(fenceChangeOperationStates({ editLoading: true }))
    try {
        const URL = "/fence/v1/" + data.id;

        const params = {
            fence_id: data.id,
            fence: {}
        }
        const filters = {
            fenceName: () => params.fence["name"] = data.fenceName,
            speedLimit: () => params.fence["speed_in_km_h"] = data.speedLimit,
            vehicles: () => params.fence["vehicles"] = data?.vehicles?.map(vehicle => vehicle.value),
            fence: () => params.fence["coordinates"] = data.fence,
            allVehicles: () => params.fence["all_vehicles"] = data.allVehicles,
        };
        Object.keys(data).forEach(filter => filters?.[filter]?.())
        await api.put(URL, qs.stringify(params));
        dispatch(fenceChangeOperationStates({ editSuccess: true }));
        dispatch(fenceEditSuccess(data));

        toast.success(localizedStrings.success.update.fence);
    } catch (error) {
        toast.error(localizedStrings.error.update.fence);
        dispatch(fenceChangeOperationStates({ editFail: true }));
    }
};

export const loadFences = data => async dispatch => {
    dispatch(fenceChangeOperationStates({ loadLoading: true }))
    try {
        const params = [];
        const filters = {
            organization_id: val => val && params.push("organization_id=" + val),
            limit: val => val && params.push("limit=" + val),
            offset: val => params.push("offset=" + val),
            search_term: val => val && params.push("search_term=" + val),
            status: val => val && params.push("status=" + val),
            sort: val => val && params.push("sort=" + val),
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

        const URL = "/fence/v1/?" + params.join("&");

        const {
            data: { fences, total }
        } = await api.get(URL);

        dispatch(fenceLoadSuccess(fences, total));
        dispatch(fenceChangeOperationStates({ loadSuccess: true }))


    } catch (error) {
        dispatch(fenceChangeOperationStates({ loadFail: true }))
    }
};

export const updateFences = data => async dispatch => {
    dispatch(fenceChangeOperationStates({ updateLoading: true }))
    const URL = "/fence/v1/" + data.id;
    const params = { fence: {} }
    const rollbackData = { ...data }

    try {
        const filters = {
            show_map: val => {
                params.fence["show_map"] = +val;
                rollbackData["show_map"] = !val;
            },
            status: val => {
                params.fence["status"] = +val;
                rollbackData["status"] = !val;
            },
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

        dispatch(fenceUpdate(data));

        await api.put(URL, qs.stringify(params))

        dispatch(fenceUpdateSuccess(data));
        dispatch(fenceChangeOperationStates({ updateSuccess: true }))
        toast.success(localizedStrings.success.update.fence);

    } catch (error) {
        toast.error(localizedStrings.error.update.fence);
        console.log(error);
        dispatch(fenceUpdateFail(rollbackData));
        dispatch(fenceChangeOperationStates({ updateFail: true }))
    }
};
