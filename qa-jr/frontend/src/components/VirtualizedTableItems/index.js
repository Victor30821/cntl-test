import Boolean from './boolean'
import InformationCell from './informationCell'
import ErrorCell from './errorCell'
import SortIconIndicator from './sortIconIndicator'

import { utcToZonedTime } from 'date-fns-tz'
import { format, } from 'date-fns'
import { formatCostToCard, formatSpeedToCard, formatTimeToCard, formatVolumetricUnits } from 'helpers/ReportCardsCalc'
import populateSelects from "constants/populateSelects";
import { convertUserMaskToDateFns } from 'utils/convert'
import { convert, formatUnit } from 'helpers/IntlService'
import { DEFAULT_NULL_VALUE } from 'constants/environment'
import { formatTime } from 'utils/formatTime'

const conversionPerType = {
    time: ({
        user_settings = {},
        cellData = "",
    }) => {
        const {
            timezone,
        } = user_settings;

        const result = {
            value: cellData,
            options: {
                tooltipTime: cellData,
            }
        }

        try {
            const output = utcToZonedTime(cellData, timezone);

            result.value = format(output, "HH:mm") || '00:00';

            result.options.tooltipTime = format(output, "HH:mm:ss") || '00:00';

        } catch (error) {
            console.log(error);
            result.value = DEFAULT_NULL_VALUE;
            result.options.tooltipTime = cellData
        }
        return result
    },
    duration: ({
        user_settings = {},
        cellData = "",
    }) => {

        const result = {
            value: cellData,
            options: {},
        }

        try {
            result.value = formatTimeToCard(cellData, 'h:i');
        } catch (error) {
            result.value = cellData
        }

        return result
    },
    cost: ({
        cellData = 0,
        user_settings
    }) => {

        const result = {
            value: cellData,
            options: {}
        }

        try {
            const {
                thousand_separator: thousandSeparator,
                decimal_separator: decimalSeparator,
                currency,
            } = user_settings;

            const unit = populateSelects.currency.find(money => money.value === currency)?.unit;

            result.value = formatCostToCard({ money: cellData, thousandSeparator, decimalSeparator, unit });

        } catch (error) {
            result.value = cellData;
        }

        return result
    },
    distance: ({
        cellData = 0,
        user_settings,
        distanceUnitAccuracy = 0,
        distanceUnit = 'm',
		pureResult = false
    }) => {
        const result = {
            value: cellData
        }
        try {
            const {
                distance_unit
            } = user_settings;

            if (!pureResult && cellData > 0 && cellData < 1000) {
                result.value = `< 1${distance_unit}`
            } else {
                result.value = (cellData && formatUnit(convert(cellData, distanceUnit, distance_unit).toFixed(distanceUnitAccuracy), distance_unit)) || DEFAULT_NULL_VALUE;
            }
        } catch (error) {
            result.value = cellData;
        }
        return result;
    },
    liters: ({
        cellData = 0,
        user_settings
    }) => {
        const result = {
            value: cellData,
            options: {}
        }
        try {
            const {
                volumetric_measurement_unit
            } = user_settings;

            const volumetricUnit = populateSelects.volumetricUnit.find(volumetric => volumetric.value === volumetric_measurement_unit)?.unit;

            const convertedValue = formatVolumetricUnits({
                unit: volumetricUnit,
                value: cellData
            });

            result.value = convertedValue;

        } catch (error) {
            result.value = cellData;
        }

        return result
    },
    velocity: ({
        cellData = 0,
        user_settings,
        sufix = "/h"
    }) => {
        const result = {
            value: cellData,
            options: {},
        }
        try {
            const {
                distance_unit,
            } = user_settings;

            result.value = formatSpeedToCard(cellData, 2, distance_unit + sufix, 0, true);

        } catch (error) {
            result.value = cellData;
        }

        return result;
    },
    distancePerLiter: ({
        cellData = 0,
        user_settings,
        numberFormat = (number = 0) => number.toFixed(2)
    }) => {
        const result = {
            value: cellData,
            options: {},
        }
        try {
            const {
                distance_unit,
                volumetric_measurement_unit
            } = user_settings;

            const volumetricUnit = populateSelects.volumetricUnit.find(unit => unit.value === volumetric_measurement_unit)?.unit;

            result.value = numberFormat(cellData) + " " + distance_unit + "/" + volumetricUnit;

        } catch (error) {
            result.value = cellData;
        }

        return result
    },
    date: ({
        cellData,
        user_settings,
        dateFormat: dateFormatProp,
    }) => {
        const result = {
            value: cellData,
            options: {},
            error: false,
        }
        const {
            short_date_format: dateFormat,
            timezone,
        } = user_settings;

        if (!result.value) {
            result.value = DEFAULT_NULL_VALUE;
            return result;
        }

        try {

            const dateMaskFromConfiguration = convertUserMaskToDateFns({ mask: dateFormat });

            const timeZonedDate = utcToZonedTime(result.value, timezone)

            result.value = format(
                timeZonedDate,
                dateMaskFromConfiguration
            );
        } catch (error) {
            console.log(error);
            result.value = DEFAULT_NULL_VALUE;
            result.error = true;
        }
        return result
    },
    datetime: ({
        cellData,
        user_settings,
        dateFormat: dateFormatProp,
    }) => {
        const result = {
            value: cellData,
            options: {},
            error: false,
        }

        try {
            const {
                short_date_format: dateFormat,
                short_time_format: timeFormat,
                timezone,
            } = user_settings;

            const dateMaskFromConfiguration = convertUserMaskToDateFns({ mask: `${dateFormat}`, timeMask: `${timeFormat}` });

            const timeZonedDate = utcToZonedTime(result.value, timezone)

            result.value = format(
                timeZonedDate,
                dateMaskFromConfiguration
            );
        } catch (error) {
            console.log(error);
            result.value = DEFAULT_NULL_VALUE
            result.error = true
        }

        return result
    },
}

export {
    Boolean,
    ErrorCell,
    InformationCell,
    SortIconIndicator,
    conversionPerType,
}
