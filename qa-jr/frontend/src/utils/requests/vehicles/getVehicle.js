import { api } from "services/api";
import qs from "qs";

const getVehicles = async ({ vehicle_ids, organization_id } = {}) => {
	const queryString = qs.stringify({
		vehicle_ids,
		organization_id,
	});

	try {
		const URL = `/vehicle/v1/${queryString}`;
		const {
			data: { vehicle },
		} = await api.get(URL);

		return vehicle;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getVehicles;
