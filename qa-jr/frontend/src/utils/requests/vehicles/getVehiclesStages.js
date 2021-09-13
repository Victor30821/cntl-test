import { api } from "services/api";

const getVehiclesStage = async () => {
	try {
		const URL = "/vehicle/v1/stage";

		const result = await api.get(URL);
		const hasStages = result?.data?.stages;

		if (hasStages) {
			const stages = result.data.stages;
			return stages;
		}
		return [];
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getVehiclesStage;
