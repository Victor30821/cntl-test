import { api } from "services/api";

const getTaggings = async ({ organization_id }) => {
	try {
		const URL_TAGGING = `/vehicle/v1/tagging`;

		const urn = `v0:cgv:vehicle:${organization_id}:*`;

		const {
			data: { taggings = [] },
		} = await api.get(URL_TAGGING, { params: { urn, perPage: 1000 } });

		return taggings;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getTaggings;
