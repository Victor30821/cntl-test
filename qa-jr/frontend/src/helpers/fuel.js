import { localizedStrings } from "constants/localizedStrings";

const { format, eachMonthOfInterval } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");

const registerTranslateDefault = localizedStrings.reportsExport

const translateValues = {
    month: (value, timezone) => {
        const month = utcToZonedTime(new Date(value.split("-")), timezone);
        return format(month, "MM/yyyy");
    },
    fully_filled: value => value ? localizedStrings.fully : localizedStrings.partial,
    liter_value: value => Number.isFinite(+value) ? +value.toFixed(2) : value,
}

export const translateKeys = ({
    start_date,
    end_date,
    fuels = [],
    valuesModifier = translateValues,
    registerTranslate = registerTranslateDefault,
    timezone
}) => {
    const monthTranslated = {
        values: {}
    }

    if (start_date && end_date) {

        const startDateTimezoned = utcToZonedTime(new Date(start_date.split("-")), timezone);

        const endDateTimezoned = utcToZonedTime(new Date(end_date.split("-")), timezone);

        const intervalDates = eachMonthOfInterval({
            start: startDateTimezoned,
            end: endDateTimezoned,
        })
        monthTranslated.values = intervalDates.reduce((dates, date) => {
            const formattedDate = format(date, "yyyy-MM");
            const monthNumber = format(date, "MM");
            return Object.assign(dates, {
                [formattedDate]: localizedStrings.monthsPerNumber[+monthNumber]
            })
        }, {})
    }

    return fuels.map(fuel => {
        const translatedFuels = Object.entries(fuel).reduce((fuelItems, fuelItem = []) => {
            const [key, value] = fuelItem;

            const translatedKey = registerTranslate[key];

            const valueModifier = valuesModifier[key];

            const monthKey = monthTranslated.values[key];

            if (!translatedKey && !monthKey) return fuelItems;

            const result = {
                translatedKey,
                value
            }

            if (monthKey) Object.assign(result, {
                translatedKey: monthKey,
                value
            })

            if (valueModifier && timezone) Object.assign(result, {
                value: valueModifier(result.value, timezone)
            })

            fuelItems.push(Object.values(result))
            return fuelItems
        }, [])
        console.log(Object.fromEntries(translatedFuels));
        return Object.fromEntries(translatedFuels)
    })
}
