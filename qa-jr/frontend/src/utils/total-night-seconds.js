import { areIntervalsOverlapping } from "date-fns";
import { overlapInSeconds } from "utils/overlap-in-seconds"
import { formatTrackingDate } from "utils/format-tracking-time"

export function totalNightSeconds({ inicial_night_period = "22:00", end_night_period = "06:00" , start_date_route = "", end_date_route = "" }) {

    const start_time_night = formatTrackingDate({ timestamp: start_date_route, time: inicial_night_period, type: "start" });
    const end_time_night = formatTrackingDate({ timestamp: end_date_route, time: end_night_period, type: "end" });

    const start_date = new Date(start_date_route);
    const end_date = new Date(end_date_route);

    const start_between_date = new Date(start_time_night);
    const end_between_date = new Date(end_time_night);

    const is_between_interval_night = areIntervalsOverlapping(
        { start: start_date, end: end_date },
        { start: start_between_date, end: end_between_date }
    )

    if(is_between_interval_night) {

        const { seconds = 0 } = overlapInSeconds({
					start_date: start_date_route,
					end_date: end_date_route,
					start_between_date: start_time_night,
					end_between_date: end_time_night,
        });
    
        return seconds;
    }

    return 0;

}