import {
    MAP,
    ROUTES,
    REPORT,
    FUEL,
    REGISTERS,
    CONSUMPTION,
    COSTS,
    KM,
    CHECKLIST,
    VEHICLE_STATUS,
    PRODUCTIVITY,
    AUDIT,
    EVENTS,
    DRIVERS,
    DRIVERS_PER_DAY,
    DRIVERS_PER_ROUTE,
    DRIVERS_ALL,
    VEHICLE,
    MANAGE,
    CREATE,
    GROUPS,
    FENCES,
    COMMANDS,
    USERS,
    CLIENTS,
    PLACES,
    SOLICITATIONS,
    LOGISTICS_SERVICES,
    LOGISTICS,
    USAGE_ACHIEVEMENT
} from "constants/paths";
import { localizedStrings } from "constants/localizedStrings";

export const MENU = 'menu';
export const SELECT_CURRENT_SCREEN = 'select_current_screen';
export const SELECT_CHILD_SCREEN = 'select_child_screen';
export const SHOW_SCREENS = 'show_screens';


const driversScreens = [
    { path: DRIVERS_PER_DAY, title: localizedStrings.driversPerDay, name: "perDay" },
    { path: DRIVERS_PER_ROUTE, title: localizedStrings.driversPerRoute, name: "perRoute" },
    { path: DRIVERS_ALL, title: localizedStrings.allDrivers, name: "all" }
];
const fuelScreens = [
    { path: REGISTERS, title: localizedStrings.registers, name: "registers" },
    { path: CONSUMPTION, title: localizedStrings.consumptionPerVehicle, name: "consumption" },
    { path: COSTS, title: localizedStrings.costsPerMonth, name: "costs" }
];
const reportsScreens = [
    { path: KM, title: localizedStrings.kmTitle, name: "km" },
    {
        path: FUEL,
        title: localizedStrings.fuels,
        hasToggle: true,
        screens: fuelScreens,
        name: "fuels"
    },
    { path: CHECKLIST, title: localizedStrings.checklist },
    { path: ROUTES, title: localizedStrings.routes },
    { path: VEHICLE_STATUS, title: localizedStrings.vehiclesStatus },
    { path: PRODUCTIVITY, title: localizedStrings.productivity },
    { path: EVENTS, title: localizedStrings.events },
    { path: AUDIT, title: localizedStrings.audit },
    {
        path: DRIVERS,
        title: localizedStrings.drivers,
        hasToggle: true,
        screens: driversScreens,
        name: "drivers"
    }
];

const all_services = [
    {path: LOGISTICS + MANAGE, title: localizedStrings.logisticService.allServices,name: "services",},
    {path: CLIENTS + MANAGE, title: localizedStrings.clients, name: "clients",},
    {path: PLACES + MANAGE, title: localizedStrings.places, name: "places", },
]

const INITIAL_STATE = {
    menuIsOpen: true,
    currentScreen: 0,
    selectedChildrenScreen: { depthOne: -1, depthTwo: -1 },
    menuScreens: [
        /*{
          path: DASHBOARD,
          icon: "productivity",
          title: localizedStrings.productivity
        },*/
        { path: MAP, icon: "map", title: localizedStrings.map, name: "map" },
        {
            path: REPORT,
            icon: "reports",
            title: localizedStrings.reports,
            hasToggle: true,
            screens: reportsScreens,
            name: "reports"
        },
        {
            path: VEHICLE + MANAGE,
            icon: "vehicle",
            title: localizedStrings.vehicles,
            name: "vehicles"
            /*hasToggle: true,*/
            /*screens: vehicleTabs*/
        },
        { path: GROUPS + MANAGE, icon: "groups", title: localizedStrings.groups, name: "groups"  },
        { path: FENCES + MANAGE, icon: "fence", title: localizedStrings.fences, name: "fences" },
        {
            path: COMMANDS + MANAGE, icon: "block", title: localizedStrings.block,
            name: "commands"
        },
        {
            path: DRIVERS + MANAGE,
            icon: "drivers",
            title: localizedStrings.drivers,
            name: "drivers"
        },
        {
            path: FUEL + CREATE, icon: "fuel", title: localizedStrings.fuel,
            name: "fuel"
        },
        {
            path: USERS + MANAGE, icon: "users", title: localizedStrings.users,
            name: "users"
        },
        {
            path: SOLICITATIONS + MANAGE, icon: "vehicle", title: localizedStrings.solicitations,
            name: "solicitations",
        },
        {
            path: LOGISTICS_SERVICES,
            icon: "map_pointer",
            title: localizedStrings.logisticService.logisticsService,
            hasToggle: true,
            hasIconTooltip: true,
            iconToolTip: "warning2",
            iconToolTipColor: "#FF9C41",
            iconToolTipText: localizedStrings.soon,
            screens: all_services,
            name: "allServices"
        },
        { path: USAGE_ACHIEVEMENT, name: "usage_achievement", headerMenu: true },
    ],
};



export default function users(state = INITIAL_STATE, action) {

    const actionTypes = {
        menu() { return { ...state, menuIsOpen: action.payload.menuIsOpen } },
        select_child_screen() {
            return {
                ...state,
                selectedChildrenScreen: {
                    ...action.payload.selectedChildrenScreen
                }
            }
        },
        select_current_screen() {
            return {
                ...state,
                currentScreen: action.payload.currentScreen,
            }
        },
        show_screens() {
            return {
                ...state,
                menuScreens: action.payload.editMenuScreens({
                    menuScreens: INITIAL_STATE.menuScreens,
                    showScreens: action.payload.screens
                }),
                currentScreen: INITIAL_STATE.currentScreen,
                selectedChildrenScreen: INITIAL_STATE.selectedChildrenScreen,
            }
        },
    }

    if (actionTypes[action.type]) return actionTypes[action.type]();
    return state
}
