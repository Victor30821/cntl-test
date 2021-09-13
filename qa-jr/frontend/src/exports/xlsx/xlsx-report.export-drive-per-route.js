import { api, apiRoutes } from '../../services/api';
import { formatTimeToCard } from "helpers/ReportCardsCalc";
import { format, parseISO } from "date-fns";
import { localizedStrings } from 'constants/localizedStrings';
import loadVehiclesWithGroupsReports from 'utils/requests/vehicles/getVehiclesWithGroupsReports';
import { DEFAULT_NULL_VALUE } from 'constants/environment';
import { canUseNewApiByContract } from 'utils/contractUseNewApi'
import { validateDateNewApi } from 'utils/validateDateNewApi';
const reportTranslateStrings = localizedStrings.reportsExport;

export default function ExportXLSX ({
    organizationId,
    setStatusSuccessXLSX,
    setDocXlsx,
    filters,
    user_settings
}) {

    const loadNewApiReport = async () => {
        try {
    
            const URL_ROUTES = '/api/v1/driver-per-route';
    
            const {
                organization_id = 0
            } = filters;
    
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
                start_date: `${filters?.period?.start_date} 03:00:00`,
                end_date: `${filters?.period?.end_date} 23:59:59`,
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
                    driver_id: filters.driver_id,
                    inicial_night_period: filters.inicial_night_period,
                    end_night_period: filters.end_night_period
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

    const loadReports = async () => {
        try {
            const URL = "/routes/v1/drivers";
            const hasPeriod = !!filters.period.start_date && !!filters.period.end_date
            if (hasPeriod) {
                const params = {
                    driver_id: filters.driver_id,
                    organization_id: organizationId || '',
                    start_date: filters.period.start_date || '',
                    end_date: filters.period.end_date || '',
                    limit: '-1',
                    offset: 0
                };

                const { data: { routes, total } } = await api.get(URL, { params });

                const vehicles = await loadVehiclesWithGroupsReports({
                    organizationId: params?.organization_id
                });

                return {
                    routes,
                    total,
                    vehicles
                }
            }
        } catch (error) {
            console.log(error)
            return {
                routes: [],
                total: 0,
                vehicles: []
            }
        }
    }

    const orderByDesc = (a ,b) => new Date(b.start).getTime() - new Date(a.start).getTime()

    const driversPerDayReportsLoadSuccess = ({ driversPerRoute, vehicles, driver_per_route }) => {

        const {
            distance_unit,
        } = user_settings;

        const days_to_remove = driver_per_route.map(route => {
            const [date,] = route.init.split(" ");
            return date;
        })

        const drivers_routes_formated_removed = driversPerRoute.reduce((acc, reports) => {

            const date = format(new Date(reports.start_date), "yyyy-MM-dd");

            const has_day_on_new_api = days_to_remove.includes(date);

            if(has_day_on_new_api) return acc;

            acc.push(reports);

            return acc;

        }, []);

        const drivers_routes_formated = drivers_routes_formated_removed
            .sort(orderByDesc)
            .map(reg => {

                const { h: hours = "00", i: minutes = "00" } = formatTimeToCard(reg.total_time,"obj");
                                
                const time = `${hours}:${minutes}`;

                const vehicle = vehicles.find(vehicle => vehicle?.vehicle_id === reg?.vehicle_id);

                return {
                    [reportTranslateStrings.start]: format(parseISO(reg.start_date), "HH:mm"),
                    [reportTranslateStrings.end]: format(parseISO(reg.end_date), "HH:mm"),
                    [reportTranslateStrings.time]: time,
                    [`${reportTranslateStrings.avg_speed} - ${distance_unit}/h`]: Number(reg.average_speed.toFixed(0)),
                    [`${reportTranslateStrings.max_speed} - ${distance_unit}/h`]: Number(reg.max_speed.toFixed(0)),
                    [`${reportTranslateStrings.total_distance} - ${distance_unit}`]: Number(reg.total_distance.toFixed(0)),
                    [reportTranslateStrings.vehicle]: reg.vehicle_name || DEFAULT_NULL_VALUE,
                    [reportTranslateStrings.vehicle_model]: vehicle?.vehicle_model || DEFAULT_NULL_VALUE,
                    [reportTranslateStrings.groups]: vehicle?.vehicle_groups || DEFAULT_NULL_VALUE,
                    [reportTranslateStrings.year_manufacturer]: vehicle?.year_manufacturer || DEFAULT_NULL_VALUE,
                    [reportTranslateStrings.vehicle_plate]: vehicle?.plate_number || DEFAULT_NULL_VALUE,
                    [reportTranslateStrings.vehicleType]: vehicle?.vehicle_type || DEFAULT_NULL_VALUE,
                };
        });

        const driver_per_route_formated = driver_per_route
        .sort(orderByDesc)
        .map(route => {

            const { h: hours = "00", i: minutes = "00" } = formatTimeToCard(route.total_time,"obj");

            const time = `${hours}:${minutes}`;

            return {
                [reportTranslateStrings.start]: format(parseISO(route?.init), "HH:mm"),
                [reportTranslateStrings.end]: format(parseISO(route?.end), "HH:mm"),
                [reportTranslateStrings.time]: time,
                [`${reportTranslateStrings.avg_speed} - ${distance_unit}/h`]: Number(route?.average_speed.toFixed(0)),
                [`${reportTranslateStrings.max_speed} - ${distance_unit}/h`]: Number(route?.max_speed.toFixed(0)),
                [`${reportTranslateStrings.total_distance} - ${distance_unit}`]: Number(route?.total_distance.toFixed(0)),
                [reportTranslateStrings.vehicle]: route?.vehicle_name || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicle_model]: route?.vehicle_model || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.groups]: route?.vehicle_groups || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.year_manufacturer]: route?.year_manufacturer || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicle_plate]: route?.plate_number || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicleType]: route?.type_vehicle_name || DEFAULT_NULL_VALUE,
            }
        });

        const routes_merged = [...drivers_routes_formated, ...driver_per_route_formated];
        
        return routes_merged;

    }

    const lastProcess = async ({ routes = [], vehicles = [], driver_per_route = [] }) => {
        const data = driversPerDayReportsLoadSuccess({ driversPerRoute: routes, vehicles, driver_per_route });
        setStatusSuccessXLSX({ success: true });
        setDocXlsx(data)
    };


    const init = async () => {

        const [
            {
                routes,
                vehicles,
            },
            {   
                driver_per_route
            }
        ] = await Promise.all([
            loadReports(),
            loadNewApiReport(),
        ]);
        await lastProcess({
            routes,
            vehicles,
            driver_per_route,
        });
    };

    init();
}
