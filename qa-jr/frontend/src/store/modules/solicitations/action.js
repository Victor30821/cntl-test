import {
    SOLICITATION_CREATE_SUCCESS,
    SOLICITATION_CHANGE_OPERATION_STATES,
    SOLICITATION_LOAD_SUCCESS,
    SOLICITATION_UPDATE_FAIL,
    SOLICITATION_EDIT_SUCCESS,
    SOLICITATION_UPDATE,
    SOLICITATION_CHANGE_SELECTORS,
    FETCH_ADDRESS_SUCCESS,
    CHANGE_CURRENT_STEP,
} from './reducer';
import qs from 'qs'
import { showErrorToUser } from 'utils/errors';

import { api } from "services/api";
import { toast } from 'react-toastify';
import { localizedStrings } from 'constants/localizedStrings';
import { format } from 'date-fns';
const editExistingSolicitation = (solicitations, newSolicitation) => {
    return solicitations.map(solicitation => {
        if (solicitation.id === newSolicitation.solicitation.id) {
            solicitation = { ...solicitation, ...newSolicitation.solicitation }
        }
        return solicitation;
    })
}

export function fetchAddressSuccess(address) {
    return {
        type: FETCH_ADDRESS_SUCCESS,
        payload: {
            address
        }
    };
}
export function changeStep(
    step
) {
    return {
        type: CHANGE_CURRENT_STEP,
        payload: {
            stepIndex: step
        }
    };
}

export function solicitationUpdate(solicitation) {
    return {
        type: SOLICITATION_UPDATE,
        editSolicitation: editExistingSolicitation,
        payload: {
            solicitation
        }
    };
}


export function solicitationUpdateFail(solicitation) {
    return {
        type: SOLICITATION_UPDATE_FAIL,
        editSolicitation: editExistingSolicitation,
        payload: {
            solicitation
        }
    };
}
export function solicitationLoadSuccess({
    approved,
    recused,
    pending,
    solicitations,
    total,
}) {
    return {
        type: SOLICITATION_LOAD_SUCCESS,
        payload: {
            solicitations,
            approved,
            recused,
            pending,
            total,
        }
    };
}


export function solicitationEditSuccess(solicitation) {
    return {
        type: SOLICITATION_EDIT_SUCCESS,
        editSolicitation: editExistingSolicitation,
        payload: {
            solicitation
        }
    };
}
export function solicitationCreateSuccess(solicitation) {
    return {
        type: SOLICITATION_CREATE_SUCCESS,
        payload: {
            solicitation
        }
    };
}

export function solicitationChangeSelectors({
    selectors
}, reset) {
    return {
        type: SOLICITATION_CHANGE_SELECTORS,
        payload: {
            selectors,
            reset
        }
    };
}

export function solicitationChangeOperationStates({
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
    createLoading = false,
    createSuccess = false,
    createFail = false,
    editLoading = false,
    editSuccess = false,
    editFail = false,
    addressLoading = false,
    addressSuccess = false,
    addressFail = false,
    updateLoading = false,
    updateSuccess = false,
    updateFail = false,
}) {
    return {
        type: SOLICITATION_CHANGE_OPERATION_STATES,
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
            addressLoading,
            addressSuccess,
            addressFail,
            updateLoading,
            updateSuccess,
            updateFail,
        }
    };
}

export const createSolicitation = data => async dispatch => {
    dispatch(solicitationChangeOperationStates({ createLoading: true }))
    try {
        if (!data) throw new Error("No data given");

        const URL = "/solicitation/v1/";
        const date = format(data.date, "yyyy-MM-dd");
        const seconds = ":00";
        const successStep = 3;

        const params = {
            solicitations: [{
                user_id: data.user_id,
                organization_id: data.organization_id,
                start_date: date + "T" + data.start_time + seconds,
                end_date: date + "T" + data.end_time + seconds,
            }]

        }

        const {
            // eslint-disable-next-line
            data: { solicitations }
        } = await api.post(URL, qs.stringify(params));

        toast.success(localizedStrings.success.create.solicitation);

        dispatch(solicitationCreateSuccess(data));
        dispatch(solicitationChangeOperationStates({ createSuccess: true }))
        dispatch(changeStep(successStep));
    } catch (error) {
        dispatch(solicitationChangeOperationStates({ createFail: true }));

        toast.error(localizedStrings.error.create.solicitation)
    }
};


export const editSolicitation = data => async dispatch => {
    dispatch(solicitationChangeOperationStates({ editLoading: true }));
    try {
        if (!data) throw new Error("No data given");

        const URL = "/solicitation/v1/" + data.id

        const params = {
            solicitation: {
                descr: data.descr,
                start_date: data.start_date,
                end_date: data.end_date,
                status: data.status,
                drivers: data.drivers,
                vehicles: data.vehicles,
            }
        }

        const {
            // eslint-disable-next-line
            data: { solicitation }
        } = await api.put(URL, qs.stringify(params));

        toast.success(localizedStrings.success.update.solicitation);

        dispatch(solicitationEditSuccess(data));

        dispatch(solicitationChangeOperationStates({ editSuccess: true }));

    } catch (error) {
        dispatch(solicitationChangeOperationStates({ editFail: true }));

        const errorCode = error?.response?.data?.errCode;

        if (errorCode === 'Conflict') return showErrorToUser(error?.response?.data?.errMsg)

        toast.error(localizedStrings.error.update.solicitation);

    }
};
const formatDateToPeriod = (solicitation = {}) => {

    const startDateRaw = new Date(solicitation.start_date);
    const endDateRaw = new Date(solicitation.end_date);

    const startDate = format(startDateRaw, "dd/MM");
    const endDate = format(endDateRaw, "dd/MM");

    let startTime = format(startDateRaw, `HH'h' mm'm'`);
    let endTime = format(endDateRaw, `HH'h' mm'm'`);

    const noMinutes = " 00m";

    const hasToReplaceMinutesStartTime = !!startTime.match(noMinutes);
    const hasToReplaceMinutesEndTime = !!endTime.match(noMinutes);

    if (hasToReplaceMinutesStartTime) startTime = startTime.replace(noMinutes, "");
    if (hasToReplaceMinutesEndTime) endTime = endTime.replace(noMinutes, "");

    const formattedPeriod = {
        period: [
            startDate, localizedStrings.solicitationPeriod.to, endDate, localizedStrings.solicitationPeriod.from, startTime, localizedStrings.solicitationPeriod.to, endTime
        ].join(" ")
    }

    if (endDate === startDate) {
        formattedPeriod.period = [
            startDate, localizedStrings.solicitationPeriod.from, startTime, localizedStrings.solicitationPeriod.to, endTime
        ].join(" ")
    }
    return formattedPeriod.period
};

const formatSolicitations = ({
    solicitations,
}) => {
    return solicitations.map(solicitation => ({
        ...solicitation,
        driver_name: solicitation.drivers?.map(driver => driver.name),
        vehicle_name: solicitation.vehicles?.map(driver => driver.name),
        status_translated: localizedStrings.solicitationStatus?.[solicitation.status],
        period: formatDateToPeriod(solicitation)
    }));
};

const filterByStatus = ({
    solicitations,
}) => {
    const solicitationByTypes = {
        pending: [],
        recused: [],
        approved: [],
    }
    const types = Object.keys(solicitationByTypes);

    types.forEach(type => {
        solicitationByTypes[type] = solicitations.filter(solicitation => solicitation.status === type);
    })

    return solicitationByTypes
};
const formatSolicitationDates = ({
    solicitationsByType,
}) => {
    const solicitationByTypes = {
        pending: [],
        recused: [],
        approved: [],
    }
    const types = Object.keys(solicitationsByType);

    types.forEach(type => {
        const solicitationValuesPerType = solicitationsByType[type];

        solicitationByTypes[type] = solicitationValuesPerType.map(solicitation => {

            const formattedPeriod = formatDateToPeriod(solicitation);

            return {
                ...solicitation,
                ...formattedPeriod,
            }
        });
    })

    return solicitationByTypes
};

export const setVehiclesToSolicitations = data => async dispatch => {
    const solicitationWithVehiclesData = data?.solicitations?.map?.(solicitation => {
        const solicitationVehicles = data?.vehicles
            ?.filter(vehicle => solicitation.vehicles.find(v => v.id === vehicle?.id))
            ?.map(vehicle => vehicle.name)
            ?.join(", ")
        solicitation.vehicles?.length && console.log({ vehicles: solicitation.vehicles, solicitationVehicles, loaded: data?.vehicles });
        return {
            ...solicitation,
            vehicles_names: solicitationVehicles,
        }
    })

    const solicitationsByType = filterByStatus({ solicitations: solicitationWithVehiclesData });

    const {
        approved,
        recused,
        pending,
    } = formatSolicitationDates({ solicitationsByType })

    dispatch(solicitationLoadSuccess({
        approved,
        recused,
        pending,
        solicitations: solicitationWithVehiclesData,
    }));
}


export const loadSolicitations = data => async dispatch => {
    dispatch(solicitationChangeOperationStates({ loadLoading: true }));
    try {
        const params = [];
        const filters = {
            limit: val => val && params.push("limit=" + val),
            offset: (val = 0) => params.push("offset=" + val),
            organization_id: val => val && params.push("organization_id=" + val),
            search_term: val => val && params.push("search_term=" + val),
            user_id: val => val && params.push("user_id=" + val),
            status: val => val && params.push("status=" + val),
            start_date: val => val && params.push("start_date=" + val),
            end_date: val => val && params.push("end_date=" + val),
            sort: val => val && params.push("sort=" + val),
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]));

        const URL = "/solicitation/v1/?" + params.join("&");

        const {
            data: { solicitations, total }
        } = await api.get(URL);

        const formattedWithNames = formatSolicitations({ solicitations })

        const solicitationsByType = filterByStatus({ solicitations: formattedWithNames });

        const {
            approved,
            recused,
            pending,
        } = formatSolicitationDates({ solicitationsByType })

        dispatch(solicitationLoadSuccess({
            approved,
            recused,
            pending,
            solicitations: formattedWithNames,
            total
        }));
        dispatch(solicitationChangeOperationStates({ loadSuccess: true }));
    } catch (error) {
        console.log(error);
        dispatch(solicitationChangeOperationStates({ loadFail: true }));
    }
};

export const updateSolicitations = data => async dispatch => {
    dispatch(solicitationChangeOperationStates({ updateLoading: true }));
    const URL = "/solicitation/v1/" + data.id;

    const params = { solicitation: {} }

    const rollbackData = { ...data }

    try {
        if (!data) throw new Error("No data given");

        const filters = {
            newStatus: val => {
                params.solicitation = {
                    descr: data.descr,
                    descr_recused: data.descr_recused,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    status: val,
                }
            },
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        dispatch(solicitationUpdate({
            ...data,
            status: data.newStatus,
            status_translated: localizedStrings.solicitationStatus?.[data.newStatus],
        }));

        const {
            // eslint-disable-next-line 
            data: { solicitation }
        } = await api.put(URL, qs.stringify(params));

        toast.success(localizedStrings.success.update.solicitation);

        dispatch(solicitationChangeOperationStates({ updateSuccess: true }));

    } catch (error) {
        console.log(error);

        toast.error(localizedStrings.error.update.solicitation);

        dispatch(solicitationUpdateFail(rollbackData));

        dispatch(solicitationChangeOperationStates({ updateFail: true }));

    }

};



