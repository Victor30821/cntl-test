import { api, apiRoutes, mapApi } from '../../services/api';
import { convert } from 'helpers/IntlService';
import { formatTimeToCard } from "helpers/ReportCardsCalc";
import { localizedStrings } from "constants/localizedStrings";
import { DEFAULT_NULL_VALUE, MAX_LIMIT_FOR_SELECTORS } from 'constants/environment';
import { isAfter, isWithinInterval, format } from 'date-fns';
import { toast } from 'react-toastify';
import { getUrlParam } from 'utils/params';
import { VirtualizedTableItems } from 'components';
import { canUseNewApi, canUseNewApiByContract } from 'utils/contractUseNewApi'
import { formatTime } from 'utils/formatTime';
import { removeReportsFromKM } from 'utils/removeReportsFromKM';
import { validateDateNewApi } from 'utils/validateDateNewApi';

export default async function ExportXLSX ({
    setStatusSuccessXLSX,
    setDocXlsx,
    selectedDate,
    selectedTime,
    organizationId,
    vehicle,
    groups,
    distance_unit,
    thousand_separator,
    decimal_separator,
    currency,
    vehicle_type_id,
    vehicle_group_name,
    vehicle_model_search_term,
    vehicle_year_manufacturer,
    vehicle_fuel_type_id
}) {
    const reportTranslateStrings = localizedStrings.reportsExport;


    const {
        searchedGroup,
    } = groups;

    const {
        vehicles = [],
    } = vehicle;

    const vehicles_idx = Array.from(vehicles).reduce((acc, elem) => {
        acc[elem.id] = { ...elem }
        return acc;
    }, {});

    const vehicles_filter = Object.keys(vehicles_idx)

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
                .reduce((acc, current_last_point) => {
    
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
        data
    }) => {
        try {
    
            const {
                vehicles_with_imei = []
            } = await getVehicleIdAndImeis()
            
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
                } = canUseNewApi({ organization_id: +organizationId, last_points: [{vehicle}], vehicle_id });
    
                if(is_authorized === false) return acc;
    
                acc.push(vehicle)
    
                return acc;
    
            }, []);
            
            const has_vehicles_with_imei_authorized = Array.isArray(vehicles_with_imei_authorized) && vehicles_with_imei_authorized.length > 0;

            if(has_vehicles_with_imei_authorized === false) return {
                reports_routes_km: [],
            }

            const {
                start_date,
                end_date
            } = getValidDate({
                data
            })
            
            const URL_ROUTE_KM = "/api/v1/report-km";
    
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
                } = await apiRoutes.get(URL_ROUTE_KM, { params });
    
    
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
                        time: report_km.time_raw
                    })
    
                    return acc;
    
                },[])
            
            return {
                report_routes_kms: only_report_routes_kms
            }
            
        } catch (error) {
            console.log(error)
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

    const loadReports = async () => {
        const hasPeriod = !!selectedDate?.startDate && !!selectedDate?.endDate
        if (hasPeriod) {
            
            const URL_COMMANDS = "/command/v1";
            const startDate = new Date(`${selectedDate?.startDate} ${selectedTime.startTime}`).toISOString();
            const endDate = new Date(`${selectedDate?.endDate} ${selectedTime.endTime}`).toISOString();
            
            if (isAfter(startDate, endDate)) {
                return toast.error(localizedStrings.starDateMustBeGreaterThanEndDate);
            }

            const params = {
                organization_id: organizationId || '',
                start_date: startDate,
                end_date: endDate,
                offset: 0,
                group: "vehicle",
                limit: '-1',
                vehicle_id: String(vehicles_filter),
                vehicle_type_id: vehicle_type_id || undefined,
                vehicle_group_name: vehicle_group_name || undefined,
                vehicle_model_search_term: vehicle_model_search_term || undefined,
                vehicle_year_manufacturer: vehicle_year_manufacturer || undefined,
                vehicle_fuel_type_id: vehicle_fuel_type_id || undefined,
            };
            const params_commands = {
                organization_id: params.organization_id,
                limit: MAX_LIMIT_FOR_SELECTORS,
            }
            const [
                {
                    routes = [],
                },
                {
                    data: { commands = [] },
                },
                { 
                    report_routes_kms = []
                }
            ] = await Promise.all([
                getOldApiKmReports({ params }),
                api.get(URL_COMMANDS, { params: params_commands }),
                getNewApiKmReports({ data: params })
            ]);
            
            const has_routes = Array.isArray(routes) && routes.length > 0;
            const has_report_routes_kms = Array.isArray(report_routes_kms) && report_routes_kms.length > 0;

            if(has_routes === false && has_report_routes_kms === false) return {
                reports: [],
                commandsPerVehicle: []
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
                    start: new Date(params.start_date),
                    end: new Date(params.end_date),
                })

                const ignoreCommand = !isOdometer || !isBetweenKmReportInterval || !commandIsExecuted || !vehicleId;

                if (ignoreCommand) return commandsByVehicle;


                if (!Array.isArray(commandsByVehicle[vehicleId])) commandsByVehicle[vehicleId] = [];

                commandsByVehicle[vehicleId].push(command);

                return commandsByVehicle;
            }, {})

            if(has_routes && has_report_routes_kms === false) return {
                reports: routes,
                commandsPerVehicle: odometerPerVehicle
            }

            if(has_routes === false && has_report_routes_kms) return {
                reports: report_routes_kms,
                commandsPerVehicle: odometerPerVehicle
            }

            const vehicle_ids_to_remove = report_routes_kms.map(routes => routes.vehicle_id);
            const routes_filtered = routes.filter(route => !vehicle_ids_to_remove.includes(route.vehicle_id));

            const all_routes = [...report_routes_kms, ...routes_filtered];
            
            return {
                reports: all_routes,
                commandsPerVehicle: odometerPerVehicle
            }
        }
    }

    const lastProcess = async ({ reports, commandsPerVehicle: odometerPerVehicle }) => {
        const preparedVehicles = vehicles.reduce((acc,elem) => {
            acc[elem.id] = {...elem}
            return acc;
        },{});

        const newData = [];

        reports
            .sort((a,b) => b.diatance - a.distance)
            .forEach(report => {
            const vehicle = preparedVehicles[report.vehicle_id] || { name: DEFAULT_NULL_VALUE, plate_number: DEFAULT_NULL_VALUE };

            const groups = searchedGroup
                .filter(group => {
                    const [, , , , groupVehicleId] = group.urn.split(":");
                    return +report.vehicle_id === +groupVehicleId;
                })
                .map(group => group.tagName)
                .join(", ");
            report.vehicle_name = vehicle?.name;
            report.group = groups || DEFAULT_NULL_VALUE;
            report.plate_number = vehicle?.plate_number;
            report.vehicle_model = vehicle?.model || DEFAULT_NULL_VALUE;
            report.year_manufacturer = vehicle?.year_manufacturer || DEFAULT_NULL_VALUE;
            report.vehicle_type = vehicle?.type_vehicle_name || DEFAULT_NULL_VALUE;

            if (report.distance < 0) report.distance = report.raw_distance;

            newData.push(report);
        });

        const data = newData.map?.((register, index) => {
            try {
                const converted_distance = register && register.distance && convert?.(register?.distance, 'm', distance_unit?.toLowerCase?.());
                const total_km = converted_distance?.toFixed?.(2) || 0;

                const converted_raw_distance = register && register.raw_distance && convert?.(register?.raw_distance, 'm', distance_unit?.toLowerCase?.());
                const total_km_raw = converted_raw_distance?.toFixed?.(2) || 0;

                const {
                    h: hours = "00", i: minutes = "00"
                } = formatTimeToCard?.(register?.time, 'obj');
                const time = `${hours}:${minutes}`;

                const {
                    value: start_odometer_in_user_unit
                } = VirtualizedTableItems.conversionPerType.distance({
                    cellData: register?.start_odometer,
                    user_settings: {
                        distance_unit,
                    }
                })
                const {
                    value: end_odometer_in_user_unit
                } = VirtualizedTableItems.conversionPerType.distance({
                    cellData: register?.end_odometer,
                    user_settings: {
                        distance_unit,
                    }
                })
                const {
                    value: cost_in_user_unit
                } = VirtualizedTableItems.conversionPerType.cost({
                    cellData: register?.cost,
                    user_settings: {
                        thousand_separator,
                        decimal_separator,
                        currency,
                    }
                })
                const {
                    [register.vehicle_id]: odometerCommandsForVehicle = []
                } = odometerPerVehicle || {};

                const had_odometer_command_executed = odometerCommandsForVehicle.length

                const odometerChangeText = {
                    text: DEFAULT_NULL_VALUE
                }
                if (had_odometer_command_executed === 1) odometerChangeText.text = had_odometer_command_executed + " " + localizedStrings.oneTime
                if (had_odometer_command_executed > 1) odometerChangeText.text = had_odometer_command_executed + " " + localizedStrings.times;


                const tableColumns = {
                    [reportTranslateStrings.vehicle]: register?.vehicle_name,
                    [reportTranslateStrings.year_manufacturer ]: register?.year_manufacturer,
                    [reportTranslateStrings.vehicle_type]: register?.vehicle_type,
                    [reportTranslateStrings.vehicle_plate]: register?.plate_number,
                    [reportTranslateStrings.vehicle_model]: register?.vehicle_model,
                    [reportTranslateStrings.group]: register?.group,
                    [reportTranslateStrings.drivingTime]: time,
                    [`${reportTranslateStrings.total_distance}_km`]: Number(total_km),
                    [reportTranslateStrings.cost]: cost_in_user_unit,
                    [`${reportTranslateStrings.start_odometer} - km`]: start_odometer_in_user_unit,
                    [`${reportTranslateStrings.end_odometer} - km`]: end_odometer_in_user_unit,
                    [`${reportTranslateStrings.manufacturer}`]: register?.manufacturer || DEFAULT_NULL_VALUE,
                    [`${localizedStrings.odometerAdjustment}`]: odometerChangeText.text,
                };
                const inTestMode = !!getUrlParam('km')
                if (inTestMode) Object.assign(tableColumns, {
                    [`${reportTranslateStrings.total_distance}_km_teste_interno`]: Number(total_km_raw),
                })

                return tableColumns
            } catch (error) {
                console.log(error)
                return {};
            }
        });

        setStatusSuccessXLSX({success:true});
        setDocXlsx(data);
    };

    const init = async () => {
        const data = await loadReports();
        await lastProcess(data);
    };

    init();
}
