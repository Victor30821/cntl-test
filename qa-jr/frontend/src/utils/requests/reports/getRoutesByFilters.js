import { apiRoutes } from "services/api";

const getRoutesByFilters = async ({
	filters
}) => {
	try {

        const URL = '/api/v1/routes-reports';
		
        const params = {
            ... filters,
            includes_trackings: true,
            limit: 300,
            offset: 0
        }

        const {
            data: {
                report_routes
            }
        } = await apiRoutes.get(URL, { params });

        return {
            report_routes
        }

	} catch (error) {
		console.log(error);
		return {
            report_routes: []
        };
	}
};

export default getRoutesByFilters;
