import {
    CLIENT_CREATE_SUCCESS,
    CLIENT_CHANGE_OPERATION_STATES,
    CLIENT_LOAD_SUCCESS,
    CLIENT_UPDATE_SUCCESS,
    CLIENT_UPDATE_FAIL,
    CLIENT_EDIT_SUCCESS,
    CLIENT_UPDATE,
    CLIENT_CHANGE_SELECTORS,
    FETCH_ADDRESS_SUCCESS
} from './reducer';
import qs from 'qs'
import { showErrorToUser } from 'utils/errors';

import { api } from "services/api";
import { toast } from 'react-toastify';
import { localizedStrings } from 'constants/localizedStrings';
const editExistingClient = (clients, newClient) => {
    return clients.map(client => {
        if (client.id === newClient.client.id) {
            client = { ...client, ...newClient.client }
        }
        return client;
    })
}
export function clientUpdateSuccess(client) {
    return {
        type: CLIENT_UPDATE_SUCCESS,
        editClient: editExistingClient,
        payload: {
            client
        }
    };
}
export function fetchAddressSuccess(address) {
    return {
        type: FETCH_ADDRESS_SUCCESS,
        payload: {
            address
        }
    };
}

export function clientUpdate(client) {
    return {
        type: CLIENT_UPDATE,
        editClient: editExistingClient,
        payload: {
            client
        }
    };
}


export function clientUpdateFail(client) {
    return {
        type: CLIENT_UPDATE_FAIL,
        editClient: editExistingClient,
        payload: {
            client
        }
    };
}
export function clientLoadSuccess(clients, total) {
    return {
        type: CLIENT_LOAD_SUCCESS,
        editClient: editExistingClient,
        payload: {
            clients,
            total,
        }
    };
}


export function clientEditSuccess(client) {
    return {
        type: CLIENT_EDIT_SUCCESS,
        editClient: editExistingClient,
        payload: {
            client
        }
    };
}
export function clientCreateSuccess(client) {
    return {
        type: CLIENT_CREATE_SUCCESS,
        payload: {
            client
        }
    };
}

export function clientChangeSelectors({
    selectors
}, reset) {
    return {
        type: CLIENT_CHANGE_SELECTORS,
        payload: {
            selectors,
            reset
        }
    };
}

export function clientChangeOperationStates({
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
    createLoading = false,
    createSuccess = false,
    createFail = false,
    editLoading = false,
    editSuccess = false,
    editFail = false,
    addressLoading = false,
    addressSuccess = false,
    addressFail = false,
    updateLoading = false,
    updateSuccess = false,
    updateFail = false,
}) {
    return {
        type: CLIENT_CHANGE_OPERATION_STATES,
        payload: {
            loadLoading,
            loadSuccess,
            loadFail,
            createLoading,
            createSuccess,
            createFail,
            editLoading,
            editSuccess,
            editFail,
            addressLoading,
            addressSuccess,
            addressFail,
            updateLoading,
            updateSuccess,
            updateFail,
        }
    };
}

export const createClient = data => async dispatch => {
    dispatch(clientChangeOperationStates({ createLoading: true }))
    try {
        if (!data) throw new Error("No data given");

        const URL = "/client/v1/";

        const parentesisSpacesAndDashs = /[() -]/g;

        const params = {
            clients: [{
                company_name: data.company_name,
                trading_name: data.trading_name,
                identification: data.identification,
                phone: data.phone?.replace?.(parentesisSpacesAndDashs, ""),
                external_id: data.external_id,
                observation: data.observation,
                contact_name: data.contact_name,
                email: data.email ? [data.email] : undefined,
                addresses: [{
                    zipcode: data.zipcode,
                    address1: data.address,
                    address2: data.complement,
                    number: data.number,
                    neighborhood: data.neighborhood,
                    city: data.city?.label,
                    state: data.city?.state,
                }],
            }]

        }

        await api.post(URL, qs.stringify(params));

        toast.success(localizedStrings.success.create.client);
        dispatch(clientCreateSuccess(data));
        dispatch(clientChangeOperationStates({ createSuccess: true }))
    } catch (error) {
        dispatch(clientChangeOperationStates({ createFail: true }));

        const errorCode = error?.response?.data?.errCode;

        if (errorCode === 'BadRequest') return showErrorToUser(error?.response?.data?.errMsg)

        toast.error(localizedStrings.error.create.client)
    }
};


export const editClient = data => async dispatch => {
    dispatch(clientChangeOperationStates({ editLoading: true }));
    try {
        if (!data) throw new Error("No data given");

        const URL = "/client/v1/" + data.id

        const parentesisSpacesAndDashs = /[() -]/g;

        const params = {
            client: {
                company_name: data.company_name,
                status: data.status ?? 1,
                trading_name: data.trading_name,
                identification: data.identification,
                phone: data.phone?.replace?.(parentesisSpacesAndDashs, "") || undefined,
                external_id: data.external_id || undefined,
                observation: data.observation || undefined,
                contact_name: data.contact_name || undefined,
                email: data.email ? [data.email] : undefined,
                addresses: [{
                    zipcode: data.zipcode,
                    address1: data.address,
                    address2: data.complement || undefined,
                    number: data.number || undefined,
                    neighborhood: data.neighborhood,
                    city: data.city?.label,
                    state: data.city?.state,
                }],
            }
        }

        await api.put(URL, qs.stringify(params));

        toast.success(localizedStrings.success.update.client);

        dispatch(clientEditSuccess(data));

        dispatch(clientChangeOperationStates({ editSuccess: true }));

    } catch (error) {
        dispatch(clientChangeOperationStates({ editFail: true }));

        const errorCode = error?.response?.data?.errCode;

        if (errorCode === 'BadRequest') return showErrorToUser(error?.response?.data?.errMsg)

        toast.error(localizedStrings.error.update.client);

    }
};

export const loadClients = data => async dispatch => {
    dispatch(clientChangeOperationStates({ loadLoading: true }));
    try {
        const params = [];
        const filters = {
            limit: val => val && params.push("limit=" + val),
            offset: (val = 0) => params.push("offset=" + val),
            organization_id: val => val && params.push("organization_id=" + val),
            search_term: val => val && params.push("search_term=" + val),
            status: val => val && params.push("status=" + val),
            client_ids: val => val && params.push("client_ids=" + val),
            sort: val => val && params.push("sort=" + val),
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]));

        const URL = "/client/v1/?" + params.join("&");

        const {
            data: { clients, total }
        } = await api.get(URL);

        const formattedClients = clients.map(client => {
            const [bestAddress] = client?.addresses;

            const hasEmail = Array.isArray(client.email) && client.email.length;

            const hasAddress = bestAddress?.address1 && bestAddress?.city && bestAddress?.state;

            const fullAddress = [
                bestAddress?.address1,
                bestAddress?.city,
                bestAddress?.state
            ].join(", ");

            return {
                ...bestAddress,
                fullAddress: hasAddress && fullAddress,
                ...client,
                email: hasEmail && client.email.join(),
            }
        })

        dispatch(clientLoadSuccess(formattedClients, total));
        dispatch(clientChangeOperationStates({ loadSuccess: true }));
    } catch (error) {
        console.log(error);
        dispatch(clientChangeOperationStates({ loadFail: true }));
    }
};

export const updateClients = data => async dispatch => {
    dispatch(clientChangeOperationStates({ updateLoading: true }));

    const params = { client: {} }

    const rollbackData = { ...data }

    try {
        if (!data) throw new Error("No data given");

        const URL = "/client/v1/" + data.id;

        const filters = {
            status: val => {
                params.client = {
                    company_name: data.company_name,
                    trading_name: data.trading_name,
                    identification: data.identification,
                    phone: data.phone || undefined,
                    external_id: data.external_id || undefined,
                    observation: data.observation || undefined,
                    contact_name: data.contact_name || undefined,
                    email: data.email,
                    addresses: [{
                        zipcode: data.zipcode,
                        address1: data.address1,
                        address2: data.address2,
                        number: data.number,
                        neighborhood: data.neighborhood,
                        city: data.city,
                        state: data.state,
                    }],
                    status: +val,
                }
                rollbackData["status"] = !val;
            },
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        dispatch(clientUpdate(data));

        await api.put(URL, qs.stringify(params));

        toast.success(localizedStrings.success.update.client);

        dispatch(clientUpdateSuccess(data));

        dispatch(clientChangeOperationStates({ updateSuccess: true }));

    } catch (error) {
        console.log(error);

        toast.error(localizedStrings.error.update.client);

        dispatch(clientUpdateFail(rollbackData));

        dispatch(clientChangeOperationStates({ updateFail: true }));

    }

};



