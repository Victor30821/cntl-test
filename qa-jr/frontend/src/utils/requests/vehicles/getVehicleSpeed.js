import { api } from "services/api";

const getVehicleSpeed = async (vehicleId) => {
	try {
		const URL = `/vehicle/v1/${vehicleId}/speed`;
		const response = await api.get(URL);
		const speedObj = response?.data?.speed_trigger || [];
		return speedObj?.speed_in_km_h;
	} catch (error) {
		console.log(error);
		return 0;
	}
};

export default getVehicleSpeed;
