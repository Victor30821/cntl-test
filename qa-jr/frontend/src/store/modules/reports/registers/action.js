import {
    FUEL_REGISTERS_REPORT_LOAD_SUCCESS,
    FUEL_REGISTERS_REPORT_CHANGE_OPERATION_STATES
} from './reducer';
import { api } from 'services/api'
import { PER_PAGE_LENGTHS } from 'constants/environment';


export function fuelRegistersReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: FUEL_REGISTERS_REPORT_CHANGE_OPERATION_STATES,
        payload: {
            exportLoading,
            exportSuccess,
            exportFail,
            loadLoading,
            loadSuccess,
            loadFail,
        }
    };
}

export function fuelRegistersReportsLoadSuccess({ fuels, total }) {
    return {
        type: FUEL_REGISTERS_REPORT_LOAD_SUCCESS,
        payload: {
            fuels,
            total,
        }
    };
}

export const loadFuelRegistersReports = ({
    organization_id,
    period,
    offset,
    limit,
    sort = "",
    search_term = "",
    vehicle_id = [],
    driver_id = [],
    format = 'register',
    unit = 'km',
    group = 'vehicle',
}) => async dispatch => {
    try {
        const URL = format === 'register' ? "/fuel/v1/register/" : "/fuel/v1/";
        const params = {
            organization_id: organization_id || '',
            start_date: period?.start_date || '',
            end_date: period?.end_date || '',
            offset: offset || 0,
            limit: limit || PER_PAGE_LENGTHS[0],
            sort: sort || '',
            search_term,
            vehicle_id: vehicle_id.join(','),
            driver_id: driver_id.join(','),
            format,
            unit,
            group,
        };

        if (params.search_term === '') delete params.search_term;
        if (params.sort === '') delete params.sort;

        if (driver_id.includes(0)) delete params.driver_id;

        if (vehicle_id.includes(0)) delete params.vehicle_id;

        dispatch(fuelRegistersReportsChangeOperationStates({ loadLoading: true, }));
        const { data: { fuels, total } } = await api.get(URL, { params });
        dispatch(fuelRegistersReportsLoadSuccess({ fuels, total }));
        dispatch(fuelRegistersReportsChangeOperationStates({ loadSuccess: true }));
        return {
            fuels,
            total,
        }
    } catch (error) {
        console.log("error loading:", error);
        dispatch(fuelRegistersReportsChangeOperationStates({ loadFail: true }));
        return {
            fuels: [],
            total: 0,
        }
    }
};
