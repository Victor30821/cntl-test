import { totalNightSeconds } from 'utils/total-night-seconds';

export const formatRoutes = ({
    routes,
    inicial_night_period,
    end_night_period,
    driver_compiled_per_period,
    drivers
}) => {

    const driver_idx_driver_id = drivers.reduce((acc, current_driver) => {

        const has_idx = !!acc[current_driver.id];

        if(has_idx === false) acc[current_driver.id] = current_driver;

        return acc;

    },{});

    const drivers_routes_formated = Object
            .keys(routes)
            .reduce((acc, current_driver_id) => {

                const report_routes_drivers = routes[current_driver_id];

                const has_report_routes_drivers = 
                    Array.isArray(report_routes_drivers) &&
                    report_routes_drivers.length > 0;

                if(has_report_routes_drivers === false) return acc;

                const {
                    total_conduction_hours,
                    total_distance,
                    total_night_hours,
                    greater_continuous_driving_hour,
                } = report_routes_drivers.reduce((summary, current_report) => {

                    const start_date_route = current_report.start_date;
                    const end_date_route = current_report.end_date;

                    current_report.total_night_hours = totalNightSeconds({
						inicial_night_period,
						end_night_period,
						start_date_route,
						end_date_route,
                    });

                    summary.total_conduction_hours += current_report.total_time;
                    summary.total_distance += current_report.total_distance;
                    summary.total_night_hours = current_report.total_night_hours;

                    const has_exceed_limit = summary.greater_continuous_driving_hour < current_report.longest_driving_route_time;

                    if (has_exceed_limit) summary.greater_continuous_driving_hour = current_report.longest_driving_route_time;

                    return summary;

                },{
                    total_conduction_hours: 0,
                    total_distance: 0,
                    total_night_hours: 0,
                    greater_continuous_driving_hour: 0,
                });

                const driver = driver_idx_driver_id[current_driver_id];

                const {
                    code = "",
                    driver_license = "",
                    expire_driver_license = "",
                    phone = "",
                    name: driver_name = "",
                } = driver;

                const report_driver_compiled = {
                    total_conduction_hours,
                    total_distance,
                    total_night_hours,
                    greater_continuous_driving_hour,
                    driver_name,
                    driver_code: code,
                    driver_cnh: driver_license,
                    driver_cnh_expiration: expire_driver_license,
                    driver_phone: phone,
                    driver_id: +current_driver_id,
                };

                acc.push(report_driver_compiled);

                return acc;

            }, []);

            const driver_routes_compiled = drivers_routes_formated.reduce((acc, current_report) => {

                const driver_compiled = driver_compiled_per_period.filter(driver_route => driver_route.driver_id === current_report.driver_id);

                const has_found_driver_compiled = Array.isArray(driver_compiled) && driver_compiled.length > 0;

                if(has_found_driver_compiled) {

                    const [route_compiled] = driver_compiled;

                    const {
                        driver_name,
                        driver_code,
                        driver_cnh,
                        driver_cnh_expiration,
                        driver_phone,
                        driver_id,
                    } = route_compiled;

                    const new_report = {
                        total_conduction_hours: 0,
                        total_distance: 0,
                        total_night_hours: 0,
                        greater_continuous_driving_hour: 0,
                        driver_name,
                        driver_code,
                        driver_cnh,
                        driver_cnh_expiration,
                        driver_phone,
                        driver_id,
                    };

                    new_report.total_conduction_hours = current_report.total_conduction_hours + route_compiled.total_conduction_hours;
                    new_report.total_distance = current_report.total_distance + route_compiled.total_distance;
                    new_report.total_night_hours = current_report.total_night_hours + route_compiled.total_night_hours;

                    const is_greater_than_other_value = current_report.greater_continuous_driving_hour > route_compiled.greater_continuous_driving_hour;

                    new_report.greater_continuous_driving_hour = route_compiled.greater_continuous_driving_hour;
                    if(is_greater_than_other_value) new_report.greater_continuous_driving_hour = current_report.greater_continuous_driving_hour;

                    acc.push(new_report);

                    return acc;
                }

                acc.push(current_report);

                return acc;

            }, []);

            const driver_ids_to_remove = driver_compiled_per_period.map(route => route.driver_id);

            const driver_compiled_per_period_filtered = driver_routes_compiled.filter(route_driver => !driver_ids_to_remove.includes(route_driver.driver_id));
            
            const routes_formated = [...driver_compiled_per_period_filtered, ... driver_compiled_per_period].filter(route => route.greater_continuous_driving_hour > 0)
            
            return {
                routes_formated
            }
}