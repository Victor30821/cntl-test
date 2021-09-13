import {
    PLACE_CREATE_SUCCESS,
    PLACE_CHANGE_OPERATION_STATES,
    PLACE_LOAD_SUCCESS,
    PLACE_UPDATE_SUCCESS,
    PLACE_UPDATE_FAIL,
    PLACE_EDIT_SUCCESS,
    PLACE_UPDATE,
    PLACE_CHANGE_SELECTORS,
    FETCH_ADDRESS_SUCCESS
} from './reducer';
import qs from 'qs'
import { showErrorToUser } from 'utils/errors';

import { api } from "services/api";
import { toast } from 'react-toastify';
import { localizedStrings } from 'constants/localizedStrings';
import { createGroup, getTaggingPayloadToEntity, getGroupsTagNamesToCreate, deleteVehiclesFromGroup, getGroupsTagNamesToDelete } from 'store/modules';

const editExistingPlace = (places, newPlace) => {
    return places.map(place => {
        if (place.id === newPlace.place.id) {
            place = { ...place, ...newPlace.place }
        }
        return place;
    })
}
export function placeUpdateSuccess(place) {
    return {
        type: PLACE_UPDATE_SUCCESS,
        editPlace: editExistingPlace,
        payload: {
            place
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

export function placeUpdate(place) {
    return {
        type: PLACE_UPDATE,
        editPlace: editExistingPlace,
        payload: {
            place
        }
    };
}


export function placeUpdateFail(place) {
    return {
        type: PLACE_UPDATE_FAIL,
        editPlace: editExistingPlace,
        payload: {
            place
        }
    };
}
export function placeLoadSuccess(places, total) {
    return {
        type: PLACE_LOAD_SUCCESS,
        editPlace: editExistingPlace,
        payload: {
            places,
            total,
        }
    };
}


export function placeEditSuccess(place) {
    return {
        type: PLACE_EDIT_SUCCESS,
        editPlace: editExistingPlace,
        payload: {
            place
        }
    };
}
export function placeCreateSuccess(place) {
    return {
        type: PLACE_CREATE_SUCCESS,
        payload: {
            place
        }
    };
}

export function placeChangeSelectors({
    selectors
}, reset) {
    return {
        type: PLACE_CHANGE_SELECTORS,
        payload: {
            selectors,
            reset
        }
    };
}

export function placeChangeOperationStates({
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
        type: PLACE_CHANGE_OPERATION_STATES,
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

export const updatePlacesTags = data => async dispatch => {
    const tagNamesToCreateTagging = getGroupsTagNamesToCreate({
        initialGroups: data.initialTags?.map?.(tags => tags.tagName),
        newGroups: data?.tags
    });

    const tagNamesToDelete = getGroupsTagNamesToDelete({
        initialGroups: data.initialTags?.map?.(tags => tags.tagName),
        newGroups: data?.tags
    });

    const payloadToDelete = {
        taggings: getTaggingPayloadToEntity({
            entity: "place",
            tagNames: tagNamesToDelete,
            entityId: data?.id,
            organizationId: data.organization_id
        })
    }

    const payloadToCreateTag = {
        taggings: getTaggingPayloadToEntity({
            entity: "place",
            tagNames: tagNamesToCreateTagging,
            entityId: data?.id,
            organizationId: data?.organization_id
        })
    }

    const hasToCreateGroup = payloadToCreateTag.taggings.length > 0;
    const hasToDelete = payloadToDelete.taggings.length > 0;

    const promisses = [
        hasToCreateGroup && dispatch(createGroup({ params: payloadToCreateTag })),
        hasToDelete && dispatch(deleteVehiclesFromGroup({ params: payloadToDelete })),
    ].filter(promise => promise);

    await Promise.all(promisses);
}

const parentesisSpacesAndDashs = /[() -]/g;
const allowNumberAndDash = /(?!-)[^0-9]/g;
const allowOnlyNumber = /[^0-9]/g;

export const createPlace = data => async dispatch => {
    dispatch(placeChangeOperationStates({ createLoading: true }))
    try {
        if (!data) throw new Error("No data given");

        const URL = "/place/v1/";

        const params = {
            places: [{
                id: data.id,
                name: data.name,
                identification: data.identification,
                phone: data.phone?.replace?.(parentesisSpacesAndDashs, ""),
                client_id: data.client?.value,
                external_id: data.external_id,
                email: data.email ? [data.email] : undefined,
                addresses: data.addresses.map(address => ({
                    zipcode: address.zipcode?.replace?.(allowNumberAndDash, "") || undefined,
                    address1: address.address,
                    address2: address.complement,
                    number: address.number?.replace?.(allowOnlyNumber, "") || undefined,
                    neighborhood: address.neighborhood,
                    city: address.city,
                    state: address.state,
                    lat: address.lat,
                    lng: address.lng,
                })),
                status_code: +data.status_code,
                code: data.code,
                has_restriction: +data?.has_restriction,
                partners: [{
                    name: data.partner_name,
                    phone: data.partner_phone?.replace?.(parentesisSpacesAndDashs, ""),
                    email: data.partner_email,
                }]
            }]

        }

        const {
            data: { places }
        } = await api.post(URL, qs.stringify(params));

        const [createdPlace] = places;

        await dispatch(updatePlacesTags({
            initialTags: data.initialTags,
            tags: data?.tags,
            organization_id: data.organization_id,
            id: createdPlace?.id,
        }))

        toast.success(localizedStrings.success.create.place);
        dispatch(placeCreateSuccess(data));
        dispatch(placeChangeOperationStates({ createSuccess: true }))
    } catch (error) {
        toast.error(localizedStrings.error.create.place)
        dispatch(placeChangeOperationStates({ createFail: true }));

        const errorCode = error?.response?.data?.errCode;

        if (errorCode === 'BadRequest') return showErrorToUser(error?.response?.data?.errMsg)
    }
};


export const editPlace = data => async dispatch => {
    dispatch(placeChangeOperationStates({ editLoading: true }));
    try {
        if (!data) throw new Error("No data given");

        const URL = "/place/v1/" + data.id;

        const params = {
            place: {
                name: data.name,
                identification: data.identification,
                status: data.status ?? 1,
                phone: data.phone?.replace?.(parentesisSpacesAndDashs, "") || undefined,
                client_id: data.client?.value || undefined,
                external_id: data.external_id || undefined,
                email: data.email ? [data.email] : undefined,
                addresses: data.addresses.map(address => ({
                    zipcode: address.zipcode?.replace?.(allowNumberAndDash, "") || undefined,
                    address1: address.address,
                    address2: address.complement,
                    number: address.number?.replace?.(allowOnlyNumber, "") || undefined,
                    neighborhood: address.neighborhood,
                    city: address.city,
                    state: address.state,
                    lat: address.lat,
                    lng: address.lng,
                })),
                status_code: +data.status_code,
                code: (!!data.status_code && data.code) ? data.code : null,
                has_restriction: +data?.has_restriction,
                partners: [{
                    name: data.partner_name,
                    phone: data.partner_phone?.replace?.(parentesisSpacesAndDashs, "") || undefined,
                    email: data.partner_email,
                }]
            }
        }

        const {
            data: { place }
        } = await api.put(URL, qs.stringify(params));

        await dispatch(updatePlacesTags({
            initialTags: data.initialTags,
            tags: data?.tags,
            organization_id: data.organization_id,
            id: place?.id,
        }))

        toast.success(localizedStrings.success.update.place);

        dispatch(placeEditSuccess(data));

        dispatch(placeChangeOperationStates({ editSuccess: true }));

    } catch (error) {
        toast.error(localizedStrings.error.update.place);

        dispatch(placeChangeOperationStates({ editFail: true }));

        const errorCode = error?.response?.data?.errCode;

        if (errorCode === 'BadRequest') return showErrorToUser(error?.response?.data?.errMsg)

    }
};

export const loadPlaces = data => async dispatch => {
    dispatch(placeChangeOperationStates({ loadLoading: true }));
    try {
        const params = [];
        const filters = {
            limit: val => val && params.push("limit=" + val),
            offset: (val = 0) => params.push("offset=" + val),
            organization_id: val => val && params.push("organization_id=" + val),
            search_term: val => val && params.push("search_term=" + val),
            client_ids: val => val && params.push("client_ids=" + val),
            status: val => val && params.push("status=" + val),
            sort: val => val && params.push("sort=" + val),
            search_term_identification: val => val && params.push("search_term_identification=" + val),
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]));

        const URL = "/place/v1/?" + params.join("&");

        const {
            data: { places, total }
        } = await api.get(URL);

        const formattedPlaces = places.map(place => {
            const [bestAddress] = place?.addresses;

            const hasEmail = Array.isArray(place.email) && place.email.length;
            const hasAddress = bestAddress?.address1 && bestAddress?.city && bestAddress?.state;

            const fullAddress = [
                bestAddress?.address1,
                bestAddress?.city,
                bestAddress?.state
            ].join(", ");

            return {
                ...bestAddress,
                fullAddress: hasAddress && fullAddress,
                ...place,
                email: hasEmail && place.email.join(),
            }
        })

        dispatch(placeLoadSuccess(formattedPlaces, total));
        dispatch(placeChangeOperationStates({ loadSuccess: true }));
    } catch (error) {
        console.log(error);
        dispatch(placeChangeOperationStates({ loadFail: true }));
    }
};

export const updatePlaces = data => async dispatch => {
    dispatch(placeChangeOperationStates({ updateLoading: true }));
    const URL = "/place/v1/" + data.id;

    const params = { place: {} }

    const rollbackData = { ...data }

    try {
        if (!data) throw new Error("No data given");

        const filters = {
            status: val => {

                const [partner] = data.partners || [];
                const [address] = data.addresses || [];

                params.place = {
                    status: +val,
                    name: data.name,
                    identification: data.identification,
                    phone: data.phone,
                    client_id: data.client,
                    external_id: data.external_id,
                    email: data.email,
                    addresses: [{
                        zipcode: address?.zipcode,
                        address1: address?.address1,
                        address2: address?.address2,
                        number: address?.number,
                        neighborhood: address?.neighborhood,
                        city: address?.city,
                        state: address?.state,
                        lat: address?.lat,
                        lng: address?.lng,
                    }],
                    status_code: +data.status_code,
                    code: data.code,
                    partners: [{
                        name: partner?.name,
                        phone: partner?.phone,
                        email: partner?.email,
                    }]
                }
                rollbackData["status"] = !val;
            },
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        dispatch(placeUpdate(data));

        await api.put(URL, qs.stringify(params));

        toast.success(localizedStrings.success.update.place);

        dispatch(placeUpdateSuccess(data));

        dispatch(placeChangeOperationStates({ updateSuccess: true }));

    } catch (error) {
        console.log(error);

        toast.error(localizedStrings.error.update.place);

        dispatch(placeUpdateFail(rollbackData));

        dispatch(placeChangeOperationStates({ updateFail: true }));

    }

};
