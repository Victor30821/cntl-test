import {
    CHECKLIST_REPORT_LOAD_SUCCESS,
    CHECKLIST_REPORT_CHANGE_OPERATION_STATES
} from './reducer';
import { api } from 'services/api'


export function checklistReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: CHECKLIST_REPORT_CHANGE_OPERATION_STATES,
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

export function checklistReportsLoadSuccess({ checklist, total }) {
    return {
        type: CHECKLIST_REPORT_LOAD_SUCCESS,
        payload: {
            checklist,
            total,
        }
    };
}

export const loadChecklistReports = data => async dispatch => {
    let URL = "/checklist/v1/";
    URL += "?organization_id=" + data.organization_id;

    const params = {
        organization_id: (data && data.organization_id) || '',
        start_date: (data && data.period.start_date) || '',
        end_date: (data && data.period.end_date) || '',
        limit: (data && data.limit) || '',
        offset: (data && data.offset) || 0,
        sort: (data && data.sort) || "",
    };

    if(data.search_term && data.search_term !== '') {
        Object.assign(params, {
            search_term: (data && data.search_term) || ''
        })
    }

    if(data.vehicle_id.length > 0 && !data.vehicle_id.includes(0)) {
        Object.assign(params, {
            vehicle_id: (data && data.vehicle_id.join(',')) || ''
        })
    }

    if(data.driver_id.length > 0 && !data.driver_id.includes(0)) {
        Object.assign(params, {
            driver_id: (data && data.driver_id.join(',')) || ''
        })
    }
    
    dispatch(checklistReportsChangeOperationStates({ loadLoading: true, }));

    await api.get(URL, { params })
        .then(result => {
            const hasChecklistReports = result.data && result.data.hasOwnProperty("checklists");
            if (hasChecklistReports) {
                const checklist = result?.data?.checklists;
                const total = result?.data?.total;

                dispatch(checklistReportsLoadSuccess({ checklist, total }));
                dispatch(checklistReportsChangeOperationStates({ loadSuccess: true }));
                return;
            }
            dispatch(checklistReportsChangeOperationStates({ loadFail: true }));
        })
        .catch(err => {
            console.log("error loading:", err);
            dispatch(checklistReportsChangeOperationStates({ loadFail: true }));
        })
};
