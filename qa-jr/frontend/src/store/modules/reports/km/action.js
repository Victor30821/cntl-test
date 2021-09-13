import {
    KM_REPORT_LOAD_SUCCESS,
    KM_REPORT_CHANGE_OPERATION_STATES
} from './reducer';

import { api, apiRoutes, mapApi } from 'services/api'
import getLastPoints from "utils/requests/getLastPoints";

import { formatTime } from 'utils/formatTime';

import { MAX_LIMIT_FOR_SELECTORS } from "constants/environment"
import { isWithinInterval } from 'date-fns';
import { canUseNewApiByContract, canUseNewApi } from 'utils/contractUseNewApi'
import { removeReportsFromKM } from 'utils/removeReportsFromKM'

export function kmReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: KM_REPORT_CHANGE_OPERATION_STATES,
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

export function kmReportsLoadSuccess({ routes, summary, total }) {
    return {
        type: KM_REPORT_LOAD_SUCCESS,
        payload: {
            kmReports: routes,
            total,
            summary
        }
    };
}

const mergeDataReportsKms = ({
    reports_routes_kms_valid, 
    routes_completed,
}) => {

    const reports_routes_kms_idx_by_vehicle_id = reports_routes_kms_valid.reduce((acc, current_report) => {

        const has_idx = !!acc[current_report.vehicle_id];

        if(has_idx === false) acc[current_report.vehicle_id] = current_report;

        return acc;

    }, {});

    const routes_data_merged = routes_completed.reduce((acc, current_report_routes) => {

        const has_reports_routes_kms_idx_by_vehicle_id = !!reports_routes_kms_idx_by_vehicle_id[current_report_routes.vehicle_id];

        if(has_reports_routes_kms_idx_by_vehicle_id === false) {
            acc.push(current_report_routes);
            return acc;
        }

        const new_api_report_km = reports_routes_kms_idx_by_vehicle_id[current_report_routes.vehicle_id];

        const time = formatTime({ seconds: current_report_routes.time_raw + new_api_report_km.time_raw});
        
        const cost = current_report_routes.cost +  new_api_report_km.cost;

        const is_start_odometer_bigger_than_current = new_api_report_km.start_odometer > current_report_routes.start_odometer;
        const is_end_odometer_bigger_than_current = new_api_report_km.end_odometer > current_report_routes.end_odometer;

        const start_odometer = is_start_odometer_bigger_than_current ? new_api_report_km.start_odometer : current_report_routes.start_odometer;
        const end_odometer = is_end_odometer_bigger_than_current ? new_api_report_km.end_odometer : current_report_routes.end_odometer;

        const distance = new_api_report_km.distance + current_report_routes.distance;

        const new_report_km = {
            ...current_report_routes,
            time,
            cost,
            start_odometer,
            end_odometer,
            distance
        }

        acc.push(new_report_km);

        return acc;

    }, []);

    const vehicle_ids_to_remove = routes_data_merged.map(route => route.vehicle_id);

    const reports_routes_kms_filtred = reports_routes_kms_valid.filter(route => !vehicle_ids_to_remove.includes(route.vehicle_id));

    const routes_km_merged = [...reports_routes_kms_filtred, ...routes_data_merged];
    
    return {
        routes_km_merged
    }

}

const getValidDate = ({
    data
}) => {

    const {
        start_date,
        end_date
    } = data;

    const [start_only_date, wrong_start_time] = start_date.split("T");
    const [start_only_time,] = wrong_start_time.split(".");

    const [end_only_date, wrong_end_time] = end_date.split("T");
    const [end_only_time,] = wrong_end_time.split(".");

    return {
        start_date: `${start_only_date} ${start_only_time}`,
        end_date: `${end_only_date} ${end_only_time}`
    }
}

const getNewApiKmReports = async ({
    data
}) => {
    try {

        const {
            vehicles_with_imei
        } = await getVehicleIdAndImeis();
        
        const vehicles_with_imei_authorized = vehicles_with_imei.reduce((acc, vehicle) => {

            const {
                vehicle_id
            } = vehicle;
            
            const {
                is_authorized
            } = canUseNewApi({ organization_id: data.organization_id, last_points: [{vehicle}], vehicle_id });
            
            if(is_authorized === false) return acc;

            acc.push(vehicle)

            return acc;

        }, []);
        
        const URL_ROUTE_TEST = "/api/v1/report-km";
        
        const {
            start_date,
            end_date
        } = getValidDate({ data });

        const promise_new_api = vehicles_with_imei_authorized.map(async (vehicle) => {

            const {
                vehicle_id,
                imei
            } = vehicle;
            
            const params = {
                vehicle_id,
                start_date,
                end_date,
                imei,
                filter_group: data?.vehicle_group_name || null,
                filter_type_vehicle_id: data?.vehicle_type_id || null,
                filter_model: data?.vehicle_model_search_term || null,
                filter_year_manufacturer: data?.vehicle_year_manufacturer || null,
                filter_type_fuel_id: data?.vehicle_fuel_type_id || null,
            };

            const {
                data: {
                    reports_routes_km,
                    km_summary
                }
            } = await apiRoutes.get(URL_ROUTE_TEST, { params });


            const reports_km = reports_routes_km.map(km => {
                return {
                    ...km,
                    time_raw: km.time,
                    time: formatTime({ seconds: km.time }),
                    had_odometer_command_executed: false,
                    odometers: [],
                }
            })
            
            return {
                reports_routes_km: reports_km,
                km_summary
            }

        });

        const report_routes_kms = await Promise.all(promise_new_api);

        return {
            report_routes_kms
        }

        
    } catch (error) {
        return {
            report_routes_kms: [],
        }
    }
}

const getVehicleIdAndImeis = async () => {
    try {

        const URL = '/api/v1/last-points/';

        const params = {
            limit: true,
            best_route: false,
        }

        const {
            data: { last_points }
        } = await mapApi.get(URL, { params });
        
        const is_object = !Array.isArray(last_points) && Object.keys(last_points) && Object.keys(last_points)?.length > 0;
        
        if(is_object) {

            const has_serial_number = !!last_points?.vehicle?.serial_number;

            if(has_serial_number === false) return {
                vehicles_with_imei: [],
            }

            const {
                vehicle
            } = last_points

            const {
                serial_number: imei,
            } = vehicle;

            const vehicles_with_imei = [{ ...vehicle, imei }];

            return {
                vehicles_with_imei
            }

        }

        const vehicles_with_imei = last_points
            ?.reduce((acc, current_last_point) => {

                const { vehicle } = current_last_point;

                const has_serial_number = !!vehicle.serial_number;

                if(has_serial_number === false) return acc;

                const {
                    vehicle_id,
                    serial_number:imei
                } = vehicle;

                acc.push({ ...vehicle, vehicle_id, imei });

                return acc;

            }, []) || [];

        return {
            vehicles_with_imei,
        }
        
    } catch (error) {
        console.log(error);
        return {
            vehicles_with_imei: [],
        }
    }
}



const getOldApiKmReports = async ({
    params
}) => {
    try {

        const URL_KM_REPORT = "/routes/v1/km-report";

        const  {
            data: { 
                routes = [], 
                summary = {}, 
                total = 0 
            }
        } = await api.get(URL_KM_REPORT, { params });
        
        const {
            is_authorized
        } = canUseNewApiByContract({ organization_id: params.organization_id });
        
        if(is_authorized) {

            const {
                new_summary,
                new_total,
                routes_vehicle_ids_removed
            } = await removeReportsFromKM({
                routes,
                summary,
                is_authorized
            })
            
            return {
                routes: routes_vehicle_ids_removed,
                summary: new_summary,
                total: new_total,
            }

        }

        return {
            routes,
            summary,
            total,
        }
        
    } catch (error) {
        return {
            routes: [],
            summary: {},
            total: 0,
        }
    }
}

export const loadKmReports = data => async dispatch => {
    dispatch(kmReportsChangeOperationStates({ loadLoading: true }));
    dispatch(kmReportsLoadSuccess({routes: [], summary: {cost: 0, distance: 0}, total: 0}));
    try {
        
        const params_km_report = {
            organization_id: data?.organization_id || undefined,
            start_date: data?.start_date || undefined,
            end_date: data?.end_date || undefined,
            offset: data?.offset || undefined,
            group: data?.group || undefined,
            limit: data?.limit || undefined,
            vehicle_type_id: data?.vehicle_type_id || undefined,
            vehicle_group_name: data?.vehicle_group_name || undefined,
            vehicle_model_search_term: data?.vehicle_model_search_term || undefined,
            vehicle_year_manufacturer: data?.vehicle_year_manufacturer || undefined,
            vehicle_fuel_type_id: data?.vehicle_fuel_type_id || undefined,
            vehicle_id: data?.vehicle_id?.join(",") || undefined,
            vehicle_search_term: data?.vehicle_search_term || undefined,
        };
        
        const params_vehicles = {
            organization_id: data?.organization_id || undefined,
            limit: Number.MAX_SAFE_INTEGER, 
            status: "1,0",
            vehicle_id: data?.vehicle_id?.join(",") || undefined,
        }
        
        const params_tagging = {
            urn: `v0:cgv:vehicle:${data?.organization_id}:*`,
            perPage: 1000,
        }
        const params_commands = {
            organization_id: params_km_report.organization_id,
            limit: MAX_LIMIT_FOR_SELECTORS,
        }

        const URL_VEHICLES = "/vehicle/v1";
        const URL_COMMANDS = "/command/v1";
        const URL_TAGGING = "/vehicle/v1/tagging";

        const [
            {
                routes = [], 
                summary = {}, 
                total = 0
            },
            {
                data: { vehicles = [] },
            },
            {
                data: { taggings = [] },
            },
            {
                data: { commands = [] },
            },
            { 
                report_routes_kms = []
            }
        ] = await Promise.all([
            getOldApiKmReports({ params: params_km_report }),
            api.get(URL_VEHICLES, { params: params_vehicles }),
            api.get(URL_TAGGING, { params: params_tagging }),
            api.get(URL_COMMANDS, { params: params_commands }),
            getNewApiKmReports({ data })
        ]);
        
        const has_routes = Array.isArray(routes) && routes.length > 0;
        const has_routes_new_api = Array.isArray(report_routes_kms) && report_routes_kms.length > 0;
        
        if(has_routes == false && has_routes_new_api === false) {
            dispatch(kmReportsLoadSuccess({routes: null, summary: {cost: 0, distance: 0}, total: 0}));
            dispatch(kmReportsChangeOperationStates({ loadSuccess: true }));
            return;
        }

        const odometerPerVehicle = Object.values(commands).reduce((commandsByVehicle, command = {}) => {
            const {
                vehicle_id: vehicleId,
                status,
                type_command_name,
                created,
            } = command;

            const isOdometer = type_command_name === 'odometro'

            const commandIsExecuted = status === 3;

            const isBetweenKmReportInterval = isWithinInterval(new Date(created), {
                start: new Date(params_km_report.start_date),
                end: new Date(params_km_report.end_date),
            })

            const ignoreCommand = !isOdometer || !isBetweenKmReportInterval || !commandIsExecuted || !vehicleId;

            if (ignoreCommand) return commandsByVehicle;


            if (!Array.isArray(commandsByVehicle[vehicleId])) commandsByVehicle[vehicleId] = [];

            commandsByVehicle[vehicleId].push(command);

            return commandsByVehicle;
        }, {})

        const { lastPoints = [] } = await getLastPoints({
            limit: false,
            getStoppedDays: false,
        });

        const statusByVehicleId = lastPoints.reduce((acc,elem) => {
            acc[elem.vehicle.id] = elem.status
            return acc;
        },{});

        const vehicles_idx = vehicles.reduce((acc,elem) => {
            acc[elem.id] = {...elem}
            return acc;
        },{});

        const groupByVehicleId = taggings.reduce((acc, group) => {
            const groupVehicleId = group.urn.split(":").pop();

            const vehicleGroup = Object.assign([], acc[groupVehicleId])

            acc[groupVehicleId] = vehicleGroup
                .concat(group.tagName)
                .filter(Boolean)

            return acc;
        }, {});

        if(has_routes == false) {
            
            const {
                all_summary,
                routes
            } = report_routes_kms.reduce((acc, current_report) => {

                const has_report = Array.isArray(current_report.reports_routes_km) && current_report.reports_routes_km.length > 0;

                if(has_report === false) return acc;

                acc.all_summary.cost += current_report.km_summary.cost
                acc.all_summary.distance += current_report.km_summary.distance

                const [report={}] = current_report.reports_routes_km;

				const {
					[report.vehicleId]: status_id
				} = statusByVehicleId || {};

                acc.routes.push({...report, status_id});


                return acc;

            },{
                all_summary: {cost: 0, distance: 0},
                routes: []
            })

            dispatch(kmReportsLoadSuccess({routes, summary: all_summary, total: routes.length}));
            dispatch(kmReportsChangeOperationStates({ loadSuccess: true }));
            return;
        }

        if(has_routes_new_api === false) {
    
            const routes_completed = routes.reduce((acc, current_route) => {
    
                const vehicleId = current_route?.vehicle_id;
    
                const {
                    [vehicleId]: vehicle = {}
                } = vehicles_idx || {};

				const {
					[vehicleId]: status_id
				} = statusByVehicleId || {};
    
                const {
                    [vehicleId]: odometerCommandsForVehicle = []
                } = odometerPerVehicle || {};
    
                const had_odometer_command_executed = odometerCommandsForVehicle.length
    
                const {
                    [vehicleId]: vehicleGroups = []
                } = groupByVehicleId || {};
    
                const {
                    plate_number,
                    model: vehicle_model,
                    manufacturer,
                    name: vehicle_name
                } = vehicle;
    
                Object.assign(current_route, {
                    time_raw: current_route.time,
                    time: formatTime({ seconds: current_route.time }),
                    group: Array.from(vehicleGroups || []).join(", "),
                    had_odometer_command_executed,
                    odometers: odometerCommandsForVehicle,
                    plate_number,
                    vehicle_name,
                    vehicle_model,
                    manufacturer,
                    status_id,
                })
    
    
                acc.push(current_route);
    
                return acc;
    
            }, [])
            
            dispatch(kmReportsLoadSuccess({routes: routes_completed, summary, total}));
            dispatch(kmReportsChangeOperationStates({ loadSuccess: true }));

            return;

        }

        const routes_completed = routes.reduce((acc, current_route) => {

            const vehicleId = current_route?.vehicle_id;

            const {
                [vehicleId]: vehicle = {}
            } = vehicles_idx || {};

            const {
                [vehicleId]: status_id
            } = statusByVehicleId || {};

            const {
                [vehicleId]: odometerCommandsForVehicle = []
            } = odometerPerVehicle || {};

            const had_odometer_command_executed = odometerCommandsForVehicle.length


            const {
                [vehicleId]: vehicleGroups = []
            } = groupByVehicleId || {};

            const {
                plate_number,
                model: vehicle_model,
                manufacturer,
                name: vehicle_name,
                status,
            } = vehicle;

            Object.assign(current_route, {
                time_raw: current_route.time,
                time: formatTime({ seconds: current_route.time }),
                group: Array.from(vehicleGroups || []).join(", "),
                had_odometer_command_executed,
                odometers: odometerCommandsForVehicle,
                plate_number,
                vehicle_name,
                vehicle_model,
                manufacturer,
                status,
                status_id
            })

            acc.push(current_route);

            return acc;

        }, [])

        const {
            all_summarys,
            reports_routes_kms_valid,
        } = report_routes_kms
            .reduce((acc, current_route) => {

                const has_km_data = Array.isArray(current_route.reports_routes_km) && current_route.reports_routes_km.length > 0;

                if(has_km_data === false) return acc;

                acc.all_summarys.cost += current_route.km_summary.cost;
                acc.all_summarys.distance += current_route.km_summary.distance;
                const [report={}] = current_route.reports_routes_km;
                acc.reports_routes_kms_valid.push(report);

                return acc;

            }, {
                all_summarys: {cost: 0, distance: 0},
                reports_routes_kms_valid: [],
        });
        
        const {
            routes_km_merged
        } = mergeDataReportsKms({
                routes_completed,
                reports_routes_kms_valid
        });
        
        const routes_completed_sorted_by_distance = routes_km_merged.sort((a, b) => b.distance - a.distance)

        const summary_new_api_old = {
            cost: Math.round(all_summarys?.cost || 0) + Math.round(summary?.cost || 0),
            distance: routes_km_merged.reduce((acc, report) => acc += report.distance, 0)
        }
        
        dispatch(kmReportsLoadSuccess({routes: routes_completed_sorted_by_distance, summary: summary_new_api_old, total}));

        dispatch(kmReportsChangeOperationStates({ loadSuccess: true }));
    } catch (error) {
        console.log("error loading:", error);
        dispatch(kmReportsChangeOperationStates({ loadFail: true }));
    }
};
