import {
    VEHICLE_STATUS_LOAD_SUCCESS,
    VEHICLE_STATUS_EXPORT_SUCCESS,
    VEHICLE_STATUS_CHANGE_OPERATION_STATES
} from './reducer';
import qs from 'qs'

import { api } from 'services/api'
import { setSearchedAddressLatLng } from 'store/modules/map/action';
import { API_KEY_MAP_GEOCODE, API_URL_PROXY } from 'constants/environment';


export function vehicleStatusChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: VEHICLE_STATUS_CHANGE_OPERATION_STATES,
        payload: {
            exportLoading,
            exportSuccess,
            exportFail,
            loadLoading,
            loadSuccess,
            loadFail,
        }
    };
}

export function vehicleStatusLoadSuccess({ vehicleStatus, total }) {
    return {
        type: VEHICLE_STATUS_LOAD_SUCCESS,
        payload: {
            vehicleStatus,
            total,
        }
    };
}

export const searchAddressLatLngVehicleStatus = ({ coordinates, onFinish }) => async dispatch => {
	const locations = [];
    if (typeof coordinates === 'object' && coordinates.length > 0) {
		const data = [];
		coordinates.forEach((coord) => {
			if (coord?.lat && coord?.lng) {
				data.push({
					url:"/api/geocode/json?latlng=" + coord.lat + "," + coord.lng + "&key=" + API_KEY_MAP_GEOCODE + "&language=pt-BR&channel=contele-gv&sensor=&client=gme-contelesolucoestecnologicas&res=format&mode=1"
				})
			}
		});

		const params = {
			method: 'POST',
			body: JSON.stringify({data}),
		};

		const response = await fetch(API_URL_PROXY + 'api/multi_requests/', params);
		const { content = [] } = await response?.json();
		locations.push(...content);
    }
    onFinish && onFinish(locations);
}

export const loadVehicleStatus = data => async dispatch => {
    console.log(data);

    // let URL = "/vehicle/v1/tag?"

    // if (data.limit) URL += "perPage=" + data.limit + "&";
    // if (data.page) URL += "page=" + data.page + "&";
    // if (data.search_term) URL += "tagName=" + "*" + data.search_term + "*&";
    // if (data.urn) URL += "urn=" + data.urn;

    // dispatch(vehicleStatusChangeOperationStates({ loadLoading: true, }));

    // await api.get(URL)
    //     .then(result => {
    //         const hasVehicleStatus = result && result.hasOwnProperty("data") && result.data.hasOwnProperty("tags");
    //         console.log(result);
    //         if (hasVehicleStatus) {
    //             const { tags, totalItems } = result.data;

    //             dispatch(vehicleStatusLoadSuccess({ tags, total: totalItems }));
    //             dispatch(vehicleStatusChangeOperationStates({ loadSuccess: true }));
    //         }
    //         if (!result) {
    //             dispatch(vehicleStatusChangeOperationStates({ loadFail: true }));
    //         }
    //     })
    //     .catch(err => {
    //         console.log("error loading:", err);
    //         dispatch(vehicleStatusChangeOperationStates({ loadFail: true }));
    //     })
};
