import { localizedStrings } from 'constants/localizedStrings';
import { formatTimeToCard } from 'helpers/ReportCardsCalc';
import { convert } from 'helpers/IntlService';
import { api, apiRoutes } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { API_URL, API_URL_PROXY, API_URL_MAP, API_KEY_MAP_GEOCODE, REPORTS_LIMIT_PER_REQUEST, DEFAULT_NULL_VALUE } from 'constants/environment';
import worker_script from 'utils/workerGetAddress';
import loadVehiclesWithGroupsReports from 'utils/requests/vehicles/getVehiclesWithGroupsReports';
import { canUseNewApi } from 'utils/contractUseNewApi';
import { removeOldApiReportsUntil } from 'utils/removeOldApiReportsUnti';
import { validateDateNewApi } from 'utils/validateDateNewApi';
const reportTranslateStrings = localizedStrings.reportsExport;

export default function ExportXLSX ({
    organizationId,
    user_settings,
    setStatusSuccessXLSX,
    setDocXlsx,
    filters
}) {

    const getRegistersByOffSet = ({registers}) => {
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

    const getAddress = ({listAddress}) => {
        return new Promise((resolve, reject) => {
            if(listAddress.length > 0) {
                const worker = new Worker(worker_script);
                worker.postMessage({ listAddress, urls: { API_URL, API_URL_MAP, API_URL_PROXY }, token: "", maps_key: API_KEY_MAP_GEOCODE });
                worker.addEventListener('message', (e) => {
                    try {
                        const response = e.data;
                        const data = {};
                        for(let i = 1; i < response?.length; i++) {
                            const [address] = response?.[i] || [{}];
                            const key = (address?.latitude && address?.longitude && `${address?.latitude.toFixed(3)},${address?.longitude.toFixed(3)}`) || false;
                            if(!key) continue;
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
    
    const reportRoutesNewApi = async ({
        vehicles,
        is_authorized
    }) => {
        try {

            if(is_authorized === false) return {
                new_report_routes: []
            }

            const [vehicle={}] = vehicles;

            const {
                serial_number: imei
            } = vehicle;

            const {
                start_date,
                end_date
            } = validateDateNewApi({
                start_date: `${filters.start_date}T03:00:00`,
                end_date: `${filters.end_date}T23:59:59`
            })

            const params = {
                vehicle_id: filters.vehicle_id,
                imei,
                start_date,
                end_date,
                limit: filters.total,
                offset: 0,
                includes_trackings: false,
                real_time_trackings: false
            };

            const URL_ROUTE = '/api/v1/routes-reports'
            
            const {
                data: {
                    report_routes,
                }
            } = await apiRoutes.get(URL_ROUTE, { params });

            const has_report_routes = Array.isArray(report_routes) && report_routes.length > 0;

            if(has_report_routes === false) return {
                new_report_routes: []
            }

            const {
                listAddresses = [],
            } = getRegistersByOffSet({ registers: report_routes });

            const address = await getAddress({ listAddress: listAddresses });

            const new_report_routes = report_routes.reduce((acc, route) => {

                const keyAcessAdressStart = `${route?.start_lat?.toFixed(3)},${route?.start_lng?.toFixed(3)}`;
                const keyAcessAdressEnd = `${route?.end_lat?.toFixed(3)},${route?.end_lng?.toFixed(3)}`;
                const address_start = address?.[keyAcessAdressStart]?.formattedAddress || localizedStrings.addressRouteNotFound;
                const address_end = address?.[keyAcessAdressEnd]?.formattedAddress|| localizedStrings.addressRouteNotFound;

                acc.push({
                    ...route,
                    address_start,
                    address_end,
                })
                
                return acc;

            }, []);

            return {
                new_report_routes,
            }
            
        } catch (error) {
            return {
                new_report_routes: []
            }
        }
    }

    const loadReports = async () => {
        try {
            const URL = "/routes/v1/?";

            const vehicle = await loadVehiclesWithGroupsReports({
                organizationId: organizationId,
                vehiclesIds: [filters?.vehicle_id],
            });

            const hasPeriod = !!filters.start_date && !!filters.end_date
            if (hasPeriod) {
                const params = {
                    vehicle_id: filters.vehicle_id,
                    organization_id: organizationId || '',
                    start_date: new Date(`${filters.start_date} 00:00:00`).toISOString(),
                    end_date: new Date(`${filters.end_date} 23:59:59`).toISOString(),
                    limit: 1,
                    offset: 0,
                    type: filters.type
                };

                !filters?.type && delete params.type;

                const { data: { total } } = await api.get(URL, { params });

                const routes = [];
                // example: user requests 12000
                // limit per request is 10000
                // we must send 2 requests ( 10000 / 12000 = 1,2 => rouding to 2)
                // for each request we limit to 6000, when the 2 requests resolves, we should have 12000 as the user requested
                const numberOfRequests = Math.ceil(total / REPORTS_LIMIT_PER_REQUEST);
                params.limit = Math.ceil(total / numberOfRequests);

                for (let offset = 0; offset < numberOfRequests; offset++) {
                    params.offset = offset;
                    const { data: { routes: routesArray = [] } } = await api.get(URL, { params });
                    routes.push(...routesArray);
                }

                const [one_vehicle={}] = vehicle;

                const {
                    is_authorized
                } = canUseNewApi({ organization_id: +organizationId, last_points: [{vehicle: one_vehicle}], vehicle_id: filters.vehicle_id });

                const { 
                    new_report_routes = []
                } = await reportRoutesNewApi({
                    vehicles: vehicle,
                    is_authorized
                });

                const has_routes = Array.isArray(routes) && routes?.length > 0;
                const has_new_report_routes = Array.isArray(new_report_routes) && new_report_routes?.length > 0;

                if(has_routes === false && has_new_report_routes === false) return {
                    vehicle: [],
                    routes: [],
                    total: 0,
                }

                const {
                    routes_period_removed = []
                } = removeOldApiReportsUntil({
                    routes,
                    is_authorized
                })

                const has_routes_removed = routes_period_removed?.length > 0;
                
                if(has_routes && has_routes_removed) {

                    const {
                        listAddresses = [],
                    } = getRegistersByOffSet({ registers: routes_period_removed });

                    const address = await getAddress({ listAddress: listAddresses });

                    routes_period_removed.forEach(route => {
                        const keyAcessAdressStart = `${route?.start_lat?.toFixed(3)},${route?.start_lng?.toFixed(3)}`;
                        const keyAcessAdressEnd = `${route?.end_lat?.toFixed(3)},${route?.end_lng?.toFixed(3)}`;
                        const address_start = address?.[keyAcessAdressStart]?.formattedAddress || localizedStrings.addressRouteNotFound;
                        const address_end = address?.[keyAcessAdressEnd]?.formattedAddress|| localizedStrings.addressRouteNotFound;
                        route.address_start = address_start;
                        route.address_end = address_end;
                    });

                }

                const all_routes = [...routes_period_removed, ...new_report_routes].sort((a,b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
                
                return {
                    vehicle,
                    routes: all_routes,
                    total
                }
            }
        } catch (error) {
            console.log(error)
             return {
                vehicle: [],
                routes: [],
                total:0
            }
        }
    }

    const lastProcess = async ({routes, vehicle}) => {
        const distance_unit = user_settings.distance_unit
        
        const parseValues = (reg) => {
            const time = formatTimeToCard(reg.time, 'obj');
            const vehicleInfo = vehicle?.find(vehicleObj => vehicleObj?.vehicle_id === reg?.vehicle_id) || {};
            return {
                [reportTranslateStrings.vehicle]: vehicleInfo?.vehicle_name || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.plate_number]: vehicleInfo?.plate_number || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicle_groups]: vehicleInfo?.vehicle_groups || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.year_manufacturer]: vehicleInfo?.year_manufacturer || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicle_type]: vehicleInfo?.vehicle_type || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicle_model]: vehicleInfo?.vehicle_model || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.date]: reg?.start_date && format(parseISO(reg.start_date), "dd/MM/yyyy"),
                [reportTranslateStrings.start]: (reg?.start_date && format(parseISO(reg.start_date), "HH:mm")) || '00:00',
                [reportTranslateStrings.end]: (reg?.end_date && format(parseISO(reg.end_date), "HH:mm")) || '00:00',
                [reportTranslateStrings.time]: time?.h === undefined ? "00:00" : time.h + ":" + time.i,
                [`${reportTranslateStrings.total_distance} - ${distance_unit}`]: Number(convert(reg.distance, "m", distance_unit).toFixed(0)),
                [reportTranslateStrings.cost]: Number(reg.cost),
                [`${reportTranslateStrings.avg_speed} - ${distance_unit}/h`]: Number((reg.average_speed).toFixed(0)),
                [`${reportTranslateStrings.max_speed} - ${distance_unit}/h`]: Number((reg.max_speed).toFixed(0)),
                [reportTranslateStrings.start_address]: reg?.address_start,
                [reportTranslateStrings.end_address]: reg?.address_end,
                [reportTranslateStrings.driver]: reg?.driver_name || reportTranslateStrings.driverNotIdentified,
            }
        }

        const newData = [];
        routes.forEach((reg, index) => {
            newData.push({
                ...parseValues(reg),
            });
        });

        const orderedData = newData.sort((a, b) => new Date(b.real_date).getTime() - new Date(a.real_date).getTime());
        
        setStatusSuccessXLSX({success:true});
        setDocXlsx(orderedData)
    };


    const init = async () => {
        const data = await loadReports();
        await lastProcess(data);
    };

    init();
}
