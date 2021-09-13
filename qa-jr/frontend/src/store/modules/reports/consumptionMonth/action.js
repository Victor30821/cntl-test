import {
    CONSUMPTION_MONTH_REPORT_LOAD_SUCCESS,
    CONSUMPTION_MONTH_REPORT_CHANGE_OPERATION_STATES
} from './reducer';
import { api } from 'services/api'


export function consumptionMonthReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: CONSUMPTION_MONTH_REPORT_CHANGE_OPERATION_STATES,
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

export function consumptionMonthReportsLoadSuccess({ consumptionMonth, total }) {
    return {
        type: CONSUMPTION_MONTH_REPORT_LOAD_SUCCESS,
        payload: {
            consumptionMonth,
            total,
        }
    };
}

export const loadConsumptionMonthReports = ({
    organization_id,
    period,
    offset,
    search_term,
    vehicle_id = [],
    format = 'consumption',
    unit = 'km',
    group = 'vehicle',
}) => async dispatch => {
    let URL = "/fuel/v1/";
    const params = {
        organization_id: organization_id || '',
        start_date: period.start_date || '',
        end_date: period.end_date || '',
        limit: '-1',
        offset: offset || 0,
        // search_term,
        vehicle_id: vehicle_id.join(','),
        group,
        unit,
        format,
    };

    dispatch(consumptionMonthReportsChangeOperationStates({ loadLoading: true }));

    await api.get(URL, { params })
        .then(result => {
            const hasConsumptionMonthReports = result?.data && result.data.hasOwnProperty("fuels");
            if (hasConsumptionMonthReports) {
                const consumptionMonth = result?.data?.fuels;
                const total = result?.data?.total;

                dispatch(consumptionMonthReportsLoadSuccess({ consumptionMonth, total }));
                dispatch(consumptionMonthReportsChangeOperationStates({ loadSuccess: true }));
                return;
            }
            dispatch(consumptionMonthReportsChangeOperationStates({ loadFail: true }));
        })
        .catch(err => {
            console.log("error loading:", err);
            dispatch(consumptionMonthReportsChangeOperationStates({ loadFail: true }));
        })
};
