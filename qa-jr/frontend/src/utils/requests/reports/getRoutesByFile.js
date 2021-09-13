import { mapApi } from "services/api";

const isRequired = (param) => {
	throw new Error(`${param} is required - fn getRoutesbyFieldIds`);
};

const getRoutesByFileIds = async ({
	file_route_ids = isRequired("file_route_id"),
	vehicle_id = isRequired("vehicle_id"),
}) => {
	try {
		const URL = "/api/v1/last-break-route-point/";

		const responses = await Promise.all(
			file_route_ids.map((file_route_id) => {
				return mapApi.get(
					`${URL}?file_route_id=${file_route_id}&vehicle_id=${vehicle_id}`
				);
			})
		);

		const routesLastPoints = responses.map((response) => {
			const {data: {last_points}} = response
			last_points[0].path = last_points[0].last_positions.map(
				(last_position) => ({ lat: last_position.lat, lng: last_position.lng })
			);
			return last_points[0]
		});

		return routesLastPoints;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getRoutesByFileIds;
