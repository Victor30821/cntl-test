const contracts_authorized_to_use_new_api = [528, 149, 508, 515, 156, 563, 580, 487, 253];
const type_trackers = {gv50: 15};
const tracker_authorized_to_use_new_api = [type_trackers.gv50];

const getTypeTrackerId = ({
    last_points,
    vehicle_id
}) => {
    
    const vehicle_found = last_points?.filter(last => last?.vehicle?.id === +vehicle_id);
    
    const has_vehicle_found = Array.isArray(vehicle_found) && vehicle_found?.length > 0;

    if(has_vehicle_found === false) return {
        type_tracker_id: 0,
    }

    const [last_point={}] = vehicle_found;

    const {
        vehicle = {},
    } = last_point;
    
    const {
        type_tracker_id = 0
    } = vehicle;

    return {
        type_tracker_id
    }
}

export const canUseNewApi = ({
    organization_id = 0,
    last_points = [],
    vehicle_id,
}) => {

    const {
        type_tracker_id = 0
    } = getTypeTrackerId({
        last_points,
        vehicle_id
    });

    const is_authorized = contracts_authorized_to_use_new_api.includes(+organization_id) && tracker_authorized_to_use_new_api.includes(type_tracker_id);
    return {
        is_authorized
    }
}

export const canUseNewApiByContract = ({
    organization_id
}) => {
    const is_authorized = contracts_authorized_to_use_new_api.includes(+organization_id);
    return {
        is_authorized
    }
}

export {
    tracker_authorized_to_use_new_api
}
