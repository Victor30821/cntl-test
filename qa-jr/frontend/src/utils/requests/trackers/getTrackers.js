import { api } from "services/api";

const getTrackerByVehicleId = async (vehicleId) => {
	try {
		const URL = `/tracker/v1?vehicle_id=${vehicleId}`;
		const { data: { trackers } = [] } = await api.get(URL);
		const vehicleTracker = trackers.find(
			(tracker) => tracker.vehicle_id === Number(vehicleId)
		);
		return vehicleTracker;
	} catch (error) {
		console.log(error);
		return {};
	}
};

export default getTrackerByVehicleId;
