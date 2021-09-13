import { api } from "services/api";

const loadOneVehicle = async (vehicleId) => {
	try {
		const URL = `/vehicle/v1/${vehicleId}`;
		const {
			data: { vehicle },
		} = await api.get(URL);

		return vehicle;
	} catch (error) {
		console.log(error);
		return {};
	}
};

export default loadOneVehicle;
