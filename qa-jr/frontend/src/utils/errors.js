import { localizedStrings } from "constants/localizedStrings";
import { toast } from "react-toastify";

export const showErrorToUser = errMsg => {
    try {
        if (!errMsg) return;

        const knownErrors = [
            "should be number",
            "have required property",
            "should match pattern",
            "payload has taggings with conflict",
            "cnh",
            "identification_driver_key",
            'email/0',
            '/place/code should be string',
            '0/email'
        ];

        const errorsMessages = {
            "should be number": val => localizedStrings.error.types.shouldBeNumber(val),
            "have required property": val => val && localizedStrings.error.types.haveRequiredProperty(val),
            "should match pattern": (val = localizedStrings.date) => val + " " + localizedStrings.error.types.outOfPattern,
            "payload has taggings with conflict": val => localizedStrings.error.types.tagNameAlreadyExists,
            "cnh": val => localizedStrings.error.cnhAlreadyInUse,
            "identification_driver_key": val => localizedStrings.error.identificationDriverKeyAlreadyInUse,
            'email/0': val => localizedStrings.error.emailWrongFormat,
            '0/email': val => localizedStrings.error.emailWrongFormat,
            '/place/code should be string': val => localizedStrings.error.codeHasToBeString,
        };

        const labels = {
            fuel_hour: localizedStrings.hour,
            fuel_date: localizedStrings.date,
            odometer: localizedStrings.odometer,
            liters: localizedStrings.liters,
            total_value: localizedStrings.total_price,
            liter_value: localizedStrings.fuelPrice,
            tagName: localizedStrings.nameOfGroup,
            status_code: localizedStrings.statusCode,
            zipcode: localizedStrings.zipcode,
            number: localizedStrings.number,
        };

        knownErrors.forEach(errorMessageType => {
            const isKnownError = !!errMsg.toLowerCase().match(errorMessageType.toLowerCase());

            const label = Object.keys(labels)
                .map(value => {
                    if (!!errMsg.match(value)) return labels[value];
                    return false;
                })
                .filter(value => value)
                .shift();

            if (isKnownError) {
                toast.error(
                    errorsMessages[errorMessageType](label)
                )
            }

        })
    } catch (error) {
        console.log(error);

        toast.error(localizedStrings.error.create.fuel);
    }
}