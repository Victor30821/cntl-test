export const formatTime = ({ seconds }) => {
    const has_seconds = seconds > 0;

    if(has_seconds === false) return "00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);

    const has_hours = hours > 0;
    const has_minutes = minutes > 0;

    const hours_display = has_hours ? `${String(hours).padStart(2, "0")} h ` : has_minutes ? "00 h " : "00:";
    const minutes_display = has_minutes ? ` ${String(minutes).padStart(2, "0")} min` : has_hours ? " 00 min" : "00";

    return `${hours_display}${minutes_display}`;
}