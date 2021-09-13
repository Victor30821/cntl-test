import populateSelects from "constants/populateSelects";

import {
    DASHBOARD_PATH,
    SETTINGS_PATH,
    MAP_PATH,
    MAP_ROUTES_PATH,
    LOGIN_PATH,
    VEHICLES_MANAGE_PATH,
    VEHICLES_CREATE_PATH,
    VEHICLES_EDIT_PATH,
    GROUPS_MANAGE_PATH,
    GROUPS_CREATE_PATH,
    GROUPS_EDIT_PATH,
    FENCES_MANAGE_PATH,
    FENCES_CREATE_PATH,
    FENCES_EDIT_PATH,
    COMMANDS_MANAGE_PATH,
    DRIVERS_MANAGE_PATH,
    DRIVERS_CREATE_PATH,
    DRIVERS_EDIT_PATH,
    USERS_MANAGE_PATH,
    USERS_CREATE_PATH,
    USERS_EDIT_PATH,
    REPORT,
    FINANCIAL_MANAGE_PATH,
    CLIENTS_MANAGE_PATH,
    CLIENTS_CREATE_PATH,
    CLIENTS_EDIT_PATH,
    PLACES_MANAGE_PATH,
    PLACES_CREATE_PATH,
    PLACES_EDIT_PATH,
    LOGISTICS_SERVICES_PATH,
    LOGISTICS_SERVICES_CREATE_PATH,
    LOGISTICS_SERVICES_EDIT_PATH,
    SOLICITATIONS_MANAGE_PATH,
    SOLICITATIONS_EDIT_PATH,
    LOGISTICS_SERVICES,
    USAGE_ACHIEVEMENTS_PATH
} from "constants/paths";
import { admin, manager, defaultUser, viewer, userWithPermissions } from "constants/environment";

const userWithoutAccess = { access: false }
const userWithoutAccessScreens = { screens: [] }
const defaultPaths = [
    LOGIN_PATH,
]
const allUsersScreens = [
    USERS_MANAGE_PATH,
    USERS_CREATE_PATH,
    USERS_EDIT_PATH,
]
const allDriversScreens = [
    DRIVERS_MANAGE_PATH,
    DRIVERS_CREATE_PATH,
    DRIVERS_EDIT_PATH,
];
const allFencesScreens = [
    FENCES_MANAGE_PATH,
    FENCES_CREATE_PATH,
    FENCES_EDIT_PATH,
];
const allGroupsScreens = [
    GROUPS_MANAGE_PATH,
    GROUPS_CREATE_PATH,
    GROUPS_EDIT_PATH,
];
const allVehiclesScreens = [
    VEHICLES_MANAGE_PATH,
    VEHICLES_CREATE_PATH,
    VEHICLES_EDIT_PATH,
];
const allMapScreens = [
    MAP_PATH,
    MAP_ROUTES_PATH,
];

const allClientsScreens = [
    CLIENTS_MANAGE_PATH,
    CLIENTS_CREATE_PATH,
    CLIENTS_EDIT_PATH,
];

const allSolicitationsScreens = [
    SOLICITATIONS_MANAGE_PATH,
    SOLICITATIONS_EDIT_PATH,
];

const allPlacesScreens = [
    PLACES_MANAGE_PATH,
    PLACES_CREATE_PATH,
    PLACES_EDIT_PATH,
];

const allLogistics = [
    LOGISTICS_SERVICES_PATH,
    LOGISTICS_SERVICES_CREATE_PATH,
    LOGISTICS_SERVICES_EDIT_PATH,
]

const allAchievementsScreens = [
    USAGE_ACHIEVEMENTS_PATH
]

const accessByType = {
    [admin]: [
        ...defaultPaths,

        ...allUsersScreens,

        // FUEL_CREATE_PATH,

        ...allDriversScreens,

        ...allFencesScreens,

        ...allGroupsScreens,

        ...allVehiclesScreens,

        ...allMapScreens,

        ...allAchievementsScreens,

        REPORT,

        DASHBOARD_PATH,

        SETTINGS_PATH,

        ...allClientsScreens,

        ...allSolicitationsScreens,

        ...allPlacesScreens,

        ...allLogistics,

        LOGISTICS_SERVICES
    ],
    [manager]: [
        ...defaultPaths,

        ...allUsersScreens,

        // FUEL_CREATE_PATH,

        ...allDriversScreens,

        COMMANDS_MANAGE_PATH,

        ...allFencesScreens,

        ...allGroupsScreens,

        ...allVehiclesScreens,

        ...allMapScreens,

        REPORT,

        FINANCIAL_MANAGE_PATH,

        DASHBOARD_PATH,

        SETTINGS_PATH,

        ...allClientsScreens,

        ...allSolicitationsScreens,

        ...allPlacesScreens,

        ...allLogistics,

        LOGISTICS_SERVICES,

        ...allAchievementsScreens,

    ],
    [defaultUser]: [
        ...defaultPaths,

        ...allMapScreens,

        USERS_EDIT_PATH,

        REPORT,
    ],
    [viewer]: [

        ...allMapScreens,

    ],
    [userWithPermissions]: [

        ...defaultPaths,

        ...allMapScreens,

        USERS_EDIT_PATH,

        REPORT,

        VEHICLES_MANAGE_PATH,

        VEHICLES_EDIT_PATH,

        DRIVERS_MANAGE_PATH,

        DRIVERS_EDIT_PATH,

    ]
}
export const verifyUserAccess = ({
    role_id,
    path
}) => {
    try {
        const roleIdExists = accessByType?.[role_id]?.length;

        if (!roleIdExists || !path) return userWithoutAccess;

        const userHasAccess = accessByType[role_id].some(allowedPath => path.toLowerCase().match(allowedPath.toLowerCase()));

        return {
            access: userHasAccess,
        }
    } catch (error) {
        console.log(error);
        return userWithoutAccess;
    }
}
export const getUsersScreens = ({
    role_id,
}) => {
    const roleIdExists = accessByType?.[role_id]?.length;

    if (!roleIdExists) return userWithoutAccessScreens;

    return {
        screens: accessByType[role_id],
    }
}
export const getUserRole = ({
    role_id,
}) => {
    const [role] = populateSelects.type.filter(role => role.value === role_id)

    if (!role) return false;

    return {
        role: role?.label
    }
}
