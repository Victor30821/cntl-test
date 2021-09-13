import { localizedStrings } from "constants/localizedStrings.js";
import { mapApi } from "services/api";
import {
	vehicleOn,
	vehicleOff,
	noSignal,
	noSignal24,
	noModule,
} from "constants/environment";
import { format, formatISO, differenceInDays } from "date-fns";
import getSignalType from "utils/getSignalType";
import getDaysStoppedSinceLastRoute from "utils/requests/reports/getDaysStoppedSinceLastRoute";

const orderByLastPosition = (a, b) => {
	if (!a.timestamp) return 1;
	if (!b.timestamp) return -1;

	return new Date(b.timestamp) - new Date(a.timestamp);
}

const getLastPoints = async ({getStoppedDays, ...data}) => {
	try {
		const params = [];
		const filters = {
			vehicle_id: (val) => val && params.push("vehicle_id=" + val),
			limit: (val = true) => params.push("limit=" + !!val),
		};
		Object.keys(data).forEach((filter) =>
			filters?.[filter]?.(data?.[filter] ?? false)
		);

		const URL = "/api/v1/last-points?" + params.join("&");

		const {
			data: { last_points: pointsHistory },
		} = await mapApi.get(URL);

		const statusSummary = {
			[vehicleOn]: 0,
			[vehicleOff]: 0,
			[noSignal]: 0,
			[noSignal24]: 0,
			[noModule]: 0,
		};

		if (data.vehicle_id && !Array.isArray(data.vehicle_id)) {
			const driver = pointsHistory.driver;
			const vehicle = pointsHistory.vehicle;
			const last_position = pointsHistory?.last_positions?.reverse()[0] || {};
			return { driver, vehicle, last_position: last_position };
		} else {

			const lastPoints =
				pointsHistory
					.map?.((vehicleObj) => {

						const has_last_postions = !!vehicleObj?.last_positions?.vehicle_id || vehicleObj?.last_positions?.length > 0;

						if (has_last_postions === false) {
							statusSummary[noModule] += 1;
							return {
								driver: vehicleObj.driver || {},
								vehicle: vehicleObj.vehicle,
								status: noModule,
							};
						}

						const lastPositions = vehicleObj?.last_positions?.slice?.()?.pop?.() || vehicleObj?.last_positions

						const timestamp = lastPositions?.timestamp;

						if (timestamp === undefined || timestamp === null) return;

						const {
							ignition,
							speed,
						} = lastPositions;

						const [timeZoneHour] = formatISO(new Date(timestamp), {
							representation: "time",
						}).split("-");
						const [date, hour] = [
							format(new Date(timestamp), localizedStrings.dateMask),
							timeZoneHour,
						];
						const status = getSignalType({
							timestamp,
							ignition,
							speed,
							stage_vehicle_id: vehicleObj?.vehicle?.stage_vehicle_id,
						});

						statusSummary[status] += 1;

						return {
							...lastPositions,
							lat: lastPositions.lat,
							lng: lastPositions.lng,
							date,
							hour,
							lastRegister: new Date(timestamp),
							status,
							driver: vehicleObj.driver,
							vehicle: vehicleObj.vehicle,
						};
					})
					.filter?.((vehicleObj) => vehicleObj)
					.sort?.(orderByLastPosition) || [];

		  const showDaysStoppedByRoute = {
						[vehicleOn]: true,
						[noSignal]: true,
						[vehicleOff]: true,
						[noSignal24]: true,
						[noModule]: false,
					}

			if (getStoppedDays) {
				const vehicles_ids = lastPoints.map(lastPoint => lastPoint.vehicle.id);
				const daysStopped = await getDaysStoppedSinceLastRoute({vehicles_ids});

				pointsHistory.forEach(lastPoint => {
					const daysStoppedByRoute = parseDaysStoppedByRoute({ lastPoint });

					const isToShowDaysStoppedByRoute = showDaysStoppedByRoute[lastPoint.vehicle.status]

					if (daysStoppedByRoute !== null && isToShowDaysStoppedByRoute) daysStopped[lastPoint.vehicle.id] = daysStoppedByRoute;
				});

				lastPoints.forEach(lastPoint => {
					if (!lastPoint?.vehicle?.id) return
					lastPoint.idle = String(daysStopped[lastPoint.vehicle.id]);
				})
			}
			return { lastPoints };
		}
	} catch (error) {
		console.debug(error);
		return {}
	}
};

const parseDaysStoppedByRoute = ({ lastPoint }) => {
	const MINIMUM_POINTS_TO_ACCEPT_DAYS_STOPPED_BY_ROUTE = 3;

	const { last_positions } = lastPoint;

	const hasRoute = Array.isArray(last_positions) && last_positions.length > 0;

	const hasEnoughPoints = !!hasRoute && last_positions.length > MINIMUM_POINTS_TO_ACCEPT_DAYS_STOPPED_BY_ROUTE;

	if (!hasRoute || !hasEnoughPoints) return null;

	const last_position = last_positions[last_positions.length - 1];

	if (!last_position.timestamp) return null;

	const idle = differenceInDays(new Date(), new Date(last_position.timestamp));

	return idle;
}

export default getLastPoints;
