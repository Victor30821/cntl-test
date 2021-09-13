import {
    DRIVERS_PER_DAY_REPORT_LOAD_SUCCESS,
    DRIVERS_PER_DAY_REPORT_CHANGE_OPERATION_STATES
} from './reducer';
import { api, apiRoutes } from 'services/api'
import { totalNightSeconds } from 'utils/total-night-seconds';
import { canUseNewApiByContract } from 'utils/contractUseNewApi';
import { format } from 'date-fns'
import { validateDateNewApi } from 'utils/validateDateNewApi';

export function driversPerDayReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: DRIVERS_PER_DAY_REPORT_CHANGE_OPERATION_STATES,
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

export function driversPerDayReportsLoadSuccess({ driver_by_day, driver_by_day_summary, driversPerDay, total }) {

        const {
            averageSpeed,
            totalDistance,
            maxSpeed,
            totalTime,
            totalNightHours,
            longestDrivingRouteTime
        } = driversPerDay.reduce((acc, reg) => {

            acc.averageSpeed += reg.average_speed;
            acc.totalDistance += reg.total_distance;
            acc.totalTime += reg.total_time;
            acc.totalNightHours += reg.total_night_hours;

            if(reg.longest_driving_route_time > acc.longestDrivingRouteTime){
                acc.longestDrivingRouteTime = reg.longest_driving_route_time;
            }

            if(reg.max_speed > acc.maxSpeed) {
                acc.maxSpeed = reg.max_speed; 
            }

            return acc;

        },{
            averageSpeed: 0,
            totalDistance: 0,
            maxSpeed: 0,
            totalTime: 0,
            totalNightHours: 0,
            longestDrivingRouteTime: 0
        })

    const {
        total_time: new_summary_total_time = 0,
        total_distance: new_summary_total_distance = 0,
        total_night_hours: new_summary_total_night_hours = 0,
        total_longest_driving_route_time: new_summary_total_longest_driving_route_time = 0,
        max_speed: new_summary_max_speed = 0,
    } = driver_by_day_summary;

    const summary = {
        average_speed: averageSpeed,
        total_distance: totalDistance + new_summary_total_distance,
        max_speed: maxSpeed > new_summary_max_speed ? maxSpeed : new_summary_max_speed,
        total_time: totalTime + new_summary_total_time,
        total_night_hours: totalNightHours + new_summary_total_night_hours,
        longest_driving_route_time: longestDrivingRouteTime > new_summary_total_longest_driving_route_time ? longestDrivingRouteTime : new_summary_total_longest_driving_route_time
    }
    
    return {
        type: DRIVERS_PER_DAY_REPORT_LOAD_SUCCESS,
        payload: {
            summary,
            driversPerDay,
            newDriversPerDay: driver_by_day,
            total,
        }
    };
}

const loadNewApiReport = async ({
    params
}) => {
    try {

        const URL_ROUTES = '/api/v1/driver-by-day';

        const {
            organization_id = 0
        } = params;

        const {
            is_authorized
        } = canUseNewApiByContract({organization_id});

        if(is_authorized === false) return {
            driver_by_day: [],
            driver_by_day_summary: {},
            driver_by_day_total: 0,
        }
        
        const {
            start_date,
            end_date
        } = validateDateNewApi({
            start_date: params.start_date_new_api,
            end_date: params.end_date_new_api
        })

        const {
            data:{
                driver_by_day,
                driver_by_day_summary,
                total: driver_by_day_total,
            }
        } = await apiRoutes.get(URL_ROUTES, { params: { 
                start_date,
                end_date,
                driver_id: params.driver_id,
                inicial_night_period: params.inicial_night_period,
                end_night_period: params.end_night_period
        }});

        return {
            driver_by_day,
            driver_by_day_summary,
            driver_by_day_total, 
        }
        
    } catch (error) {
        return {
            driver_by_day: [],
            driver_by_day_summary: {},
            driver_by_day_total: 0,
        }
    }
}


export const loadDriversPerDayReports = data => async dispatch => {
    try {

        dispatch(driversPerDayReportsChangeOperationStates({ loadLoading: true }));

        const URL = "/routes/v1/drivers";

        const params = {
            organization_id: data.organization_id,
            start_date: data.period.start_date,
            end_date: data.period.end_date,
            driver_id: data.driver_id,
            limit: '-1',
            offset: 0,
        };

        const {
            driver_id,
            period: {
                start_date,
                end_date
            },
            inicial_night_period = "22:00",
            end_night_period = "06:00"
        } = data;

        const start_date_new_api = start_date + ' 03:00:00';
        const end_date_new_api = end_date + ' 23:59:59';

        const [
            {
                driver_by_day,
                driver_by_day_summary,
                driver_by_day_total,
            },
            {
                data: {
                    routes = [], 
                    total: routes_total
                }
            }
        ] = await Promise.all([
            loadNewApiReport({ params: {
                ...data,
                driver_id,
                start_date_new_api,
                end_date_new_api,
            } }),
            api.get(URL, { params })
        ]);

        const has_driver_by_day = Array.isArray(driver_by_day) && driver_by_day.length > 0;
        const has_routes = Array.isArray(routes) && routes.length > 0;

        if(has_routes === false && has_driver_by_day === false) {
            dispatch(driversPerDayReportsChangeOperationStates({ loadSuccess: true }));
            dispatch(driversPerDayReportsLoadSuccess({ driver_by_day: [], driver_by_day_summary: {}, driversPerDay: [], total: 0, dispatch }));
            return;
        }

        if(has_driver_by_day === false) {

            const driversPerDay = routes.map((route, i) => {

                const start_date_route = route.start_date;
                const end_date_route = route.end_date;
    
                route.total_night_hours = totalNightSeconds({
                    inicial_night_period,
                    end_night_period,
                    start_date_route,
                    end_date_route,
                });
                
               return route;
            });
            
            const total = routes_total;

            dispatch(driversPerDayReportsChangeOperationStates({ loadSuccess: true }));

            dispatch(driversPerDayReportsLoadSuccess({ driver_by_day: [], driver_by_day_summary: {}, driversPerDay, total, dispatch }));

            return;

        }

        if(has_routes === false) {

            dispatch(driversPerDayReportsChangeOperationStates({ loadSuccess: true }));

            dispatch(driversPerDayReportsLoadSuccess({ driver_by_day, driver_by_day_summary, driversPerDay: [], total: driver_by_day_total, dispatch }));

            return;

        }

        const days_to_remove = driver_by_day.map(route => route?.day)
        
        const drivers_routes_formated_removed = routes.reduce((acc, reports) => {

            const date = format(new Date(reports.start_date), "yyyy-MM-dd");

            const has_day_on_new_api = days_to_remove.includes(date);

            if(has_day_on_new_api) return acc;

            acc.push(reports);

            return acc;

        }, []);
        
        const driversPerDay = drivers_routes_formated_removed.map((route, i) => {

            const start_date_route = route.start_date;
            const end_date_route = route.end_date;

            route.total_night_hours = totalNightSeconds({
                inicial_night_period,
                end_night_period,
                start_date_route,
                end_date_route,
            });
            
           return route;
        });

        const total = routes_total || 0 + driver_by_day_total || 0;

        dispatch(driversPerDayReportsLoadSuccess({ driver_by_day, driver_by_day_summary, driversPerDay, total, dispatch }));
        dispatch(driversPerDayReportsChangeOperationStates({ loadSuccess: true }));

    }
    catch(err) {
        console.log("error loading:", err);
        dispatch(driversPerDayReportsChangeOperationStates({ loadFail: true }));
    }
};
