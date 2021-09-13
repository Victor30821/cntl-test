import { api } from "services/api";

const getTaggingByVehicleId = async ({ organization_id, vehicle_id }) => {
	try {
		const URL = `/vehicle/v1/tagging?urn=v0:cgv:vehicle:${organization_id}:${vehicle_id}`;

		const {
			data: { taggings },
		} = await api.get(URL);

		return taggings;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getTaggingByVehicleId;
