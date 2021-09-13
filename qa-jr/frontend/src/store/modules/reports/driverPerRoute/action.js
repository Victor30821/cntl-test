import {
    DRIVERS_PER_ROUTE_REPORT_LOAD_SUCCESS,
    DRIVERS_PER_ROUTE_REPORT_CHANGE_OPERATION_STATES
} from './reducer';
import { api, apiRoutes } from 'services/api'
import { canUseNewApiByContract } from 'utils/contractUseNewApi'
import { format } from 'date-fns'
import { validateDateNewApi } from 'utils/validateDateNewApi';

export function driversPerRouteReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: DRIVERS_PER_ROUTE_REPORT_CHANGE_OPERATION_STATES,
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

export function driversPerRouteReportsLoadSuccess({ driversPerRoute, total, newDriversPerRoute, newDriverPerRouteSummary }) {

    const {
        total_distance,
        max_speed,
        total_time,
    } = driversPerRoute.reduce((acc, current_route) => {

        acc.total_distance += current_route.total_distance;
        acc.total_time += current_route.total_time;  

        if(current_route.max_speed > acc.max_speed) acc.max_speed = current_route.max_speed; 

        return acc;

    }, {
        total_distance: 0,
        max_speed: 0,
        total_time: 0,
    });

    const has_newDriversPerRoute = Array.isArray(newDriversPerRoute) && newDriversPerRoute.length > 0;

    if(has_newDriversPerRoute === false) {

        const summary = {
            total_distance,
            max_speed,
            total_time,
        }

        return {
            type: DRIVERS_PER_ROUTE_REPORT_LOAD_SUCCESS,
            payload: {
                summary,
                driversPerRoute,
                newDriversPerRoute: [],
                total,
            }
        };
    }

    const summary = {
        total_distance: total_distance + newDriverPerRouteSummary.total_distance,
        max_speed: max_speed > newDriverPerRouteSummary.max_speed ? max_speed : newDriverPerRouteSummary.max_speed,
        total_time: total_time + newDriverPerRouteSummary.total_time,
    }
    
    return {
        type: DRIVERS_PER_ROUTE_REPORT_LOAD_SUCCESS,
        payload: {
            summary,
            driversPerRoute,
            newDriversPerRoute,
            total,
        }
    };
}

const loadNewApiReport = async ({
    params
}) => {
    try {

        const URL_ROUTES = '/api/v1/driver-per-route';

        const {
            organization_id = 0
        } = params;

        const {
            is_authorized
        } = canUseNewApiByContract({organization_id});

        if(is_authorized === false) return {
            driver_per_route: [],
            driver_per_route_summary: {},
            driver_per_route_total: 0,
        }

        const {
            start_date,
            end_date
        } = validateDateNewApi({
            start_date: `${params?.period?.start_date} 03:00:00`,
            end_date: `${params?.period?.end_date} 23:59:59`
        })

        const {
            data:{
                driver_per_route,
                driver_per_route_summary,
                total: driver_per_route_total,   
            }
        } = await apiRoutes.get(URL_ROUTES, { params: { 
                start_date,
                end_date,
                driver_id: params.driver_id,
                inicial_night_period: params.inicial_night_period,
                end_night_period: params.end_night_period
        }});

        return {
            driver_per_route,
            driver_per_route_summary,
            driver_per_route_total,
        }
        
    } catch (error) {
        return {
            driver_per_route: [],
            driver_per_route_summary: {},
            driver_per_route_total: 0,
        }
    }
}

export const loadDriversPerRouteReports = data => async dispatch => {
    try {
        dispatch(driversPerRouteReportsChangeOperationStates({ loadLoading: true }));
        const {
            organization_id,
            start_date,
            end_date,
            offset,
            limit,
            search_term,
            sort,
            driver_id,
        } = data;

        const URL_OLD_API = '/routes/v1/drivers?';

        const [
            {
                driver_per_route,
                driver_per_route_summary,
                driver_per_route_total
            },
            {
                data: {
                    routes,
                }
            }
        ] = await Promise.all([
            loadNewApiReport({ params: {  ...data,} }),
            api.get(URL_OLD_API, {
                params: {
                    organization_id,
                    start_date,
                    end_date,
                    offset,
                    limit,
                    search_term: !!search_term ? search_term : null,
                    sort,
                    driver_id
                }
            }),
        ])

        const days_to_remove = driver_per_route.map(route => format(new Date(route?.init), 'yyyy-MM-dd'))

        const drivers_routes_formated_removed = routes.reduce((acc, reports) => {

            const date = format(new Date(reports.start_date), "yyyy-MM-dd");

            const has_day_on_new_api = days_to_remove.includes(date);

            if(has_day_on_new_api) return acc;

            acc.push(reports);

            return acc;

        }, []);
        
        const driversPerRoute = drivers_routes_formated_removed;
        const total = drivers_routes_formated_removed.length + driver_per_route_total;
        const newDriversPerRoute = driver_per_route;
        const newDriverPerRouteSummary = driver_per_route_summary;
        
        dispatch(driversPerRouteReportsLoadSuccess({ driversPerRoute, total, newDriversPerRoute, newDriverPerRouteSummary }));
        dispatch(driversPerRouteReportsChangeOperationStates({ loadSuccess: true }));
        
    } catch (error) {
        console.log(error);
        dispatch(driversPerRouteReportsChangeOperationStates({ loadFail: true }));
    }
};
