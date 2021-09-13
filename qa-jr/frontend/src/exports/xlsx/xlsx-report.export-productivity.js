import { api } from '../../services/api';
import { differenceInMilliseconds, format,parseISO } from 'date-fns';
import { formatTimeToCard } from 'helpers/ReportCardsCalc';
import { localizedStrings } from 'constants/localizedStrings';
import loadVehiclesWithGroupsReports from 'utils/requests/vehicles/getVehiclesWithGroupsReports';
import { DEFAULT_NULL_VALUE } from 'constants/environment';
import { utcToZonedTime } from 'date-fns-tz';
const reportTranslateStrings = localizedStrings.reportsExport;

export default function ExportXLSX ({
    organizationId,
    setStatusSuccessXLSX,
    setDocXlsx,
    filters,
	timezone
}) {

    const loadReports = async () => {
        try {
            const URL = "/routes/v1/";
            const hasPeriod = !!filters.period.start_date && !!filters.period.end_date
            if (hasPeriod) {
                const params = {
                    vehicle_id: filters.vehicle_id.join(','),
                    organization_id: organizationId || '',
                    start_date: filters.period.start_date + " 00:00:00",
                    end_date: filters.period.end_date + " 23:59:59",
                    limit: "-1",
                    offset: "0",
                };

                const { data: { routes, total } } = await api.get(URL, { params });

				const productivityReports = routes?.reduce((idx, route, i, route_list) => {
					const productivity_report = {
						day: route.start_date,
						total_stop_time: new Date(),
						start_route_hour: route.start_date,
						time_off: 0,
						driver_name: "",
						vehicle_id: route.vehicle_id
					};

					const previous_route = route_list[i - 1];

					const nightHoursInterval = {
						previousDayEndDate: true,
						thisDayStartDate: true,
					}

					const has_previous_route = previous_route !== undefined;

					if (has_previous_route === false) return idx;

					const previousDayEndDate = utcToZonedTime(new Date(previous_route?.end_date), timezone);
					const thisDayStartDate = utcToZonedTime(new Date(route?.start_date), timezone);

					if (timezone) {
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

					idx.push(productivity_report);

					return idx;
				}, []);

                const vehicles = await loadVehiclesWithGroupsReports({
                    vehiclesIds: filters?.vehicle_id,
                    organizationId: params?.organization_id
                });

                return {
					productivityReports,
                    routes,
                    total,
                    vehicles
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

    const lastProcess = async ({ productivityReports, total, vehicles }) => {

        const productivityReportsLoadSuccess = ({ productivityReports, total, vehicles }) => {
			const productivityRoutes = [];
            productivityReports.forEach((reg, index) => {

				const vehicle = vehicles.find(vehicle => vehicle?.vehicle_id === reg?.vehicle_id);

				const time_off = formatTimeToCard(reg?.time_off, 'obj');

				productivityRoutes.push({
					day: format(parseISO(reg?.day), 'dd/MM/yyyy') || DEFAULT_NULL_VALUE,
					total_stop_time: format(parseISO(reg?.total_stop_time), 'HH:mm') || DEFAULT_NULL_VALUE,
					start_route_hour: format(parseISO(reg?.start_route_hour), 'HH:mm') || DEFAULT_NULL_VALUE,
					time_off: `${time_off.h}:${time_off.i}` || DEFAULT_NULL_VALUE,
					driver_name: reg?.driver_name || localizedStrings.driverNotIdentified,
					vehicle_name: vehicle?.vehicle_name || DEFAULT_NULL_VALUE,
					vehicle_model: vehicle?.vehicle_model || DEFAULT_NULL_VALUE,
					vehicle_groups: vehicle?.vehicle_groups || DEFAULT_NULL_VALUE,
					year_manufacturer: vehicle?.year_manufacturer || DEFAULT_NULL_VALUE,
					plate_number: vehicle?.plate_number || DEFAULT_NULL_VALUE,
					vehicle_type: vehicle?.vehicle_type || DEFAULT_NULL_VALUE,
				});
            });


            return productivityRoutes.map(elem => {
                return {
                    [reportTranslateStrings.day]: elem.day,
                    [reportTranslateStrings.route_start]: elem.start_route_hour,
                    [reportTranslateStrings.route_stop]: elem.total_stop_time,
                    [reportTranslateStrings.time_off]: elem.time_off,
                    [reportTranslateStrings.driver]: elem.driver_name,
                    [reportTranslateStrings.vehicle]: elem?.vehicle_name,
                    [reportTranslateStrings.vehicle_model]: elem?.vehicle_model,
                    [reportTranslateStrings.groups]: elem?.vehicle_groups,
                    [reportTranslateStrings.year_manufacturer]: elem?.year_manufacturer,
                    [reportTranslateStrings.vehicle_plate]: elem?.plate_number,
                    [reportTranslateStrings.vehicleType]: elem?.vehicle_type,
                }
            })
        }
        const data = productivityReportsLoadSuccess({productivityReports, total, vehicles: vehicles});
        setStatusSuccessXLSX({ success: true });
        setDocXlsx(data)
    };


    const init = async () => {
        const data = await loadReports();
        await lastProcess(data);
    };

    init();
}
