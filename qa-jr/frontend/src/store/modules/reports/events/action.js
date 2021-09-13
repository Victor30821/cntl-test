import {
    EVENTS_REPORT_LOAD_SUCCESS,
    EVENTS_REPORT_CHANGE_OPERATION_STATES
} from './reducer';
import { api } from 'services/api'

export function eventsReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: EVENTS_REPORT_CHANGE_OPERATION_STATES,
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

export function eventsReportsLoadSuccess({ events, total }) {

    return {
        type: EVENTS_REPORT_LOAD_SUCCESS,
        payload: {
            events,
            total
        }
    };
}



export const loadEventsReports = data => async dispatch => {
    try {
        let URL = "/event/v1/"

        const params = {
            organization_id: data?.organization_id || '',
            search_term: data?.search_term || undefined,
            start_date: data?.period.start_date || '',
            end_date: data?.period.end_date || '',
            limit: data?.limit || '',
            offset: data?.offset || 0,
            sort: data?.sort || "",
        };

        if (data.type_event_id.length > 0 && !data.type_event_id.includes(0)) {
            Object.assign(params, {
                type_event_id: (data && data.type_event_id[0]) || ''
            })
        }

        if (data.vehicle_id.length > 0 && !data.vehicle_id.includes(0)) {
            Object.assign(params, {
                vehicle_id: (data && data.vehicle_id.join(',')) || ''
            })
        }

        dispatch(eventsReportsChangeOperationStates({ loadLoading: true, }));

        const {
            data: { events, total }
        } = await api.get(URL, { params });

        dispatch(eventsReportsLoadSuccess({ events, total }));
        dispatch(eventsReportsChangeOperationStates({ loadSuccess: true }));

    } catch (error) {
        console.log(error);
        dispatch(eventsReportsChangeOperationStates({ loadFail: true }));
    }

};
