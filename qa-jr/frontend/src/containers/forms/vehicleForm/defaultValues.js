import { localizedStrings } from "constants/localizedStrings";

const defaultValues = {
	liters_value: (decimal_separator) => `4${decimal_separator}50`,
	average_fuel_km: (decimal_separator) => `5${decimal_separator}00`,
	type_fuel_id: localizedStrings.gasoline,
	speed: 110,
	idle: 10,
	icon: localizedStrings.car,
}

export const initialSetup = [{name: "", value_in_km: ""},
    {
      name: localizedStrings.scheduleReview, value_in_km: "20000", id: 1,
    },
    {
      name: localizedStrings.changeOil, value_in_km: "30000", id: 1,
    },
    {
      name: localizedStrings.alignAndBalance, value_in_km: "40000", id: 1,
    },
    {
      name: localizedStrings.changeWheels, value_in_km: "50000", id: 1,
    },
    {
      name: localizedStrings.reviewBrakesAndSuspension, value_in_km: "60000", id: 1,
    },
    {
      name: localizedStrings.removeTracker, value_in_km: "70000", id: 1,
    },]

export default defaultValues;
