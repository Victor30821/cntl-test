import { tracker_authorized_to_use_new_api } from 'utils/contractUseNewApi'
import { loadMapVehicles } from 'store/modules';
import { mapApi } from "services/api";

const getNewReportKMFiltered = ({
    pointsHistory,
    routes,
}) => {
    const vehicles_authorized = pointsHistory.reduce((acc, current_last) => {

        const {
            vehicle: {
                type_tracker_id = ""
            }
        } = current_last;

        const is_vehicle_authorized = type_tracker_id && tracker_authorized_to_use_new_api.includes(+type_tracker_id);

        if(is_vehicle_authorized === false) return acc;

        const {
            vehicle
        } = current_last;

        acc.push(vehicle)

        return acc;

    }, []);

    const vehicle_ids_to_remove = vehicles_authorized.map(vehicle => vehicle.vehicle_id);

    const routes_vehicle_ids_removed = routes.filter(route => !vehicle_ids_to_remove.includes(route.vehicle_id));
    
    const {
        cost,
        distance
    } = routes_vehicle_ids_removed.reduce((acc, current_route) => {

        acc.distance += current_route.distance;
        acc.cost += current_route.cost;

        return acc;

    }, {
        cost: 0,
        distance: 0
    });

    return {
        routes_vehicle_ids_removed,
        new_summary: {
            cost,
            distance
        },
        new_total: routes_vehicle_ids_removed.length,
    };
}

export const removeReportsFromKM = async ({
    is_authorized,
    summary,
    routes,
}) => {

    if(is_authorized === false) return {
        routes_vehicle_ids_removed: routes,
        new_summary: summary,
        new_total: routes.length,
    }

    const params = {
        limit: false,
    }

    const URL = "/api/v1/last-points?";

    const {
      data: { 
          last_points: pointsHistory 
        }
    } = await mapApi.get(URL, { params });

    const {
        new_summary,
        new_total,
        routes_vehicle_ids_removed
    } = getNewReportKMFiltered({
        pointsHistory,
        routes,
    });

    return {
        routes_vehicle_ids_removed,
        new_summary,
        new_total,
    };

}