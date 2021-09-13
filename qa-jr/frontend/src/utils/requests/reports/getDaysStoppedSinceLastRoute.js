import { api } from "services/api";

const getDaysStoppedSinceLastRoute = async ({ vehicles_ids = [] }) => {
	try {
		const URL = `/routes/v1/days_stopped?vehicle_ids=${vehicles_ids.join(",")}`;

		const {
			data: { daysStoppedSinceLastRoute },
		} = await api.get(URL);

		
		const daysStoppedSinceLastRouteIndexedByVehicleId = daysStoppedSinceLastRoute.reduce((acc, vehicle) => {
			acc[vehicle.id] = vehicle.days_stopped;
			return acc;
		}, {});

		return daysStoppedSinceLastRouteIndexedByVehicleId
	} catch (error) {
		console.log(error);
	}
};

export default getDaysStoppedSinceLastRoute;
