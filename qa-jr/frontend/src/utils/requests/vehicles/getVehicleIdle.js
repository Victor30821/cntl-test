import { api } from "services/api";

const getVehicleIdle = async (vehicleId) => {
	try {
		const URL = "/vehicle/v1/" + vehicleId + "/idle";

		const response = await api.get(URL);
		const idleObj = response?.data?.idle_trigger || [];
		return idleObj?.idle_time;
	} catch (error) {
        console.log(error);
        return 0;
	}
};

export default getVehicleIdle;
