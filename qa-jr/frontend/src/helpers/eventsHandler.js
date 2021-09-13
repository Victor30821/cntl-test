import { localizedStrings } from "constants/localizedStrings";
import { format, parseISO } from "date-fns";
import { convertUserMaskToDateFns } from "utils/convert";
import { convert } from "helpers/IntlService";

const ONE_HOUR_IN_MINUTES = 60;
const getEventType = (eventId) => {
    return localizedStrings.typeEvents[eventId]
}

const getEventInfo = (event, user_settings) => {
    const eventName = event.type_event_name;

    const distance = user_settings?.distance_unit?.toLowerCase?.() || "km";

    const velocityPerDistance = distance + "/h";

    const eventsTypes = {
        speed: () => ({
            setting: [event.value_settings, velocityPerDistance].join(" "),
            value: [event.value, velocityPerDistance].join(" "),
        }),
        idle: () => ({
            setting: [parseInt(+event.value_settings / ONE_HOUR_IN_MINUTES), localizedStrings.minutes,].join(" "),
            value: [parseInt(+event.value / ONE_HOUR_IN_MINUTES), localizedStrings.minutes].join(" "),
        }),
        fenceOut: () => {
            const fenceIn = event.value === 'in';

            const message = fenceIn
                ? localizedStrings.eventsParsers.in
                : localizedStrings.eventsParsers.out;

            return {
                setting: localizedStrings.eventsParsers.inOrOut,
                value: message
            }
        },
        fenceIn: () => {
            const fenceIn = event.value === 'in';

            const message = fenceIn
                ? localizedStrings.eventsParsers.in
                : localizedStrings.eventsParsers.out;

            return {
                setting: localizedStrings.eventsParsers.inOrOut,
                value: message
            }
        },
        sensor: () => ({
            setting: "-",
            value: "-",
        }),
        schedule: () => {
            const settings = JSON.parse(event.value_settings || {});

            const cellData = {
                setting: "-",
                value: "-"
            }

            cellData.setting = settings.reduce(
                (value, day) =>
                    value + localizedStrings.getDayAndTimeToReport(day.day, day.initTime.slice(0, 5), day.endTime.slice(0, 5)),
                ""
            );
            const {
                short_date_format,
                short_time_format
            } = user_settings;

            const dateMaskFromConfiguration = convertUserMaskToDateFns({ mask: short_date_format, timeMask: short_time_format });

            const hasValidDate = isNaN(+event.value);

            if (!hasValidDate) return cellData;

            cellData.value = format(
                parseISO(
                    event.value,
                    "yyyy-MM-dd T hh:mm:ss",
                    new Date()
                ),
                dateMaskFromConfiguration
            );
            return cellData
        },
        speedInFence: () => {
            const settings = JSON.parse(event.value_settings || {});

            return {
                setting: [settings?.max_speed, velocityPerDistance, localizedStrings.in, settings?.fence_name,].join(" "),
                value: [event.value, velocityPerDistance].join(" "),
            }
        },
        km: () => ({
            setting: [event.value_settings, distance].join(" "),
            value: [parseInt(convert(event.value, "m", distance)), distance].join(" "),
        }),
        fence: () => {
            const fenceIn = event.value === 'in';

            const message = fenceIn
                ? localizedStrings.eventsParsers.in
                : localizedStrings.eventsParsers.out;

            return {
                setting: localizedStrings.eventsParsers.inOrOut,
                value: [message, event.value_settings].join(" ")
            }
        },
        power: () => {
            const powerOn = event.value === 'on';

            const message = powerOn
                ? localizedStrings.powerReconnected
                : localizedStrings.powerDisconnected;

            return {
                setting: "-",
                value: [
                    message,
                ].join(" ")
            }
        },
        driverNotIdentified: () => ({
            setting: "-",
            value: "-"
        }),
        sensor: () => ({
            setting: [localizedStrings.sensor, event.value].join(" "),
            value: localizedStrings.activated
        })
    }
    const eventHandler = eventsTypes[eventName];

    if (eventHandler) return eventHandler()

}

export {
    getEventInfo,
    getEventType,
}