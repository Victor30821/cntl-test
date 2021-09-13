import {
    AUDIT_LOAD_SUCCESS,
    AUDIT_CHANGE_OPERATION_STATES,
    AUDIT_CHANGE_LOADING_TEXT,
    AUDIT_CHANGE_LOADING_EMAIL
} from './reducer';
import { api, mapApi, apiRoutes } from 'services/api'
import { API_KEY_MAP_GEOCODE, API_URL_PROXY } from 'constants/environment'
import { localizedStrings } from 'constants/localizedStrings';
import { canUseNewApi } from 'utils/contractUseNewApi';
import { removeOldApiTrackingUntil } from 'utils/removeOldApiReportsUnti';
import { loadMapVehicles } from 'store/modules';
import { validateDateNewApi } from 'utils/validateDateNewApi';

export function auditChangeOperationStates({
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: AUDIT_CHANGE_OPERATION_STATES,
        payload: {
            loadLoading,
            loadSuccess,
            loadFail,
        }
    };
}

export function auditLoadSuccess({ trackings }) {
    return {
        type: AUDIT_LOAD_SUCCESS,
        payload: {
            trackings
        }
    };
}

export function auditChangeLoadingText({ loadingAuditText, loadingPaginationText, loadingPagination }) {
    return {
        type: AUDIT_CHANGE_LOADING_TEXT,
        payload: {
            loadingAuditText,
            loadingPaginationText, 
            loadingPagination
        },
    }
}

export function auditChangeLoading({
    loadLoadingSendEmail = false,
    loadSuccessSendEmail = false,
    loadFailSendEmail = false,
}) {
    return {
        type: AUDIT_CHANGE_LOADING_EMAIL,
        payload: {
            loadLoadingSendEmail,
            loadSuccessSendEmail,
            loadFailSendEmail
        }
    }
}

const loadOldApiRoutes = async ({
    params,
    is_authorized
}) => {
    try {

        const {
            data: {
                trackings: last_point_trackings,
            }
        } = await mapApi.get('/api/v1/trackings-route-date', { params });

        const {
			routes_period_removed = []
		} = removeOldApiTrackingUntil({
			trackings: last_point_trackings,
			is_authorized
		})

        return {
            last_point_trackings: routes_period_removed
        }
        
    } catch (error) {
        return {
            last_point_trackings: [],
        }
    }
}

const loadNewApiRoutes = async ({
    params,
    is_authorized
}) => {
    try {

        if(is_authorized === false) return {
            audit_trackings: [],
        }

        const {
            start_date,
            end_date
        } = validateDateNewApi({
            start_date: params.start_date,
            end_date: params.end_date
        })

        const {
            data: {
                audit_trackings = [],
            }
        } = await apiRoutes.get('/api/v1/audit-trackings', { params: {
            ...params,
            start_date,
            end_date,
        } });

        return {
            audit_trackings
        }
        
    } catch (error) {
        return {
            audit_trackings: []
        }
    }
}

export const loadAuditTrackings = data => async dispatch => {
    try {
        
        dispatch(auditChangeOperationStates({ loadLoading: true }));

        const {
            period: {
                start_date,
                end_date,
            },
            vehicle,
            showAddress,
            organization_id
        } = data;

        const {
            vehicle_id,
            serial_number: imei,
        } = vehicle;

        const { 
            pointsHistory
        } = await dispatch(loadMapVehicles({ vehicle_id: vehicle_id, limit: false }));
        
        const {
            is_authorized
        } = canUseNewApi({ organization_id, last_points: [pointsHistory], vehicle_id });

        const params = {
            start_date,
            end_date,
            vehicle_id
        }

        dispatch(auditChangeLoadingText({ loadingAuditText: localizedStrings.loadingRoutes, loadingPagination: false, loadingPaginationText: "", }));

        const [
            {
                last_point_trackings
            },
            {
                audit_trackings
            }
        ] = await Promise.all([
            loadOldApiRoutes({
                params,
                organization_id,
                is_authorized
            }),
            loadNewApiRoutes({
                params: {
                    organization_id,
                    start_date,
                    end_date,
                    vehicle_id,
                    imei
                },
                is_authorized
            })
        ])

        const trackings = [...last_point_trackings, ...audit_trackings];
        
        const has_trackings = 
            Array.isArray(trackings) &&
            trackings?.length > 0;

        if(showAddress.isChecked && has_trackings) {

            const trackings_latlng = trackings
							.filter(
								(tracking, i, arr) =>
									i ===
									arr.findIndex(
										(t) =>
											String(t.lat) === String(tracking.lat) &&
											String(t.lng) === String(tracking.lng)
									)
							)
							.map((tracking) => {

								const url_geocode = "/api/geocode/json?latlng=";

								const lat_lng = `${tracking.lat},${tracking.lng}`;

                                return {
									url: `${url_geocode}${lat_lng}&key=${API_KEY_MAP_GEOCODE}&language=pt-BR&channel=contele-gv&sensor=&client=gme-contelesolucoestecnologicas&res=format&mode=1`,
                                };
                                
                            });
            
            const { addresses = {} } = await loadMultiRequestAddress({trackings_latlng, dispatch});
            
            trackings.forEach(tracking => {

                const address_key = `${tracking?.lat.toFixed(4)},${tracking?.lng.toFixed(4)}`;
                
                const address = addresses[address_key];

                const has_address = !!address;

                if(has_address) tracking.address = address?.formattedAddress;

            });

        }

        dispatch(auditLoadSuccess({ trackings }));
        dispatch(auditChangeOperationStates({ loadSuccess: true }));
        
    } catch (error) {
        console.log('[error] on trying to get trackings:' + error);
        dispatch(auditChangeOperationStates({ loadFail: true }));
    }
}

const loadMultiRequestAddress = async ({ trackings_latlng = [], dispatch }) => {

    let addresses = {};

    try {

        const LIMIT_QUANTITY_HITS = 200;

        const total_addresses = trackings_latlng.length;

        let addresses_requested = 0;
        
        while (trackings_latlng?.length > 0) {

            const data = trackings_latlng.splice(0, LIMIT_QUANTITY_HITS);

            addresses_requested += data.length;

            const text_loading = `${addresses_requested}/${total_addresses}`;

            dispatch(auditChangeLoadingText({ loadingAuditText: localizedStrings.loadingAddresses, loadingPagination: true, loadingPaginationText: text_loading, }));

            const params = { 
               method: 'POST',
               body: JSON.stringify({data}),
            };

            const response = await fetch(API_URL_PROXY + 'api/multi_requests/',params);

            const { content = {} } = await response?.json();

            const has_content = 
                Array.isArray(content) &&
                content?.length > 0;

            if(has_content) {
                
                const all_addresses_searched = content.flat();

                const address_indexed = all_addresses_searched?.reduce((acc, address) => {

                    const address_key = `${address?.latitude?.toFixed(4) || 0},${address?.longitude?.toFixed(4) || 0}`;

                    const has_address = !!acc[address_key];

                    if(has_address === false) acc[address_key] = address;

                    return acc;
                    
                }, {});
                
                addresses = {
                    ...addresses,
                    ...address_indexed,
                };
            }
        }

        return {
            addresses,
        }

    } catch (error) {
        console.log(error);
        return {
            addresses,
        }
    }
}

export const sendFileToEmail = data => async dispatch => {
    try {

        dispatch(auditChangeLoading({ loadLoadingSendEmail: true }));
        
        const upload_tmp = {
            ...data,
            report_name: localizedStrings.audit,
        }
        console.log('upload_tmp', upload_tmp);
        await api.post('upload-tmp-file/v1', { upload_tmp });

        dispatch(auditChangeLoading({ loadSuccessSendEmail: true }));

    } catch (error) {
        console.log(error);
        dispatch(auditChangeLoading({ loadFailSendEmail: true }));
    }
}