import { localizedStrings } from 'constants/localizedStrings.js';

export const PRD_HOSTS = {
    "": true,
    "": true,
};

export const smsSettting = {
    
};

const host = window.location.host;

export const IS_PRD = PRD_HOSTS[host] === true

export const API_URL_TRACKINGS = IS_PRD ? "" : "";

export const URL_SMS = IS_PRD ? "" : "";

export const URL_WHATSAPP = "";

export const ADMIN_URL = IS_PRD ? "" : "";

export const API_URL = IS_PRD ? "" : "";

export const API_URL_PROXY = IS_PRD ? "" : "";

export const API_URL_MAP = IS_PRD ? "" : "";

export const API_KEY_MAP = IS_PRD ? "" : "";

export const API_KEY_MAP_GEOCODE = IS_PRD ? "" : "";

export const API_KEY_MAP_DIRECTIONS = IS_PRD ? "" : "";

export const CHANGELOGFY_APP_ID = "";

export const CRISP_APP_ID = "";

export const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    SUCCESS: 200,
    NOT_FOUND: 404,
};
export const REPORTS_LIMIT_PER_REQUEST = 10000
export const PER_PAGE_LENGTHS = ["200", "500", "1000"]
export const MAX_LIMIT_FOR_SELECTORS = 100000;
export const PLAY_STORE_APP_LINK = "https://play.google.com/store/apps/details?id=br.com.contelerastreadornovo";
export const PLAY_STORE_DRIVER_LINK = "https://play.google.com/store/apps/details?id=br.com.contelemotoristanovo";
export const APPLE_STORE_APP_LINK = "https://apps.apple.com/us/app/novo-contele-rastreador/id1531575287";
export const APPLE_STORE_DRIVER_LINK = "https://apps.apple.com/br/app/contele-driver/id1479229177";
export const APP_DRIVER_LINK = "https://linklist.bio/conteleapps";
export const [
    admin,
    manager,
    defaultUser,
    viewer,
    userWithPermissions
] = [1, 2, 3, 4, 5];

export const [
    vehicleOn,
    vehicleOff,
    noSignal,
    noSignal24,
	noCommunication,
    noUse,
    noModule,
] = [0, 1, 2, 3, 4, 5, 6];

export const vehiclesStatusTypes = {
    [vehicleOn]: {
        text: localizedStrings.vehicleTurnOn,
        textPlural: localizedStrings.vehiclesTurnOn,
        color: "#1DC9B7",
		icon: "dot",
    },
    [vehicleOff]: {
        text: localizedStrings.vehicleTurnOff,
        textPlural: localizedStrings.vehiclesTurnOff,
        color: "#BBBBBB",
		icon: "dot",
    },
    [noSignal]: {
        text: localizedStrings.vehicleNoSignal,
        textPlural: localizedStrings.vehiclesNoSignal,
        color: "#FFC241",
		icon: "dot",
    },
    [noSignal24]: {
        text: localizedStrings.vehicleNoSignalForMoreThen24Hours,
        textPlural: localizedStrings.vehiclesNoSignalForMoreThen24Hours,
        color: "#F87700",
		icon: "dot",
    },
    [noCommunication]: {
        text: localizedStrings.noCommunication,
        textPlural: localizedStrings.noCommunication,
        color: "#FF2C5E",
		icon: "warning",
    },
    [noUse]: {
        text: localizedStrings.vehicleNoUse,
        textPlural: localizedStrings.vehicleNoUse,
        color: "#C82CFF",
		icon: "dot",
    },
    [noModule]: {
        text: localizedStrings.vehicleNoModule,
        textPlural: localizedStrings.vehiclesNoModule,
        color: "#6C757D",
		icon: "dot",
    },
}
export const eventsIds = {
    SPEED: 1,
    IDLE: 2,
    FENCE_IN: 3,
    FENCE_OUT: 4,
    SENSOR2: 5,
    SENSOR3: 6,
    SENSOR4: 7,
    SENSOR5: 8,
    SCHEDULE: 9,
    SPEED_IN_FENCE1: 10,
    SPEED_IN_FENCE2: 11,
    KM: 12,
    FENCE: 13,
    POWER: 14,
    DRIVER_NOT_IDENTIFIED: 15
}
export const cordialDirections = {
    'N': 360,
    'NNE': 22.5,
    'NE': 45,
    'ENE': 67.5,
    'E': 90,
    'ESE': 112.5,
    'SE': 135,
    'SSE': 157.5,
    'S': 180,
    'SSW': 202.5,
    'SW': 225,
    'WSW': 247.5,
    'W': 270,
    'WNW': 292.5,
    'NW': 315,
    'NNW': 337.5,
}

export const moduleIdGV50 = 15;
export const moduleIdTM20 = 3;
export const moduleIdConcox = 17;

export const geocodeAccuracyThreshold = 0.98;

export const DEFAULT_NULL_VALUE = "-"
