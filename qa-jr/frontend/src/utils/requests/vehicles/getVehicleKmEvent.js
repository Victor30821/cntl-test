import { api } from "services/api";

const getVehicleKmEvent = async (vehicleId) => {
	try {
		const URL = `/vehicle/v1/${vehicleId}/km`;

		const {
			data: { km_triggers },
		} = await api.get(URL);
		return km_triggers;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getVehicleKmEvent;