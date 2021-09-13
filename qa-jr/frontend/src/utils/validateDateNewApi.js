import { format } from 'date-fns';

export const validateDateNewApi = ({
    start_date,
    end_date
}) => {

    const format_type = 'yyyy-MM-dd';

    const start_date_formated = `${format(new Date(start_date), format_type)} 03:00:00`;

    const end_date_iso = new Date(end_date).toISOString();

    const [end_date_iso_day, end_wrong_time] = end_date_iso.split("T");
    const [end_time] = end_wrong_time.split(".");

    return {
        start_date: start_date_formated,
        end_date: `${end_date_iso_day} ${end_time}`
    }
}