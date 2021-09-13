import { localizedStrings } from "constants/localizedStrings";

const tableColumns = {
	start_date: {
		text: localizedStrings.date,
		weight: 1,
	},
	init: {
		text: localizedStrings.init,
		weight: 1,
	},
	end: {
		text: localizedStrings.end,
		weight: 1,
	},
	time: {
		text: localizedStrings.time,
		weight: 1,
	},
	distance: {
		text: localizedStrings.totalDistanceShort,
		weight: 1,
	},
	raw_distance: {
		text: localizedStrings.totalDistance,
		weight: 1,
	},
	had_odometer_command_executed: {
		text: localizedStrings.odometerAdjustment,
		weight: 1,
	},
	cost: {
		text: localizedStrings.cost,
		weight: 1,
	},
	max_speed: {
		text: localizedStrings.maxSpeedShort,
		weight: 1,
	},
	average_speed: {
		text: localizedStrings.averageSpeedShort,
		weight: 1,
	},
	driver_name: {
		text: localizedStrings.driver,
		weight: 3,
	},
	address_start: {
		text: localizedStrings.addressStart,
		weight: 4,
	},
	address_end: {
		text: localizedStrings.addressEnd,
		weight: 4,
	},
	vehicle_name: {
		text: localizedStrings.vehicleName,
		weight: 1,
	},
	vehicle_model: {
		text: localizedStrings.vehicleModel,
		weight: 1,
	},
	plate_number: {
		text: localizedStrings.plateNumber,
		weight: 1,
	},
	group: {
		text: localizedStrings.group,
		weight: 1,
	},
	start_odometer: {
		text: localizedStrings.startOdometer,
		weight: 1,
	},
	end_odometer: {
		text: localizedStrings.endOdometer,
		weight: 1,
	},
	year_manufacturer: {
		text: localizedStrings.reportsExport.year_manufacturer,
		weight: 1,
	},
	vehicle_groups: {
		text: localizedStrings.reportsExport.vehicle_groups,
		weight: 1,
	  },
	type_vehicle_name: {
		text: localizedStrings.reportsExport.vehicle_type,
		weight: 1,
	},
	model: {
		text: localizedStrings.reportsExport.vehicle_model,
		weight: 1
	},
};

export default tableColumns;
