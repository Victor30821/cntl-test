import {
    ROUTES_REPORT_LOAD_SUCCESS,
    ROUTES_LOAD_SUCCESS,
    ROUTES_REPORT_CHANGE_OPERATION_STATES,
    ROUTES_REPORT_LOAD_ADDRESS_SUCCESS,
    ROUTES_REPORT_CHANGE_OPERATION_STATES_ATTACH_DRIVER,
} from './reducer';
import { api, apiRoutes, mapApi } from 'services/api'
import { DEFAULT_NULL_VALUE, MAX_LIMIT_FOR_SELECTORS, noModule, noSignal, noSignal24, vehicleOff, vehicleOn } from 'constants/environment';
import { API_URL, API_URL_PROXY, API_URL_MAP, API_KEY_MAP_GEOCODE } from 'constants/environment';
import worker_script from 'utils/workerGetAddress';
import { toast } from "react-toastify";
import { localizedStrings } from 'constants/localizedStrings';
import { getPreciseDistance } from 'geolib';
import { loadMapVehicles, mapChangeOperationStates } from 'store/modules';
import { differenceInSeconds, isToday } from 'date-fns';
import getSignalType from 'utils/getSignalType';
import { getDriversByIds } from 'store/modules/drivers/action';
import { canUseNewApi } from 'utils/contractUseNewApi';
import { removeOldApiReportsUntil } from 'utils/removeOldApiReportsUnti';
import { validateDateNewApi } from 'utils/validateDateNewApi';

export function routesReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: ROUTES_REPORT_CHANGE_OPERATION_STATES,
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

export function reportRouteLoadSuccess({
    driver = {},
    last_positions = [],
    last_positions_osrm = [],
    pointsfromDirection = [],
    vehicle = {},
    route = {},
}) {
    return {
        type: ROUTES_LOAD_SUCCESS,
        payload: {
            driver,
            last_positions,
            last_positions_osrm,
            pointsfromDirection,
            vehicle,
            route,
        }
    };
}
export function routesReportsLoadSuccess({ routes, total, address, summary }) {
    return {
        type: ROUTES_REPORT_LOAD_SUCCESS,
        payload: {
            routes,
            total,
            address,
            summary,
        }
    };
}

export function routesReportsLoadAddressSuccess({ address }) {
    return {
        type: ROUTES_REPORT_LOAD_ADDRESS_SUCCESS,
        payload: {
            address
        }
    };
}

export function routesReportsAttachDriverLoading({
    attachLoading = false,
    attachSuccess = false,
    attachFail = false,
}) {
    return {
        type: ROUTES_REPORT_CHANGE_OPERATION_STATES_ATTACH_DRIVER,
        payload: {
            attachLoading,
            attachSuccess,
            attachFail,
        }
    };
}

const routeBetweenSolicitation = ({ solicitation, route }) => {

    const { start_date: solicitation_start_date, end_date: solicitation_end_date, vehicles = [] } = solicitation;

    const { start_date: route_start_date, end_date: route_end_date } = route;

    const is_between_date_range = new Date(route_start_date).getTime() > new Date(solicitation_start_date).getTime() && new Date(route_end_date).getTime() <= new Date(solicitation_end_date).getTime();

    const vehicle_ids = vehicles.map(vehicle => vehicle.vehicle_id);

    const has_vehicle_on_solicitation = Array.isArray(vehicles) && vehicles.length > 0 && vehicle_ids.includes(route.vehicle_id);

    if (is_between_date_range && has_vehicle_on_solicitation) return true;

    return false;
}

const getRegistersByOffSet = (registers) => {
    if (registers.length === 0) return { registers, listAddresses: [] };
    const attributes = ["start", "end"];
    const customLength = Math.ceil(registers.length * attributes.length);
    const addressList = (new Array(customLength)).fill(undefined)
    return {
        // eslint-disable-next-line
        listAddresses: addressList.map((data, index) => {
            const registerIndex = index === 0 ? 0 : Math.floor(index / 2);
            const currentRegister = registers[registerIndex];
            const [
                isStart,
                isEnd,
            ] = [
                    index % 2 === 0,
                    index % 2 === 1,
                ];
            if (isStart) return {
                lat: currentRegister?.start_lat,
                lng: currentRegister?.start_lng
            }
            if (isEnd) return {
                lat: currentRegister?.end_lat,
                lng: currentRegister?.end_lng
            }
        })
    };
}

const getAddress = ({ listAddress }) => {
    return new Promise((resolve, reject) => {
        if (listAddress.length > 0) {
            const worker = new Worker(worker_script);
            worker.postMessage({ listAddress, urls: { API_URL, API_URL_MAP, API_URL_PROXY }, token: "", maps_key: API_KEY_MAP_GEOCODE });
            worker.addEventListener('message', (e) => {
                try {
                    const response = e.data;
                    const data = {};
                    for (let i = 1; i < response?.length; i++) {
                        const [address] = response?.[i] || [{}];
                        const key = (address?.latitude && address?.longitude && `${address?.latitude.toFixed(3)},${address?.longitude.toFixed(3)}`) || false;
                        if (!key) continue;
                        data[key] = address;
                    }
                    resolve(data);
                } catch (error) {
                    reject([]);
                    console.log(error);
                }
            });
        }
    })
}

export const getDriversAndAddresses = ({ coordinates, driver_ids, onFinish, clear = false }) => async dispatch => {
	const locations = [];
    const driversByids = [];
    const hasCoordinates = Array.isArray(coordinates) && coordinates.length > 0;
    const hasDrivers = Array.isArray(driver_ids) && driver_ids.length > 0;

    if (hasCoordinates) {
		const data = [];
		coordinates.forEach((coord) => {
			if (coord?.lat && coord?.lng) {
				data.push({
					url:"/api/geocode/json?latlng=" + coord.lat + "," + coord.lng + "&key=" + API_KEY_MAP_GEOCODE + "&language=pt-BR&channel=contele-gv&sensor=&client=gme-contelesolucoestecnologicas&res=format&mode=1"
				})
			}
		});

		const params = {
			method: 'POST',
			body: JSON.stringify({data}),
		};

		const response = await fetch(API_URL_PROXY + 'api/multi_requests/', params);
		const { content = [] } = await response?.json();

		locations.push(...content);
    }

	await getDriversByIds({ids: driver_ids})

    onFinish && onFinish({locations});
}

const newApiRoutesTrackings = async ({
    params
}) => {
    try {

    const URL_ROUTE = '/api/v1/routes-reports'

    const {
        start_date,
        end_date
    } = validateDateNewApi({
        start_date: params.start_date,
        end_date: params.end_date
    })

    const {
        data: {
            report_routes,
            route_summary,
            total_reports
        }
    } = await apiRoutes.get(URL_ROUTE, { params: { ...params, start_date, end_date } });

    return {
        report_routes,
        route_summary,
        total_reports
    }
        
    } catch (error) {
        console.log(error)
        return {
            report_routes: [],
            route_summary: {},
            total_reports: 0,
        }
    }
}

const oldApiRoutesTrackings = async ({
    params
}) => {
    try {

    const URL = "/routes/v1/?";

    const {
        data: {
            routes: routesList = [],
            total = 0,
            summary = {},
        }
    } = await api.get(URL, { params });

    return {
        routesList,
        total,
        summary,
    }
        
    } catch (error) {
        console.log(error)
        return {
            routesList: [],
            total: 0,
            summary: {},
        }
    }
}

const getSolicitations = async () => {
    try {

        const SOLICITATION_URL = "/solicitation/v1/?status=approved&offset=0limit=" + MAX_LIMIT_FOR_SELECTORS;

        const { 
            data: { 
                solicitations 
            } 
        } = await api.get(SOLICITATION_URL);

        return {
            solicitations,
        }
        
    } catch (error) {
        console.log(error)
        return {
            solicitations: [],
        }
    }
}

const fillRoutesWithSolicitations = ({
    routes,
    solicitations
}) => {

    const has_solicitations = Array.isArray(solicitations) && solicitations.length > 0;

    if(has_solicitations === false) {

        const routes_with_solicitations = routes.map(route => ({... route, has_solicitation: false, solicitation: null }));

        return {
            routes_with_solicitations,
        }
    }

    const routes_with_solicitations = routes.map(route => {

        route.has_solicitation = false;
        route.solicitation = null;

        const solicitations_between_start_end_route = solicitations?.filter?.(solicitation => routeBetweenSolicitation({ solicitation, route }));

        const has_solicitations_between_start_end_route = Array.isArray(solicitations_between_start_end_route) && solicitations_between_start_end_route.length > 0;

        if (has_solicitations_between_start_end_route) {
            const [solicitation = {}] = solicitations_between_start_end_route;
            route.has_solicitation = true;
            route.solicitation = solicitation;
        }

        return route;

    });

    return {
        routes_with_solicitations
    }

}

const findIfOnGoingRoute = async ({
    routes,
    pointsHistory,
    data,
    has_routes_new_api,
}) => {
    try {

        const end_date_is_today = isToday(data.end_date);

        if(end_date_is_today === false) return {routes_with_on_going_route: routes};
        
        const routes_with_on_going_route = [
            ...routes
        ];

        if(has_routes_new_api === false) {
    
            const routeOnGoing = parseVehicleOnMapToRoute({ pointsHistory });
    
            const showRoute = {
                [vehicleOn]: true,
                [noSignal]: true,
                [vehicleOff]: false,
                [noSignal24]: true,
                [noModule]: false,
            }
    
            const showRouteInReport = showRoute[routeOnGoing.status]

            if (routeOnGoing && showRouteInReport) routes_with_on_going_route.splice(0, 0, routeOnGoing);

            return {
                routes_with_on_going_route
            }

        }

        const [first_tracking={}] = routes;
        
        const {
            start_date,
            serial_number: imei,
            vehicle_id,
        } = first_tracking;
        
        const today = new Date();

        const {
            report_routes = [],
        } = await newApiRoutesTrackings({
            params: {
                start_date,
                end_date: today,
                imei,
                vehicle_id,
                includes_trackings: true,
                offset: 0,
                limit: 200,
                real_time_trackings: true
            }
        })
        
        const has_report_routes = Array.isArray(report_routes) && report_routes.length > 0;
        
        if(has_report_routes === false) return { routes_with_on_going_route }

        const [first_report={}] = report_routes;

        const {
            trackings,
            driver_name: name = ""
        } = first_report;

        const routeOnGoing = parseVehicleOnMapToRoute({ pointsHistory: {
            vehicle: pointsHistory.vehicle,
            last_positions: trackings,
            driver: {
                name
            },
            serial_number: imei,
        } });
        
        const showRoute = {
            [vehicleOn]: true,
            [noSignal]: true,
            [vehicleOff]: false,
            [noSignal24]: true,
            [noModule]: false,
        }
        
        const showRouteInReport = showRoute[routeOnGoing.status]

        if (routeOnGoing && showRouteInReport) {

            const has_to_remove_first_route = first_tracking.start_date === first_report.start_date;

            if(has_to_remove_first_route) routes_with_on_going_route.shift()

            routes_with_on_going_route.splice(0, 0, routeOnGoing);
        }

        return {
            routes_with_on_going_route
        }
        
    } catch (error) {
        console.log(error)
    }
}

const verifySummaryOldApi = ({
    summary
}) => {
    
    const max_speed_system = 150;

    const has_old_api_max_speed_exceed = summary.max_speed > max_speed_system;
    const has_old_api_average_speed_exceed = Math.round(summary.average_speed) > max_speed_system;

    const old_max_speed = has_old_api_max_speed_exceed ? max_speed_system : summary.max_speed;
    const old_average_speed = has_old_api_average_speed_exceed ? max_speed_system : Math.round(summary.average_speed);
    return {
        max_speed: old_max_speed,
        average_speed: old_average_speed,
    }
}

const mergeSummaryData = ({
    summary,
    route_summary,
    has_old_routes
}) => {

    const has_summary_old_api = Object.keys(summary).length > 0 && has_old_routes;
    const has_summary_new_api = Object.keys(route_summary).length > 0;

    if(has_summary_old_api === false && has_summary_new_api) {
        return {
            summary_merged: route_summary
        }
    }

    if(has_summary_old_api && has_summary_new_api === false) {
        const {
            max_speed: summary_max_speed,
            average_speed: summary_average_speed,
        } = verifySummaryOldApi({
            summary
        })
        return {
            summary_merged: {
                ...summary,
                max_speed: summary_max_speed,
                average_speed: summary_average_speed,
            }
        }
    }

    const {
        max_speed: summary_max_speed,
        average_speed: summary_average_speed,
    } = verifySummaryOldApi({
        summary
    })

    const summary_merged = {
        average_speed: route_summary.average_speed > summary_average_speed ? route_summary.average_speed : summary_average_speed,
        max_speed: route_summary.max_speed > summary_max_speed ? route_summary.max_speed : summary_max_speed,
        total_cost: summary.total_cost + route_summary.total_cost,
        total_distance: summary.total_distance + route_summary.total_distance,
        total_time: summary.total_time + route_summary.total_time,
    }

    return {
        summary_merged,
    }

}

export const loadRoutesReports = data => async dispatch => {
    try {

    dispatch(routesReportsChangeOperationStates({ loadLoading: true, }));
    dispatch(routesReportsLoadAddressSuccess({ address: [] }));
    dispatch(routesReportsLoadSuccess({ routes: [],total: 0, }));
    
    const { 
        pointsHistory
    } = await dispatch(loadMapVehicles({ vehicle_id: data.vehicle_id, limit: false }));
    
    const {
        vehicle: {
            serial_number = "",
        }
    } = pointsHistory;

    const {
        vehicle_id,
        start_date,
        end_date,
        includes_trackings,
        page,
        limit,
        offset,
        sort = "",
        type = null,
        search_term = null,
        organization_id
    } = data;

    const [
        {
            report_routes,
            route_summary,
            total_reports
        },
        {
            routesList,
            total,
            summary,
        }
    ] = await Promise.all([
        newApiRoutesTrackings({
            params: {
                vehicle_id,
                start_date,
                end_date,
                imei: serial_number,
                includes_trackings,
                offset: page,
                limit,
                real_time_trackings: false
            }
        }),
        oldApiRoutesTrackings({
            params: {
                vehicle_id,
                start_date,
                end_date,
                offset,
                limit,
                search_term,
                type,
                sort,
            }
        })
    ]);
    
    const has_routes_new_api = Array.isArray(report_routes) && report_routes.length > 0;
    const has_routes_old_api = Array.isArray(routesList) && routesList.length > 0;

    if(has_routes_new_api === false && has_routes_old_api === false) {
        dispatch(routesReportsLoadSuccess({
            routes: [],
            total: 0,
        }));
        dispatch(routesReportsChangeOperationStates({ loadSuccess: false }));
        return;
    }

    const {
        solicitations = [],
    } = await getSolicitations();
    
    const orderByDesc = (a,b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    
    const {
        is_authorized
    } = canUseNewApi({ organization_id, last_points: [pointsHistory], vehicle_id });
    
    const {
        routes_period_removed = []
    } = removeOldApiReportsUntil({
        routes: routesList,
        is_authorized
    })
    
    const all_routes = [...routes_period_removed, ...report_routes].sort(orderByDesc);

    const {
        routes_with_solicitations
    } = fillRoutesWithSolicitations({
        routes: all_routes,
        solicitations
    })
    
    const {
        routes_with_on_going_route
    } = await findIfOnGoingRoute({
        routes: routes_with_solicitations,
        pointsHistory,
        data,
        has_routes_new_api,
    });

    const has_old_routes = routes_period_removed?.length > 0;
    
    const {
        summary_merged
    } = mergeSummaryData({
        summary,
        route_summary,
        has_old_routes
    })

    dispatch(routesReportsLoadSuccess({
        routes: routes_with_on_going_route,
        total: total + total_reports,
        summary: summary_merged
    }));

    dispatch(routesReportsChangeOperationStates({ loadSuccess: true }));

    const {
        listAddresses
    } = getRegistersByOffSet(routes_with_on_going_route);

    const address = await getAddress({ listAddress: listAddresses });

    dispatch(routesReportsLoadAddressSuccess({ address }));

    } catch (error) {
        console.log(error);
        dispatch(routesReportsChangeOperationStates({ loadFail: true }))
    }
};

export const attachDriverToRoute = data => async dispatch => {
    try {
        dispatch(routesReportsAttachDriverLoading({ attachLoading: true }));

        const {
            route,
            driver_ids = []
        } = data;

        const {
            file_route_id = "",
            start_date,
            end_date,
            serial_number: imei = "",
            route_id = 0,
        } = route;

        const has_file_route_id = !!file_route_id;
        
        if(has_file_route_id) {

            const URL = `/routes/v1/link-driver/${route_id}`;

            await api.post(URL, { driver_ids });
    
            toast.success(localizedStrings.successAttachDriver);
    
            dispatch(routesReportsAttachDriverLoading({ attachSuccess: true }));

            return
        }

        const [start_only_date, start_time] = start_date.split("T");
        const [start_only_time,] = start_time.split(".");

        const [end_only_date, end_time] = end_date.split("T");
        const [end_only_time,] = end_time.split(".");

        const start_bound_driver = `${start_only_date} ${start_only_time}`;
        const end_bound_driver = `${end_only_date} ${end_only_time}`;

        const {
            bounds_drivers
        } = driver_ids.reduce((acc,driver_id) => {

            const init_bound = {
                driver_id: String(driver_id),
                imei,
                start_bound_date: start_bound_driver,
            }

            const end_bound = {
                driver_id: "null",
                imei,
                start_bound_date: end_bound_driver,
            }

            acc.bounds_drivers.push(init_bound, end_bound)

            return acc;

        },{
            bounds_drivers: []
        });

        const has_bounds_drivers = Array.isArray(bounds_drivers) && bounds_drivers.length > 0;

        if(has_bounds_drivers === false) {

            toast.error(localizedStrings.errorAttachDriver);

            dispatch(routesReportsAttachDriverLoading({ attachFail: true }))
            return;
        }

        const URL_NEW_API = '/api/v1/bound-driver';

        await apiRoutes.post(URL_NEW_API, { bounds_drivers });

        toast.success(localizedStrings.successAttachDriver);
    
        dispatch(routesReportsAttachDriverLoading({ attachSuccess: true }));

    } catch (error) {
        console.log(error);

        toast.error(localizedStrings.errorAttachDriver);

        dispatch(routesReportsAttachDriverLoading({ attachFail: true }))

    }
}

export const getSingleRouteByFilters = ({
    filters,
    onGoing = false
}) => async dispatch => {
    try {
        dispatch(mapChangeOperationStates({ loadLoading: true }));
    
        const URL_ROUTE = "/api/v1/routes-reports";

        if(onGoing) {

            const {
                vehicle_id,
                start_date,
                imei,
            } = filters;
            
            const today = new Date().toISOString();

            const [today_day, today_wrong_time] = today.split("T");
            const [today_time] = today_wrong_time.split(".");

            const params = {
                vehicle_id,
                imei,
                includes_trackings: true,
                start_date,
                end_date: `${today_day} ${today_time}`,
                real_time_trackings: true,
            }
            
            const {
                data: {
                    report_routes
                }
            } = await apiRoutes.get(URL_ROUTE, { params });

            const has_report_routes = Array.isArray(report_routes) && report_routes.length > 0;

            if(has_report_routes === false) {

                dispatch(reportRouteLoadSuccess({
                    driver: {},
                    last_positions: [],
                    last_positions_osrm: [],
                    vehicle: {},
                    route: [],
                }))
    
                return;
            }

            const { pointsHistory } = await dispatch(loadMapVehicles({
                vehicle_id,
                limit: false,
                best_route: true
            }));

            const {
                vehicle = {},
            } = pointsHistory

            const [route={}] = report_routes;

            const {
                trackings,
                driver_name: name = ""
            } = route;

            const routeOnGoing = parseVehicleOnMapToRoute({ 
            pointsHistory: {
                vehicle: pointsHistory.vehicle,
                last_positions: trackings,
                driver: {
                    name
                }
            } });

            dispatch(reportRouteLoadSuccess({
                driver: {name},
                last_positions: route.trackings,
                last_positions_osrm: [],
                vehicle,
                route: routeOnGoing,
            }));

            dispatch(mapChangeOperationStates({ loadSuccess: true }));

            return;

        }

        const params = {
            ...filters,
        };
        
        const {
            data: {
                report_routes
            }
        } = await apiRoutes.get(URL_ROUTE, { params });
    
        const has_routes = Array.isArray(report_routes) && report_routes.length > 0;

        if(has_routes === false) {

            dispatch(reportRouteLoadSuccess({
                driver: {},
                last_positions: [],
                last_positions_osrm: [],
                vehicle: {},
                route: [],
            }))

            return;

        }

        const { pointsHistory } = await dispatch(loadMapVehicles({
            vehicle_id: filters.vehicle_id,
            limit: false,
            best_route: true
        }));

        const {
            vehicle
        } = pointsHistory;

        const [route] = report_routes;

        const {
            driver_name = ""
        } = route;

        dispatch(reportRouteLoadSuccess({
            driver: {name: driver_name},
            last_positions: route.trackings,
            last_positions_osrm: [],
            vehicle,
            route,
        }))

        dispatch(mapChangeOperationStates({ loadSuccess: true }));
    
    } catch (error) {
        console.log(error);
        dispatch(mapChangeOperationStates({ loadFail: true }));
    }
}

export const getRoutesByFileRouteId = ({
    file_route_id,
    vehicle_id,
    best_route,
    route_id,
}) => async dispatch => {
    try {
        dispatch(mapChangeOperationStates({ loadLoading: true }));
        const URL = "/api/v1/last-break-route-point";
        const ROUTE_URL = "/routes/v1/" + route_id;
        const hasRouteId = route_id && !isNaN(+route_id)

        if (!hasRouteId) {
            const { pointsHistory } = await dispatch(loadMapVehicles({
                vehicle_id,
                limit: false,
                best_route: true
            }));

            const {
                last_positions = [],
                last_positions_osrm = [],
                pointsfromDirection = {},
                vehicle = {},
                driver = {}
            } = pointsHistory

            const route = parseVehicleOnMapToRoute({ pointsHistory });

            dispatch(mapChangeOperationStates({ loadSuccess: true }));
            return dispatch(reportRouteLoadSuccess({
                driver,
                last_positions,
                last_positions_osrm,
                pointsfromDirection,
                vehicle,
                route: route ? route : undefined,
            }))
        }

        const {
            data: { route: searchedRoute }
        } = await api.get(ROUTE_URL);

        const [route = {}] = searchedRoute;

        const breakRouteParams = {
            file_route_id: file_route_id || route?.file_route_id,
            vehicle_id: vehicle_id || route?.vehicle_id,
            best_route,
        }

        const {
            data: { last_points }
        } = await mapApi.get(URL, { params: breakRouteParams });

        const [routeInfo = {}] = last_points;

        const {
            driver = {},
            last_positions = [],
            last_positions_osrm = [],
            vehicle = {},
        } = routeInfo;

        Object.assign(route, {
            vehicle_name: vehicle.name,
            vehicle_id: vehicle.id,
        })

        dispatch(reportRouteLoadSuccess({
            driver,
            last_positions,
            last_positions_osrm,
            vehicle,
            route,
        }))
        dispatch(mapChangeOperationStates({ loadSuccess: true }));
    } catch (error) {
        console.log(error);
        dispatch(mapChangeOperationStates({ loadFail: true }));
    }
}


const parseVehicleOnMapToRoute = ({
    pointsHistory,
}) => {

    const MINUMUM_POINTS_TO_ACCEPT_ROUTE = 3;

    const {
        last_positions: pointsFromOnGoingRoute,
        vehicle = {}
    } = pointsHistory;

    const hasRoute = Array.isArray(pointsFromOnGoingRoute) && pointsFromOnGoingRoute.length > 0;

    const hasEnoughPoints = !!hasRoute && pointsFromOnGoingRoute.length > MINUMUM_POINTS_TO_ACCEPT_ROUTE;

    if (!hasRoute || !hasEnoughPoints) return false

    const [firstPoint] = pointsFromOnGoingRoute;
    const [lastPoint] = pointsFromOnGoingRoute.slice().reverse();
    const {
        odometer: start_odometer,
        lat: start_lat,
        lng: start_lng,
        timestamp: start_date
    } = firstPoint;
    const {
        odometer: end_odometer,
        lat: end_lat,
        lng: end_lng,
        timestamp: last_date
    } = lastPoint;

    const {
        speeds = [],
        totalSpeed = 0
    } = pointsFromOnGoingRoute.reduce((acc, point, index) => {
        if (index === 0) return acc;

        acc.totalSpeed += point.speed;

        acc.speeds.push(point.speed);

        return acc;
    }, {
        speeds: [0],
        totalSpeed: 0
    });

    const distance = getPreciseDistance({ lat: start_lat, lng: start_lng }, { lat: end_lat, lng: end_lng });
    const max_speed = Math.max(...speeds);

    const average_speed = totalSpeed / pointsFromOnGoingRoute.length;

    const time = differenceInSeconds(new Date(last_date), new Date(start_date))

    const {
        type_vehicle_name,
        id: vehicle_id,
        name: vehicle_name,
        liters_value,
        average_fuel_km,
        year_manufacturer,
        model,
        plate_number,
        organization_id,
    } = vehicle

    const cost = (distance / 1000) / average_fuel_km * liters_value;

    const status = getSignalType({...lastPoint, stage_vehicle_id: vehicle?.stage_vehicle_id});

    return {
        time,
        cost,
        model,
        status,
        end_lat,
        end_lng,
        distance,
        start_lat,
        max_speed,
        id: false,
        start_lng,
        start_date,
        vehicle_id,
        driver_name: pointsHistory?.driver?.name,
        vehicle_name,
        end_odometer,
        plate_number,
        average_speed,
        onGoing: true,
        start_odometer,
        organization_id,
        year_manufacturer,
        type_vehicle_name,
        solicitation: null,
        created: start_date,
        file_route_id: false,
        serial_number: pointsHistory?.serial_number || '',
        timestamp: start_date,
        speed: lastPoint.speed,
        has_solicitation: false,
        ignition: lastPoint.ignition,
        end_date: DEFAULT_NULL_VALUE,
    }
}
