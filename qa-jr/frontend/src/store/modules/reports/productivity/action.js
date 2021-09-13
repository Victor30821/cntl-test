import {
    PRODUCTIVITY_REPORT_LOAD_SUCCESS,
    PRODUCTIVITY_REPORT_CHANGE_OPERATION_STATES
} from './reducer';
import { api } from 'services/api';
import { differenceInMilliseconds, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export function productivityReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: PRODUCTIVITY_REPORT_CHANGE_OPERATION_STATES,
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

export function productivityReportsLoadSuccess({ productivityReports, summary, total }) {
    return {
        type: PRODUCTIVITY_REPORT_LOAD_SUCCESS,
        payload: {
            productivityRoutes: productivityReports,
            summary,
            total,
        }
    };
}

export const loadProductivityReports = data => async dispatch => {
    try {

        const summary = {
            time_off_average: 0,
            total_time_off: 0
        };

        dispatch(productivityReportsLoadSuccess({ productivityReports: [], summary, total: 0 }));
        dispatch(productivityReportsChangeOperationStates({ loadLoading: true }));

        let URL = "/routes/v1";

        const params = {
            organization_id: (data && data.organization_id) || '',
            start_date: (data && data.period.start_date && data.period.start_date + " 00:00:00")  || '',
            end_date: (data && data.period.end_date && data.period.end_date + " 23:59:59") || '',
            limit: '-1',
            offset: 0,
        };
    
        if(data.vehicle_id.length > 0 && !data.vehicle_id.includes(0)) {
            Object.assign(params, {
                vehicle_id: (data && data.vehicle_id.join(',')) || ''
            })
        }

        const { data: { routes = [], total = 0 } } = await api.get(URL, { params });
        
        const productivity_reports = routes?.reduce((idx, route, i, route_list) => {

            const productivity_report = {
                day: route.start_date,
                total_stop_time: new Date(),
                start_route_hour: route.start_date,
                time_off: 0,
                driver_name: "",
            };

            const previous_route = route_list[i - 1];

            const nightHoursInterval = {
                previousDayEndDate: true,
                thisDayStartDate: true,
            }

            const has_previous_route = previous_route !== undefined;

            if (has_previous_route === false) return idx;
        
            const previousDayEndDate = utcToZonedTime(new Date(previous_route?.end_date), data.timezone);
            const thisDayStartDate = utcToZonedTime(new Date(route?.start_date), data.timezone);

            if (data.timezone) {
                nightHoursInterval.previousDayEndDate = format(previousDayEndDate, "dd-MM-yyyy");
                nightHoursInterval.thisDayStartDate = format(thisDayStartDate, "dd-MM-yyyy");
            }

            const isSameDay = nightHoursInterval.previousDayEndDate === nightHoursInterval.thisDayStartDate

            const hasToCountTimeOff = !!isSameDay // avoid sum night hours 

            productivity_report.total_stop_time = route?.end_date;

            productivity_report.driver_name = previous_route?.driver_name || "";

            if (!hasToCountTimeOff) {

                productivity_report.time_off = 1;

                idx.push(productivity_report);

                return idx;
            }

            const miliseconds_between_two_routes = differenceInMilliseconds(thisDayStartDate, previousDayEndDate)

            const time_off_in_seconds = miliseconds_between_two_routes / 1000;
            
            productivity_report.time_off = time_off_in_seconds;

            summary.total_time_off += productivity_report.time_off;
            
            idx.push(productivity_report);

            return idx;
        }, []);

        summary.time_off_average = summary?.total_time_off / productivity_reports?.length;

        dispatch(productivityReportsLoadSuccess({ productivityReports: productivity_reports, summary, total }));

        dispatch(productivityReportsChangeOperationStates({ loadSuccess: true }));        

    } catch (error) {
        console.log("error loading:", error);
        dispatch(productivityReportsChangeOperationStates({ loadFail: true }));
    }
};
