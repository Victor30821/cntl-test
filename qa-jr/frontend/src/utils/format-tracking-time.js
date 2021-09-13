export function formatTrackingDate({ timestamp, time, type }) {
    const [full_year,] = timestamp.split("T");
    const fixed_date = `${full_year}T${time}:00.000Z`;
    if(type === "end") {
        const one_day = 1;
        const day_plus_one = new Date(fixed_date);
        day_plus_one.setDate(day_plus_one.getDate() + one_day);
        return day_plus_one.toISOString();
    }
    return fixed_date;
}