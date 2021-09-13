import { api, apiRoutes } from '../../services/api';
import { formatTimeToCard } from 'helpers/ReportCardsCalc';
import { localizedStrings } from 'constants/localizedStrings';
import { convert } from 'helpers/IntlService';
import { format, parseISO } from 'date-fns';
import { canUseNewApiByContract } from 'utils/contractUseNewApi';
import { validateDateNewApi } from 'utils/validateDateNewApi';
const reportTranslateStrings = localizedStrings.reportsExport;

export default function ExportXLSX ({
    organizationId,
    setStatusSuccessXLSX,
    setDocXlsx,
    filters,
    distance_unit,
}) {

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
                return {
                    routes,
                    total
                }
            }
        } catch (error) {
            console.log(error)
            return {
                routes: [],
                total: 0
            }
        }
    }

    const loadNewApiReport = async () => {
        try {
    
            const URL_ROUTES = '/api/v1/driver-by-day';
    
            const {
                organization_id = 0
            } = filters;
    
            const {
                is_authorized
            } = canUseNewApiByContract({organization_id});
    
            if(is_authorized === false) return {
                driver_by_day: [],
            }

            const {
                driver_id,
                inicial_night_period = "22:00",
                end_night_period = "06:00"
            } = filters;
    
            const start_date_new_api = filters.period.start_date + ' 03:00:00';
            const end_date_new_api = filters.period.end_date + ' 23:59:59';

            const {
                start_date,
                end_date
            } = validateDateNewApi({
                start_date: start_date_new_api,
                end_date: end_date_new_api
            })
    
            const {
                data:{
                    driver_by_day,
                }
            } = await apiRoutes.get(URL_ROUTES, { params: { 
                    start_date,
                    end_date,
                    driver_id,
                    inicial_night_period,
                    end_night_period
            }});
    
            return {
                driver_by_day,
            }
            
        } catch (error) {
            return {
                driver_by_day: [],
            }
        }
    }

    const driversPerDayReportsLoadSuccess = ({ driversPerDay, driver_by_day }) => {

        const remove_idx_days_new_api = driver_by_day.map(route => route.day);

        const driver_per_day_idx_by_date = driversPerDay.reduce((acc, current_route) => {

            const idx = format(parseISO(current_route.start_date), 'yyyy-MM-dd');

            const has_idx = !!acc[idx];
            const idx_equals_days_new_api = remove_idx_days_new_api.includes(idx);

            if(idx_equals_days_new_api) return acc;

            if(has_idx === false) acc[idx] = [];

            const route_modified = {
                km_of_day: 0,
                total_conduction_time: 0,
                greater_continuous_driving: 0,
                total_night_hours: 0,
            };

            route_modified.km_of_day = current_route.total_distance;
            route_modified.total_conduction_time = current_route.total_time;
            route_modified.greater_continuous_driving = current_route.longest_driving_route_time;
            route_modified.total_night_hours = current_route.total_night_hours;

            acc[idx].push(route_modified);

            return acc;

        }, {});
        
        const driver_per_day_compiled = Object.keys(driver_per_day_idx_by_date).map(date => {

            const {
                km_of_day,
                total_conduction_time,
                greater_continuous_driving,
                total_night_hours
            } = driver_per_day_idx_by_date[date].reduce((acc, routes) => {

                acc.km_of_day += routes.km_of_day;
                acc.total_conduction_time += routes.total_conduction_time;
                acc.total_night_hours += routes.total_night_hours;

                const has_greater_continuous_driving = acc.greater_continuous_driving < routes.greater_continuous_driving;

                if(has_greater_continuous_driving) {
                   acc.greater_continuous_driving = routes.greater_continuous_driving;
                }

                return acc;

            }, {
                km_of_day: 0,
                total_conduction_time: 0,
                greater_continuous_driving: 0,
                total_night_hours: 0,
            });

            const totalTime = formatTimeToCard(total_conduction_time, 'obj');
            const drivingTime = formatTimeToCard(greater_continuous_driving, 'obj');

            const day = date;
            const total_conduction_time_formated = `${totalTime.h}:${totalTime.i}:${totalTime.s}`;
            const greater_continuous_driving_formated = typeof drivingTime === 'object' ? `${drivingTime.h}:${drivingTime.i}:${drivingTime.s}`: drivingTime;
            const km_of_day_formated = convert(km_of_day, "m", "km").toFixed();

            return {
                [reportTranslateStrings.day]: day,
                [reportTranslateStrings.drivingTime]: total_conduction_time_formated,
                [reportTranslateStrings.longestCondutionTime]: greater_continuous_driving_formated,
                [reportTranslateStrings.km_of_day]: Number(km_of_day_formated)
            }
        })

        const new_driver_by_day_formated = driver_by_day.map(route => {

            const totalTime = formatTimeToCard(route.total_conduction_time, 'obj');
            const drivingTime = formatTimeToCard(route.greater_continuous_driving, 'obj');

            const total_conduction_time_formated = `${totalTime.h}:${totalTime.i}:${totalTime.s}`;
            const greater_continuous_driving_formated = typeof drivingTime === 'object' ? `${drivingTime.h}:${drivingTime.i}:${drivingTime.s}`: drivingTime;
            const km_of_day_formated = convert(route.km_of_day, "m", "km").toFixed();

            return {
                [reportTranslateStrings.day]: route.day,
                [reportTranslateStrings.drivingTime]: total_conduction_time_formated,
                [reportTranslateStrings.longestCondutionTime]: greater_continuous_driving_formated,
                [reportTranslateStrings.km_of_day]: Number(km_of_day_formated),
            }
        })
        
        const report_lines_and_columns = [...driver_per_day_compiled, ...new_driver_by_day_formated].sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime());

        return {
            report_lines_and_columns
        }
    }

    const lastProcess = async ({ routes = [], driver_by_day = [] }) => {
        const {
            report_lines_and_columns
        } = driversPerDayReportsLoadSuccess({ driversPerDay: routes, driver_by_day });
        setStatusSuccessXLSX({ success: true });
        setDocXlsx(report_lines_and_columns)
    };

    const init = async () => {
        const [
            {
                routes
            },
            {
                driver_by_day
            }
        ] = await Promise.all([
            loadReports(),
            loadNewApiReport(),
        ])
        await lastProcess({
            routes,
            driver_by_day
        });
    };

    init();
}
