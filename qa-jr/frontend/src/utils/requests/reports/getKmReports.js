import { api, apiRoutes, mapApi } from "services/api";
import { formatTime } from 'utils/formatTime';
import { DEFAULT_NULL_VALUE, MAX_LIMIT_FOR_SELECTORS } from "constants/environment"
import populateSelects from "constants/populateSelects"
import { isWithinInterval, format } from "date-fns";
import { localizedStrings } from "constants/localizedStrings";
import { VirtualizedTableItems } from "components";
import { canUseNewApi, canUseNewApiByContract } from 'utils/contractUseNewApi'
import { removeReportsFromKM } from 'utils/removeReportsFromKM'
import { validateDateNewApi } from 'utils/validateDateNewApi';

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
                    serial_number:imei
                } = vehicle;

                acc.push({ ...vehicle, imei });

                return acc;

            }, []);

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
    data,
}) => {
    try {
        
        const {
            vehicles_with_imei = []
        } = await getVehicleIdAndImeis();
        
        const has_vehicles_with_imei = Array.isArray(vehicles_with_imei) && vehicles_with_imei.length > 0;

        if(has_vehicles_with_imei === false) return {
            reports_routes_km: [],
        }

        const vehicles_with_imei_authorized = vehicles_with_imei.reduce((acc, vehicle) => {

            const {
                vehicle_id
            } = vehicle;

            const {
                is_authorized
            } = canUseNewApi({ organization_id: +data?.organization_id, last_points: [{vehicle}], vehicle_id });

            if(is_authorized === false) return acc;
            
            acc.push(vehicle)

            return acc;

        }, []);

        const has_vehicles_with_imei_authorized = Array.isArray(vehicles_with_imei_authorized) && vehicles_with_imei_authorized.length > 0;

        if(has_vehicles_with_imei_authorized === false) return {
            reports_routes_km: [],
        }
        
        const URL_ROUTE_KM = "/api/v1/report-km";

        const promise_new_api = vehicles_with_imei_authorized.map(async (vehicle) => {

            const {
                vehicle_id,
                imei
            } = vehicle;

            const {
                start_date,
                end_date
            } = getValidDate({
                data
            })
            
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
            } = await apiRoutes.get(URL_ROUTE_KM, { params });


            const reports_km = reports_routes_km.map(km => {
                
                return {
                    ...km,
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

        const has_report_routes_kms = Array.isArray(report_routes_kms) && report_routes_kms.length > 0;

        if(has_report_routes_kms === false) return {
            report_routes_kms: [],
        }

        const only_report_routes_kms = report_routes_kms
            .reduce((acc, report) => {

                const has_reports_routes_km = Array.isArray(report?.reports_routes_km) && report?.reports_routes_km?.length > 0;

                if(has_reports_routes_km === false) return acc;

                const [report_km] = report?.reports_routes_km;
                
                acc.push({
                    ...report_km,
                })

                return acc;

            },[])
            
        return {
            report_routes_kms: only_report_routes_kms
        }

        
    } catch (error) {
        return {
            report_routes_kms: []
        }
    }
}

const getOldApiKmReports = async ({
    params
}) =>  {
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
       
        const {
            routes_vehicle_ids_removed
        } = await removeReportsFromKM({
            is_authorized,
            routes,
            summary,
        });
        
        return {
            routes: routes_vehicle_ids_removed
        }
        
    } catch (error) {
        return {
            routes: [],
        }
    }
}

const formatRoutes = ({
    all_routes,
    odometerPerVehicle,
    vehicles_idx,
    groupByVehicleId,
    user_settings,
    distance_unit_accuracy,
    unit
}) => {
    const routes_completed = all_routes.reduce((acc, current_route) => {

        const vehicleId = current_route?.vehicle_id;

        const {
            [vehicleId]: vehicle = {}
        } = vehicles_idx || {};

        const {
            [vehicleId]: odometerCommandsForVehicle = []
        } = odometerPerVehicle || {};

        const had_odometer_command_executed = odometerCommandsForVehicle.length

        const odometerChangeText = {
            text: DEFAULT_NULL_VALUE
        }
        if (had_odometer_command_executed === 1) odometerChangeText.text = had_odometer_command_executed + " " + localizedStrings.oneTime
        if (had_odometer_command_executed > 1) odometerChangeText.text = had_odometer_command_executed + " " + localizedStrings.times;

        const {
            [vehicleId]: vehicleGroups = []
        } = groupByVehicleId || {};

        const {
            plate_number,
            model: vehicle_model,
            manufacturer,
            name: vehicle_name
        } = vehicle;

        const {
            value: start_odometer_in_user_unit
        } = VirtualizedTableItems.conversionPerType.distance({
            cellData: current_route?.start_odometer,
            user_settings
        })
        const {
            value: end_odometer_in_user_unit
        } = VirtualizedTableItems.conversionPerType.distance({
            cellData: current_route?.end_odometer,
            user_settings
        })
        const {
            value: distance_in_user_unit
        } = VirtualizedTableItems.conversionPerType.distance({
            cellData: current_route?.distance,
            user_settings
        })
        const {
            value: cost_in_user_unit
        } = VirtualizedTableItems.conversionPerType.cost({
            cellData: current_route?.cost,
            user_settings
        })

        Object.assign(current_route, {
            time: formatTime({ seconds: current_route.time }),
            group: Array.from(vehicleGroups || []).join(", "),
            had_odometer_command_executed: odometerChangeText.text,
            plate_number,
            vehicle_name,
            vehicle_model,
            manufacturer,
            distance: distance_in_user_unit,
            start_odometer: start_odometer_in_user_unit,
            end_odometer: end_odometer_in_user_unit,
            cost: cost_in_user_unit,
            raw_distance: current_route?.distance
        })

        acc.push(current_route);

        return acc;

    }, [])
    .sort((a,b) => b.raw_distance - a.raw_distance)
    
    return {
        routes_formated: routes_completed
    }
}

const getKmReports = async ({
    filters,
    user_settings = {}
}) => {
	try {
        const distance_unit_accuracy = 0;
        const unit = populateSelects.currency.find(money => money.value === filters?.currency)?.unit;

        const params = {
            organization_id: filters?.organization_id || undefined,
            start_date: filters?.start_date || undefined,
            end_date: filters?.end_date || undefined,
            offset: filters?.offset || undefined,
            group: filters?.group || undefined,
            limit: filters?.limit || undefined,
            vehicle_type_id: filters?.vehicle_type_id || undefined,
            vehicle_group_name: filters?.vehicle_group_name || undefined,
            vehicle_model_search_term: filters?.vehicle_model_search_term || undefined,
            vehicle_year_manufacturer: filters?.vehicle_year_manufacturer || undefined,
            vehicle_fuel_type_id: filters?.vehicle_fuel_type_id || undefined,
            vehicle_id: filters?.vehicle_id || undefined,
            vehicle_search_term: filters?.vehicle_search_term || undefined,
        };

        const params_vehicles = {
            organization_id: params.organization_id || undefined,
            limit: Number.MAX_SAFE_INTEGER,
            status: "1,0",
            vehicle_id: params.vehicle_id?.join?.(",") || undefined,
        }

        const params_tagging = {
            urn: `v0:cgv:vehicle:${params.organization_id}:*`,
            perPage: 1000,
        }
        const params_commands = {
            organization_id: params.organization_id,
            limit: MAX_LIMIT_FOR_SELECTORS,
        }

        const URL_VEHICLES = "/vehicle/v1";
        const URL_COMMANDS = "/command/v1";
        const URL_TAGGING = "/vehicle/v1/tagging";


        const [
            {
                routes = []
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
                report_routes_kms = [],
            }
        ] = await Promise.all([
            getOldApiKmReports({params: params }),
            api.get(URL_VEHICLES, { params: params_vehicles }),
            api.get(URL_TAGGING, { params: params_tagging }),
            api.get(URL_COMMANDS, { params: params_commands }),
            getNewApiKmReports({data: filters})
        ]);
        
        const has_routes = Array.isArray(routes) && routes.length > 0;
        const has_report_routes_kms = Array.isArray(report_routes_kms) && report_routes_kms.length > 0;

        if(has_routes === false && has_report_routes_kms === false) return [];

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
                start: new Date(params.start_date),
                end: new Date(params.end_date),
            })

            const ignoreCommand = !isOdometer || !isBetweenKmReportInterval || !commandIsExecuted || !vehicleId;

            if (ignoreCommand) return commandsByVehicle;


            if (!Array.isArray(commandsByVehicle[vehicleId])) commandsByVehicle[vehicleId] = [];

            commandsByVehicle[vehicleId].push(command);

            return commandsByVehicle;
        }, {})



        const vehicles_idx = vehicles.reduce((acc, elem) => {
            acc[elem.id] = {...elem}
            return acc;
        }, {});

        const groupByVehicleId = taggings.reduce((acc, group) => {
            const groupVehicleId = group.urn.split(":").pop();

            const vehicleGroup = Object.assign([], acc[groupVehicleId])

            acc[groupVehicleId] = vehicleGroup
                .concat(group.tagName)
                .filter(Boolean)

            return acc;
        }, {});

        if(has_routes && has_report_routes_kms === false) {

            const {
                routes_formated
            } = formatRoutes({
                all_routes: routes,
                odometerPerVehicle,
                vehicles_idx,
                groupByVehicleId,
                user_settings,
                distance_unit_accuracy,
                unit
            })

            return routes_formated;

        }

        if(has_routes === false && has_report_routes_kms) {
            
            const {
                routes_formated
            } = formatRoutes({
                all_routes: report_routes_kms,
                odometerPerVehicle,
                vehicles_idx,
                groupByVehicleId,
                user_settings,
                distance_unit_accuracy,
                unit
            })

            return routes_formated;

        }

        const vehicle_ids_to_remove = report_routes_kms.map(routes => routes.vehicle_id);

        const routes_filtered = routes.filter(route => !vehicle_ids_to_remove.includes(route.vehicle_id));

        const all_routes = [...routes_filtered, ...report_routes_kms]

        const {
            routes_formated
        } = formatRoutes({
            all_routes,
            odometerPerVehicle,
            vehicles_idx,
            groupByVehicleId,
            user_settings,
            distance_unit_accuracy,
            unit
        })

        return routes_formated;

    } catch (error) {
        console.log("error loading:", error);
        return [];
    }
};

export default getKmReports;
