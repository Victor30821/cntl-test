import {
    GROUP_CREATE_SUCCESS,
    GROUP_LOAD_SUCCESS,
    GROUP_UPDATE_SUCCESS,
    GROUP_UPDATE_FAIL,
    GROUP_UPDATE,
    GROUP_DELETE,
    GROUP_CHANGE_OPERATION_STATES,
    GROUP_LOAD_TAGGING_BY_NAME_SUCCESS,
} from './reducer';


import { api } from 'services/api'
import { showErrorToUser } from 'utils/errors';
import { HTTP_STATUS } from 'constants/environment';
const editExistingGroups = (groups, newGroups) => {
    return groups.map(group => {
        if (group.id === newGroups.group.id) {
            group = { ...group, ...newGroups.group }
        }
        return group;
    })
}
const removeExistingGroup = (groups, groupToDelete) => {
    const tagToRemoveIndex = groups.findIndex(tagging => {
        const isSameTag = JSON.stringify(tagging) === JSON.stringify(groupToDelete);
        return isSameTag ? true : false;
    });
    groups.splice(tagToRemoveIndex, 1);
    return groups;
}
export const getTaggingPayloadToEntity = ({
    version = "v0",
    context = "cgv",
    entity = "vehicle",
    tagNames = [],
    entityId,
    organizationId,
}) => {
    const urnItems = [
        version,
        context,
        entity,
        organizationId,
        entityId
    ].join(":");
    return tagNames.map(tagName => {
        return {
            tagName,
            urn: urnItems
        }
    })
}
export const getTaggingPayloadToGroups = ({
    version = "v0",
    context = "cgv",
    entity = "vehicle",
    tagName,
    entitiesIds = [],
    organizationId,
}) => entitiesIds.map(vehicleId => {
    const urnItems = [
        version,
        context,
        entity,
        organizationId,
        vehicleId
    ]
    return {
        tagName,
        urn: urnItems.join(":")
    }
})

export const getGroupsTagNamesToDelete = ({
    initialGroups = [],
    newGroups = []
}) => {
    return initialGroups.filter(initialGroup => !newGroups.includes(initialGroup))
}
export const getGroupsTagNamesToCreate = ({
    initialGroups = [],
    newGroups = []
}) => {
    return newGroups.filter(newGroup => !initialGroups.includes(newGroup))
}
const getVehiclesIdsToDelete = ({
    initialVehicles = [],
    newVehicleList = []
}) => {
    // eslint-disable-next-line
    const newVehicleListIds = Array.isArray(newVehicleList) && newVehicleList.map(vehicle => Number(vehicle.value)) || [];
    // eslint-disable-next-line
    const initialVehiclesIds = Array.isArray(initialVehicles) && initialVehicles.map(group => Number(group.urn.split(":").pop())) || [];

    return initialVehiclesIds
        .map(initialVehicleId => {
            const duplicatedId = newVehicleListIds.find(newVehicleId => newVehicleId === initialVehicleId);
            if (!duplicatedId) return initialVehicleId;
            return false;
        })
        .filter(initialVehicleId => initialVehicleId)
}
const vehiclesIdsToCreateTagging = ({
    initialVehicles = [],
    newVehicleList = []
}) => {
    // eslint-disable-next-line
    const newVehicleListIds = Array.isArray(newVehicleList) && newVehicleList.map(vehicle => Number(vehicle.value)) || [];
    // eslint-disable-next-line
    const initialVehiclesIds = Array.isArray(initialVehicles) && initialVehicles.map(group => Number(group.urn.split(":").pop())) || [];

    return newVehicleListIds
        .map(newVehicleId => {
            const duplicatedId = initialVehiclesIds.find(initialVehicleId => initialVehicleId === newVehicleId);
            if (!duplicatedId) return newVehicleId;
            return false;
        })
        .filter(newVehicleId => newVehicleId)
}
export function groupDelete(group) {
    return {
        type: GROUP_DELETE,
        deleteGroup: removeExistingGroup,
        payload: {
            group
        }
    };
}

export function groupUpdateSuccess(group) {
    return {
        type: GROUP_UPDATE_SUCCESS,
        editGroups: editExistingGroups,
        payload: {
            group
        }
    };
}

export function groupUpdate(group) {
    return {
        type: GROUP_UPDATE,
        editGroups: editExistingGroups,
        payload: {
            group
        }
    };
}
export function groupChangeOperationStates({
    updateLoading = false,
    deleteLoading = false,
    deleteSuccess = false,
    deleteFail = false,
    editLoading = false,
    editSuccess = false,
    editFail = false,
    createLoading = false,
    createSuccess = false,
    createFail = false,
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
    resetSearchGroup = false,
}) {
    return {
        type: GROUP_CHANGE_OPERATION_STATES,
        payload: {
            updateLoading,
            deleteLoading,
            deleteSuccess,
            deleteFail,
            editLoading,
            editSuccess,
            editFail,
            createLoading,
            createSuccess,
            createFail,
            loadLoading,
            loadSuccess,
            loadFail,
            resetSearchGroup
        }
    };
}

export function groupUpdateFail(group) {
    return {
        type: GROUP_UPDATE_FAIL,
        editGroups: editExistingGroups,
        payload: {
            group
        }
    };
}
export function groupLoadSuccess({ tags, total }) {
    return {
        type: GROUP_LOAD_SUCCESS,
        payload: {
            groups: tags,
            total,
        }
    };
}
export function groupLoadTaggingByNameSuccess({ taggings = [], total = 0 }) {
    return {
        type: GROUP_LOAD_TAGGING_BY_NAME_SUCCESS,
        payload: {
            groups: taggings,
            total,
        }
    };
}



export function groupCreateSuccess(group) {
    return {
        type: GROUP_CREATE_SUCCESS,
        payload: {
            group
        }
    };
}


export const editGroupName = data => async dispatch => {
    try {

        const createURL = '/vehicle/v1/tagging';

        const userRenamedGroup = data.initialGroupName !== data.groupName;

        if (!userRenamedGroup) return dispatch(editGroup(data));

        dispatch(groupChangeOperationStates({ editLoading: true, }));

        const params = {
            taggings: []
        };

        const vehiclesIds = data.newVehicleList.map((vehicle) => vehicle.value);

        params.taggings = getTaggingPayloadToGroups({
            tagName: data.groupName,
            entitiesIds: vehiclesIds,
            organizationId: data.organization_id
        });

        await api.post(createURL, params);

        dispatch(groupChangeOperationStates({ editSuccess: true, }));

    } catch (error) {
        const hasErrMessage = !!error?.response?.data?.detail?.message;

        if (hasErrMessage) showErrorToUser("tagName: " + error?.response?.data?.detail?.message);

        dispatch(groupChangeOperationStates({ editFail: true, }));
    }
};

export const createGroup = data => async dispatch => {
    try {
        const URL = "/vehicle/v1/tagging";
        const params = data.params || {
            taggings: []
        }

        if (!data.params) {
            const entitiesIds = data.entities.map(entity => entity.value);
            params.taggings = getTaggingPayloadToGroups({
                // eslint-disable-next-line
                tagName: data.groupName.replace(/[\]\[`"/']/g, ""),
                entitiesIds,
                organizationId: data.organization_id
            });
        }

        dispatch(groupChangeOperationStates({ createLoading: true, }));

        await api.post(URL, params);

        dispatch(groupCreateSuccess(data));
        dispatch(groupChangeOperationStates({ createSuccess: true, }));

    } catch (error) {
        const hasErrMessage = !!error?.response?.data?.detail?.message;
        console.log(hasErrMessage);

        if (hasErrMessage) showErrorToUser("tagName:" + error?.response?.data?.detail?.message)

        dispatch(groupChangeOperationStates({ createFail: true, }));
    }
};

export const deleteVehiclesFromGroup = data => async dispatch => {
    try {
        const URL = "/vehicle/v1/tagging";
        const params = data.params || {
            taggings: []
        }
        if (!data.params) {
            const vehiclesIds = data.vehicles.map((vehicle) => vehicle.value);
            params.taggings = getTaggingPayloadToGroups({
                tagName: data.groupName,
                entitiesIds: vehiclesIds,
                organizationId: data.organization_id
            })
        }

        dispatch(groupChangeOperationStates({ deleteLoading: true, }))

        await api.delete(URL, { data: params })

        dispatch(groupCreateSuccess(data));
        dispatch(groupChangeOperationStates({ deleteSuccess: true, }))
    } catch (error) {
        dispatch(groupChangeOperationStates({ deleteFail: true, }))
    }
};

export const editVehicleGroups = data => async dispatch => {
    const isSameLength = data.selectedGroups.length === data.groups.length
    if (isSameLength) {
        const filteredSelectedGroups = data.groups.filter(tagName => data.selectedGroups.includes(tagName));
        const hasSameGroups = filteredSelectedGroups.length === data.groups.length;
        if (hasSameGroups) return;
    }
    const tagNamesToCreateTagging = getGroupsTagNamesToCreate({
        initialGroups: data.groups,
        newGroups: data.selectedGroups
    });
    const tagNamesToDelete = getGroupsTagNamesToDelete({
        initialGroups: data.groups,
        newGroups: data.selectedGroups
    });

    const payloadToCreateTag = {
        taggings: getTaggingPayloadToEntity({
            tagNames: tagNamesToCreateTagging,
            entityId: data.vehicle_id,
            organizationId: data.organization_id
        })
    }
    const payloadToDelete = {
        taggings: getTaggingPayloadToEntity({
            tagNames: tagNamesToDelete,
            entityId: data.vehicle_id,
            organizationId: data.organization_id
        })
    }

    const hasToCreateGroup = payloadToCreateTag.taggings.length > 0;
    const hasToDelete = payloadToDelete.taggings.length > 0;
    const promisses = [
        hasToCreateGroup && dispatch(createGroup({ params: payloadToCreateTag })),
        hasToDelete && dispatch(deleteVehiclesFromGroup({ params: payloadToDelete })),
    ].filter(promise => promise);
    await Promise.all(promisses);
};
export const editGroup = data => async dispatch => {

    const idsToCreateTagging = vehiclesIdsToCreateTagging({ ...data });

    const idsToDelete = getVehiclesIdsToDelete({ ...data });

    const payloadToCreateTag = {
        taggings: getTaggingPayloadToGroups({
            tagName: data.groupName,
            entitiesIds: idsToCreateTagging,
            organizationId: data.organization_id
        })
    };
    const payloadToDelete = {
        taggings: getTaggingPayloadToGroups({
            tagName: data.groupName,
            entitiesIds: idsToDelete,
            organizationId: data.organization_id
        })
    }

    const hasToCreateGroup = payloadToCreateTag.taggings.length > 0;
    const hasToDelete = payloadToDelete.taggings.length > 0;

    dispatch(groupChangeOperationStates({ editLoading: true, }));


    // eslint-disable-next-line
    const promisses = [
        hasToCreateGroup && dispatch(createGroup({ params: payloadToCreateTag })),
        hasToDelete && dispatch(deleteVehiclesFromGroup({ params: payloadToDelete })),
    ];

    await Promise.all(promisses);

    dispatch(groupChangeOperationStates({ editSuccess: true, }));
};

export const getTaggingByFilters = data => async dispatch => {
    dispatch(groupChangeOperationStates({ loadLoading: true, }));
    try {
        const params = [];
        const filters = {
            page: (val = 0) => params.push("page=" + val),
            // eslint-disable-next-line
            tagName: val => val && params.push("tagName=" + "*" + val + "*"),
            urn: val => val && params.push("urn=" + val),
        }

        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        const URL = "/vehicle/v1/tagging?perPage=1000&" + params.join("&");

        const {
            data: { taggings, totalItems }
        } = await api.get(URL)

        dispatch(groupLoadTaggingByNameSuccess({ taggings, total: totalItems }));
        dispatch(groupChangeOperationStates({ loadSuccess: true }));

    } catch (error) {
        console.log(error);
        dispatch(groupChangeOperationStates({ loadFail: true }));
    }
};
export const loadGroups = data => async dispatch => {

    try {
        const params = [];
        const filters = {
            urn: val => val && params.push("urn=" + val),
            limit: val => val && params.push("perPage=" + val),
            page: (val = 0) => params.push("page=" + val),
            // eslint-disable-next-line
            search_term: val => val && params.push("tagName=" + "*" + val + "*"),
            entity: val => val && params.push("resourceTypes=" + val),
        }

        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        const URL = "/vehicle/v1/tag?" + params.join("&");

        dispatch(groupChangeOperationStates({ loadLoading: true, }));

        const {
            data: { tags, totalItems }
        } = await api.get(URL);
        dispatch(groupLoadSuccess({ tags, total: totalItems }));
        dispatch(groupChangeOperationStates({ loadSuccess: true }));

    } catch (error) {
        console.log(error);
        dispatch(groupChangeOperationStates({ loadFail: true }));
    }
};
export const deleteGroup = data => async dispatch => {
    let URL = "/vehicle/v1/tag"
    const body = {
        tags: [
            {
                tagName: data.groupData.tagName,
            }
        ]
    };
    const hasRollback = !!data.groups?.length;

    const rollbackData = hasRollback && JSON.parse(JSON.stringify(data.groups));

    try {
        dispatch(groupDelete(data.groupData));
        dispatch(groupChangeOperationStates({ deleteLoading: true }));
        const {
            status
        } = await api.delete(URL, { data: body });

        const success = status === HTTP_STATUS.SUCCESS;

        if (success) return dispatch(groupChangeOperationStates({}));

    } catch (error) {

        if (hasRollback) dispatch(groupLoadSuccess({ tags: rollbackData, total: rollbackData.length }));

        dispatch(groupChangeOperationStates({ deleteFail: true }));
    }

};
