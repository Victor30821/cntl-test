import { api } from '../../../services/api';
import { localizedStrings } from 'constants/localizedStrings';

const loadVehiclesWithGroupsReports = async ({ vehiclesIds, organizationId }) => {

	try {
		const URL_VEHICLES = `/vehicle/v1/`;
		const URL_TAGGING = `/vehicle/v1/tagging`;

		const vehicle_id = vehiclesIds?.join(',') || [];

		const urn = `v0:cgv:vehicle:${organizationId}:*`;

		const params_tagging = {
			urn,
			perPage: 1000,
		}

		const params = {
			offset: 0,
			limit: 1000,
			organization_id: organizationId || 0,
			vehicle_id: vehicle_id || [],
		}

		const {
			data: { vehicles = [] },
		} = await api.get(URL_VEHICLES, { params });

		const [
			{ data: { taggings = [] } },
		] = await Promise.all([
			api.get(URL_TAGGING, { params: params_tagging })
		]);

		const tags_by_vehicle = taggings?.map(tag => {
			const [, , , , vehicle_id] = tag?.urn?.split(":");
			return {
				vehicle_id: Number(vehicle_id),
				tag_name: tag?.tagName || "",
			}
		})

		const vehicleList = vehicles.map(vehicle => {
			const groups = tags_by_vehicle
				?.filter(tags => tags?.vehicle_id === vehicle?.id)
				?.map(tag => tag.tag_name)
				?.join(",");

			return {
				...vehicle,
				vehicle_id: vehicle?.vehicle_id,
				vehicle_name: vehicle?.name || "",
				vehicle_model: vehicle?.model || "",
				plate_number: vehicle?.plate_number || "",
				year_manufacturer: vehicle?.year_manufacturer || "",
				vehicle_type: vehicle?.type_vehicle_name || "",
				vehicle_groups: groups || localizedStrings.noGroupCreated,
			}
		});

		return vehicleList;
	} catch (error) {
		console.log(error);
		return {};
	}
};

export default loadVehiclesWithGroupsReports;