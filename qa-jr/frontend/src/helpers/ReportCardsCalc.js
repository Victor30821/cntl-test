import { localizedStrings } from 'constants/localizedStrings';
export const formatTimeToCard = (data, format) => {
    if (!Number.isFinite(data)) {
       return '00:00';
    }
    try {
        let days = Math.trunc((Math.floor(data) / 86400)),
            hours = Math.trunc((Math.floor(data) / 3600)),
            mins = Math.trunc((Math.floor(data) % 3600) / 60),
            secs = Math.trunc((data % 3600) % 60),
            formatted = "";

        hours = days > 30 ? (days * 24) + hours : hours ;

        switch (format) {
            case 'h:i':
                if(days >= 30) {
                    formatted = `${(((days * 24) / 12) / 60).toFixed(0)}${localizedStrings.months} ${Math.trunc((Math.floor(data) / 3600) % 24)}h`;
                }
                else if(days >= 1) {
                    formatted = `${days.toFixed(0)}${localizedStrings.daysS} ${Math.trunc((Math.floor(data) / 3600) % 24)}h`;
                }
                else {
                    formatted = "";
                    if (hours !== 0) formatted = hours + "h ";
                    formatted += mins +" min";
                }
                break;
            case 'obj':
                formatted = {
                    d: days || 0,
                    h: hours <= 9 ? '0' + hours : hours,
                    i: mins <= 9 ? '0' + mins : mins,
                    s: secs <= 9 ? '0' + secs : secs
                };
                break;
            case 'min':
                formatted = hours > 0 ? mins * hours : mins.toString() + localizedStrings.minuteS;
                break;
            default:
                break;
        }

        return formatted;
    } catch (error) {
        console.log(error);
        return data
    }
}

export const formatDistanceToCard = (data = 0, accuracy = 0, unit = localizedStrings.km) => {
    try {
        const distanceTypes = {
            mi: val => val * 0.00062137,
            km: val => val === 0 ? 0 : val / 1000,
        }
        const value = distanceTypes?.[unit?.toLowerCase()]?.(data);

        return `${value.toFixed(accuracy).replace('.', ',')} ${unit}`;
    } catch (error) {
        console.log(error);
        return data
    }
}

export const formatVolumetricUnits = ({
    unit = "ℓ",
    value = 0,
    accuracy = 2,
}) => {
    try {
        const [
            LITER_TO_FL_OZ_IMPERIAL_VALUE,
            LITER_TO_GILL_VALUE,
            LITER_TO_PT_VALUE,
            LITER_TO_QT_VALUE,
            LITER_TO_GAL_IMPERIAL_VALUE,
        ] = [
                35.19503,
                8.453507,
                2.113376,
                0.8798789,
                0.2199692
            ];

        const volumetricUnitsTypes = {
            ℓ: val => val,  // base value
            "fl oz": val => val * LITER_TO_FL_OZ_IMPERIAL_VALUE,
            gill: val => val * LITER_TO_GILL_VALUE,
            pt: val => val * LITER_TO_PT_VALUE,
            qt: val => val * LITER_TO_QT_VALUE,
            gal: val => val * LITER_TO_GAL_IMPERIAL_VALUE,
        };
        // eslint-disable-next-line
        if (!value) throw 'Error converting liter to ' + unit;

        value = volumetricUnitsTypes?.[unit.toLowerCase()]?.(+value)


        const formattedValue = value
            .toFixed(accuracy)
            .toString()
            .replace(".", ",");

        return `${formattedValue} ${unit}`;
    } catch (error) {
        console.log(error);
        return value + " " + unit;
    }
}
export const formatSpeedToCard = (value = 0, total, format = "km/h", accuracy = 2, onlyFormat = false) => {
    try {
        const KM_TO_MILES_VALUE = 1.61;
        const distanceTypes = {
            "km/h": val => val,  // base value
            "mi/h": val => val === 0 ? 0 : val / KM_TO_MILES_VALUE,
        }
        // eslint-disable-next-line
        if (value === null || value === undefined) throw 'Error converting km/h to ' + format;

        value = distanceTypes?.[format.toLowerCase()]?.(value)

        if (!onlyFormat) {
            value = value / total;
        }

        return `${value.toFixed(accuracy)} ${format}`;
    } catch (error) {
        console.log(error);
        return value + " " + format
    }
}
export const formatCostToCard = ({ money = 0.00, thousandSeparator = ".", decimalSeparator = ",", unit = localizedStrings.priceUnit }) => {
    money = (+money).toFixed(2);
    try {
        const placeDecimalSeparator = (a, b) => a + decimalSeparator + b;
        const thousandDigits = 3; // 1.000
        const [
            beforeComma,
            afterComma
        ] = money.toString().split(".");
        const reversedSignificantNumber = beforeComma.split("").reverse();
        if (reversedSignificantNumber.length <= thousandDigits) return unit + " " + placeDecimalSeparator(beforeComma, afterComma)
        reversedSignificantNumber.splice(3, 0, thousandSeparator)
        reversedSignificantNumber.reverse()

        const formattedMoney = placeDecimalSeparator(reversedSignificantNumber.join(""), afterComma)
        return unit + " " + formattedMoney
    } catch (error) {
        console.log(error);
        return unit + " " + money
    }
}
