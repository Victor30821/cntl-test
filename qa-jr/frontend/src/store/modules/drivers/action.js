import {
    DRIVER_CREATE_SUCCESS,
    DRIVER_CREATE_FAIL,
    DRIVER_CHANGE_OPERATION_STATES,
    DRIVER_LOAD_SUCCESS,
    DRIVER_UPDATE_SUCCESS,
    DRIVER_UPDATE_FAIL,
    DRIVER_EDIT_SUCCESS,
    DRIVER_EDIT_FAIL,
    DRIVER_UPDATE,
    DRIVER_DELETE,
    DRIVER_DELETE_FAIL,
    DRIVERS_BY_IDS,
    DRIVERS_ADD_DRIVER
} from './reducer';
import qs from 'qs'
import { showErrorToUser } from 'utils/errors';

import { api } from "services/api";
import { toast } from 'react-toastify';
import { localizedStrings } from 'constants/localizedStrings';
const editExistingDriver = (drivers, newDriver) => {
    return drivers.map(driver => {
        if (driver.id === newDriver.driver.id) {
            driver = { ...driver, ...newDriver.driver }
        }
        return driver;
    })
}
export function driverUpdateSuccess(driver) {
    return {
        type: DRIVER_UPDATE_SUCCESS,
        editDriver: editExistingDriver,
        payload: {
            driver
        }
    };
}

export function driverUpdate(driver) {
    return {
        type: DRIVER_UPDATE,
        editDriver: editExistingDriver,
        payload: {
            driver
        }
    };
}

export function driverDelete(driverIndex) {
    return {
        type: DRIVER_DELETE,
        payload: {
            driverIndex
        }
    };
}


export function driverDeleteFail(driver, driverIndex) {
    return {
        type: DRIVER_DELETE_FAIL,
        payload: {
            driver,
            driverIndex
        }
    };
}
export function driverUpdateFail(driver) {
    return {
        type: DRIVER_UPDATE_FAIL,
        editDriver: editExistingDriver,
        payload: {
            driver
        }
    };
}
export function driverLoadSuccess(drivers, total, all_drivers = undefined) {
    return {
        type: DRIVER_LOAD_SUCCESS,
        editDriver: editExistingDriver,
        payload: {
            drivers,
            total,
            all_drivers
        }
    };
}


export function driverEditSuccess(driver) {
    return {
        type: DRIVER_EDIT_SUCCESS,
        editDriver: editExistingDriver,
        payload: {
            driver
        }
    };
}
export function driverCreateSuccess(driver) {
    return {
        type: DRIVER_CREATE_SUCCESS,
        payload: {
            driver
        }
    };
}
export function fetchDriverCreateFail(messageFail) {
    return {
        type: DRIVER_CREATE_FAIL,
        payload: {
            messageFail,
        },
    };
}
export function fetchDriverEditFail(messageFail) {
    return {
        type: DRIVER_EDIT_FAIL,
        payload: {
            messageFail,
        },
    };
}

export function fetchAddDriver(all_drivers, value) {
    return {
        type: DRIVERS_ADD_DRIVER,
        payload: {
            all_drivers,
            value
        }
    }
}

export function driverChangeOperationStates({
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
    deleteLoading = false,
    deleteSuccess = false,
    deleteFail = false,
}) {
    return {
        type: DRIVER_CHANGE_OPERATION_STATES,
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
            deleteLoading,
            deleteSuccess,
            deleteFail,
        }
    };
}
export function setDriversByIds({ driver, clear }) {
    return {
        type: DRIVERS_BY_IDS,
        payload: {
            driver: driver,
            clear: clear
        }
    };
}

export const createDriver = data => async dispatch => {
    dispatch(driverChangeOperationStates({ createLoading: true }))
    try {
        const URL = "http://localhost:3333/api/v1/Driver/";
        const params = {
            drivers: [{
                name: data.name,
                nickname: data.nickname,
                email: data?.email,
                phone: data.phone,
                status: 1,
                code: data.code,
                driver_license: data.driver_license,
                expire_driver_license: data.expire_driver_license,
                identification_driver_key: data.identification_driver_key,
                organization_id: data.organization_id,
            }]
        }

        await api.post(URL, qs.stringify(params));

        toast.success(localizedStrings.success.create.driver);
        dispatch(driverCreateSuccess(data));
        dispatch(driverChangeOperationStates({ createSuccess: true }))
    } catch (error) {
        dispatch(driverChangeOperationStates({ createFail: true }));

        const errorCode = error?.response?.data?.errCode;

        if (errorCode === 'Conflict') return showErrorToUser(error?.response?.data?.errMsg)

        toast.error(localizedStrings.error.create.driver)
    }
};



export const editDefaultDriver = data => async dispatch => {
    if (!data.vehicle_id) return;
    const [
        initialDriverId,
        newDriverId,
    ] = [
            data.initialDriverId,
            data.newDriverId
        ]
    const hasToCreate = initialDriverId !== newDriverId && newDriverId;
    const hasToDelete = (initialDriverId !== newDriverId && !newDriverId) || (hasToCreate && initialDriverId);

    if (!hasToCreate && !hasToDelete) return;
    const deletePayload = {
        vehicle_id: data.vehicle_id,
        driver_id: initialDriverId,
    }
    const createPayload = {
        vehicle_id: data.vehicle_id,
        driver_id: newDriverId,
    }
    const promisses = [
        hasToDelete && await dispatch(removeDefaultDriver(deletePayload)),
        hasToCreate && await dispatch(saveDefaultDriver(createPayload)),
    ]
    await Promise.all(promisses);
};
export const removeDefaultDriver = data => async dispatch => {
    const URL = "/driver/v1/vehicle/remove";
    try {
        const params = {
            driver: {
                vehicle_id: data.vehicle_id,
                driver_id: data.driver_id,
                type_attachment: "default",
            }
        }
        await api.post(URL, qs.stringify(params));
    } catch (error) {
        console.log(error);
    }
};
export const saveDefaultDriver = data => async dispatch => {
    const URL = "/driver/v1/vehicle";
    try {
        const params = {
            driver: {
                vehicle_id: data.vehicle_id,
                driver_id: data.driver_id,
                type_attachment: "default",
                extra: data?.extra,
            }
        }
        await api.post(URL, qs.stringify(params));
    } catch (error) {
        console.log(error);
    }
};
export const editDriver = data => async dispatch => {
    dispatch(driverChangeOperationStates({ editLoading: true }));

    const URL = "http://localhost:3333/api/v1/Drivers/" + data.id

    try {
        const params = {
            driver: {
                name: data.name,
                email: data?.email,
                organization_id: data.organization_id,
                pin: data.pin,
                status: data.status,
                nickname: data.nickname,
                code: data.code,
                driver_license: data.driver_license,
                identification_driver_key: data.identification_driver_key,
            }
        }

        const filters = {
            nickname: val => params.driver["nickname"] = val,
            phone: val => params.driver["phone"] = val,
            email: val => params.driver["email"] = val,
            code: val => params.driver["code"] = val,
            driver_license: val => params.driver["driver_license"] = val,
            expire_driver_license: val => params.driver["expire_driver_license"] = val,
            keyId: val => params.driver["keyId"] = val,
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        await api.put(URL, qs.stringify(params));

        dispatch(driverEditSuccess(data));

        dispatch(driverChangeOperationStates({ editSuccess: true }));

    } catch (error) {
        dispatch(driverChangeOperationStates({ editFail: true }));

        const errorCode = error?.response?.data?.errCode;

        if (errorCode === 'Conflict') return showErrorToUser(error?.response?.data?.errMsg)

        toast.error(localizedStrings.error.update.driver);

    }
};

export const loadDrivers = data => async dispatch => {
    dispatch(driverChangeOperationStates({ loadLoading: true }));
    try {
        const params = [];
        const filters = {
            limit: val => val && params.push("limit=" + val),
            offset: (val = 0) => params.push("offset=" + val),
            organization_id: val => val && params.push("organization_id=" + val),
            search_term: val => val && params.push("search_term=" + val),
            status: val => val && params.push("status=" + val),
            sort: val => val && params.push("sort=" + val),
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        const URL = "/driver/v1/?" + params.join("&");

        const teste = "http://localhost:3333/api/v1/Drivers"

        const response = await api.get(teste);
        
        const total = response.data.length

        const driversList = response.data.map(driver => {
            // eslint-disable-next-line
            const extra = driver.extra_attachment && JSON.parse(driver.extra_attachment || {}) || {};
            // eslint-disable-next-line
            const hasDeviceOrManufacturer = extra?.device_model || extra?.manufacturer;

            if (hasDeviceOrManufacturer) extra.device_attached = [extra?.device_model, extra?.manufacturer].join(" - ")

            return ({
                ...driver,
                app_name: extra?.app_name,
                device_model: extra?.device_model,
                manufacturer: extra?.manufacturer,
                version_app: extra?.version_app,
                version_os: extra?.version_os,
                device_attached: extra?.device_attached,
            })
        });

        dispatch(driverLoadSuccess(driversList, total));
        dispatch(driverChangeOperationStates({ loadSuccess: true }));
    } catch (error) {
        console.log(error);
        dispatch(driverChangeOperationStates({ loadFail: true }));
    }
};

export const updateDrivers = data => async dispatch => {
    dispatch(driverChangeOperationStates({ updateLoading: true }));
    const params = { driver: {} }
    const rollbackData = { ...data }
    const URL = "/driver/v1/" + data.id;
    try {
        const filters = {
            status: val => {
                params.driver["status"] = +val;
                params.driver = {
                    ...params.driver,
                    name: data.name,
                    pin: data.pin,
                    organization_id: data.organization_id,
                }
                rollbackData["status"] = !val;
            },
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        dispatch(driverUpdate(data));

        await api.put(URL, qs.stringify(params));

        toast.success(localizedStrings.success.update.driver);

        dispatch(driverUpdateSuccess(data));

        dispatch(driverChangeOperationStates({ updateSuccess: true }));

    } catch (error) {
        console.log(error);

        toast.error(localizedStrings.error.update.driver);

        dispatch(driverUpdateFail(rollbackData));

        dispatch(driverChangeOperationStates({ updateFail: true }));

    }

};
export const getDriversByIds = ({ ids, onFinish = () => { }, clear = false }) => async dispatch => {
    if (typeof ids === 'object' && ids.length > 0) {
        for (let id of ids) {
            const url = "/driver/v1/" + id;
            await api.get(url).then(result => {
                const driver = result?.data?.driver;
                dispatch(setDriversByIds({ driver, clear }));
            }).catch(e => {
                console.log(e);
            });
        }
    }

    onFinish();
}

export const deleteDrivers = ({
    driver = {},
    driverIndex = 0,
}) => async dispatch => {
    dispatch(driverChangeOperationStates({ deleteLoading: true }));

    const rollbackData = { ...driver };

    const URL = "/driver/v1/" + rollbackData.id;

    try {
        dispatch(driverDelete(driverIndex));

        toast.info(localizedStrings.pending.delete.driver);

        await api.delete(URL);

        toast.success(localizedStrings.success.delete.driver);

        dispatch(driverChangeOperationStates({ deleteSuccess: true }));

    } catch (error) {
        console.log(error);

        toast.error(localizedStrings.error.delete.driver);

        dispatch(driverDeleteFail(rollbackData, driverIndex));

        dispatch(driverChangeOperationStates({ deleteFail: true }));

    }

};