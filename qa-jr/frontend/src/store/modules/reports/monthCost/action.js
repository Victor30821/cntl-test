import {
    MONTH_COST_REPORT_LOAD_SUCCESS,
    MONTH_COST_REPORT_CHANGE_OPERATION_STATES
} from './reducer';
import { api } from 'services/api'
import { localizedStrings } from 'constants/localizedStrings';


export function monthCostReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: MONTH_COST_REPORT_CHANGE_OPERATION_STATES,
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

export function monthCostReportsLoadSuccess({ monthCost, total }) {
    return {
        type: MONTH_COST_REPORT_LOAD_SUCCESS,
        payload: {
            monthCost,
            total,
        }
    };
}

export const loadMonthCostReports = ({
    organization_id,
    period,
    offset = 0,
    unit,
    search_term,
    limit = "-1",
    format = "cost",
    vehicle_id = [],
}) => async dispatch => {
    let URL = "/fuel/v1/";
    const params = {
        organization_id: organization_id || '',
        start_date: period?.start_date || '',
        end_date: period?.end_date || '',
        limit: limit,
        offset: offset,
        group: "month",
        format: format,
        unit: unit,
    };

    if (search_term && search_term !== '') {
        Object.assign(params, {
            search_term
        })
    }

    if (vehicle_id.length > 0 && !vehicle_id.includes(0)) {
        Object.assign(params, {
            vehicle_id: vehicle_id.join(',') || ''
        })
    }

    dispatch(monthCostReportsChangeOperationStates({ loadLoading: true, }));

    await api.get(URL, { params })
        .then(result => {
            const hasMonthCostReports = result.data && result.data.hasOwnProperty("fuels");
            if (hasMonthCostReports) {
                const monthCost = result?.data?.fuels;
                const total = result?.data?.total;

                dispatch(monthCostReportsLoadSuccess({ monthCost, total }));
                dispatch(monthCostReportsChangeOperationStates({ loadSuccess: true }));
                return {
                    monthCost,
                    total,
                }
            }
            dispatch(monthCostReportsChangeOperationStates({ loadFail: true }));
        })
        .catch(err => {
            console.log("error loading:", err);
            dispatch(monthCostReportsChangeOperationStates({ loadFail: true }));
        })
};
