import {
  vehicleOn,
  vehicleOff,
  noSignal,
  noSignal24,
} from 'constants/environment'

export const VEHICLE_CHANGE_SELECTORS = "vehicle_change_selectors";
export const SET_SCHEDULE_VEHICLE = "set_schedule_vehicle";
export const SET_IDLE_VEHICLE = "set_idle_vehicle";
export const SET_SPEED_IN_KM_VEHICLE = "set_speed_in_km_vehicle";
export const VEHICLE_CREATE_SUCCESS = "vehicle_create_success";
export const VEHICLE_LOAD_SUCCESS = "vehicle_load_success";
export const VEHICLE_LOAD_ONE_SUCCESS = "vehicle_load_one_success";
export const VEHICLE_CHANGE_OPERATION_STATES = "vehicle_change_operation_states";
export const SELECT_VEHICLE_GROUPS = "select_vehicle_groups";
export const SET_VEHICLE_NOTIFICATION = "set_vehicle_notification";
export const SET_KM_EVENT_VEHICLE = "set_km_event_vehicle";
export const SET_VEHICLE_STAGE = "set_vehicle_stage";
export const VEHICLE_CHANGE_OPERATION_STATUS_STATES = "vehicle_change_operation_status_states";
export const VEHICLE_LOAD_SUCCESS_LAST_POINTS  = "vehicle_load_success_last_points";

const operationStates = {
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
  editLoading: false,
  editSuccess: false,
  editFail: false
}

const report_status_loading = {
  loadStatusLoading: false,
  loadStatusSuccess: false,
  loadStatusFail: false,
}

const vehicles_loading = {
  loadVehiclesLoading: false,
  loadVehiclesSuccess: false,
  loadVehiclesFail: false,
}

const staticStore = {
  vehicleTypes: [
    {
      value: 1,
      label: "Caminhão pequeno"
    }, {
      value: 2,
      label: "Caminhão grande"
    }, {
      value: 3,
      label: "Caminhonete"
    }, {
      value: 4,
      label: "Carro pequeno"
    }, {
      value: 5,
      label: "Carro grande"
    }, {
      value: 6,
      label: "Máquina"
    }, {
      value: 7,
      label: "Moto"
    }, {
      value: 8,
      label: "Ônibus pequeno"
    }, {
      value: 9,
      label: "Ônibus grande"
    }, {
      value: 10,
      label: "Van"
    }
  ],
  fuelTypes: [
    {
      value: 1,
      label: "Gasolina"
    }, {
      value: 2,
      label: "Etanol"
    }, {
      value: 3,
      label: "Diesel"
    }, {
      value: 4,
      label: "Gás natural"
    }, {
      value: 5,
      label: "Biodiesel"
    }, {
      value: 6,
      label: "Elétrico"
    }
  ],
  vehiclesTypesOnMap: [
    {
      label: "Carro",
      value: "carro"
    },
    {
      label: "Caminhão",
      value: "caminhao"
    },
    {
      label: "Caminhão Grande",
      value: "caminhao-grande"
    },
    {
      label: "Maquina",
      value: "maquina"
    },
    {
      label: "Motocicleta",
      value: "motocicleta"
    },
    {
      label: "Van",
      value: "van"
    },
  ],
  iconColors: [
    {
      value: "#785549",
      label: "Marrom"
    },
    {
      value: "#ED6C1F",
      label: "Laranja"
    },
    {
      value: "#D30915",
      label: "Vermelho"
    },
    {
      value: "#0264FF",
      label: "Azul"
    },
    {
      value: "#24A1E8",
      label: "Azul Claro"
    },
    {
      value: "#2EB50D",
      label: "Verde"
    },
    {
      value: "#4B7850",
      label: "Verde Escuro"
    },
    {
      value: "#AB1A58",
      label: "Rosa"
    },
    {
      value: "#8D2CA8",
      label: "Roxo"
    },
    {
      value: "#F5BE3B",
      label: "Amarelo"
    },
    {
      value: "#1A237A",
      label: "Contele"
    }
  ],
  backgroundColors: [
    {
      value: "#ffffff",
      label: "Branco"
    },
    {
      value: "#e62e0e",
      label: "Vermelho"
    },
    {
      value: "#0e40e6",
      label: "Azul"
    },
    {
      value: "#5ae60e",
      label: "Verde"
    },
    {
      value: "#e60eb0",
      label: "Rosa"
    },
    {
      value: "#9a0ee6",
      label: "Roxo"
    },
    {
      value: "#dfe60e",
      label: "Amarelo"
    },
    {
      value: "#000000",
      label: "Preto"
    }
  ]
}
const notificationEvents = {
  km: {
    app: false,
    email: false
  },
  speeding: {
    app: false,
    email: false
  },
  idleCar: {
    app: false,
    email: false
  },
  geoFence: {
    app: false,
    email: false
  },
  hoursOfUse: {
    app: false,
    email: false
  },
  unidentifiedDriver: {
    app: false,
    email: false
  }
}
const INITIAL_STATE = {
  vehicles: [],
  total: 0,
  selectedGroups: [],
  vehicleSchedule: {},
  vehicleIdle: {},
  vehicleSpeed: {},
  vehicleKmEvent: {},
  notificationEvents,
  vehiclesStage: {},
  weeklySelectedHoursOfUse: [],
  daylySelectedHoursOfUse: [],
  selectors: {
		icon_color: {value: '#1A237A'}, icon_background_color: {value: '#fff'}
	},
  searchedVehicle: {},
  pointsHistory: [],
  lastPoints: [],
  statusSummary: {
    [vehicleOn]: 0,
    [vehicleOff]: 0,
    [noSignal]: 0,
    [noSignal24]: 0,
  },
  ...staticStore,
  ...operationStates,
  ...report_status_loading,
  ...vehicles_loading,
};

export default function vehicles(state = INITIAL_STATE, action) {
  const actionTypes = {
    vehicle_change_selectors() {
      if (action.payload.reset) {
        return {
          ...state,
          selectors: {},
          vehicleSchedule: {},
          vehicleSpeed: {},
          vehicleIdle: {},
          vehicleKmEvent: {},
          notificationEvents,
          selectedGroups: [],
          vehiclesStage: {},
        }
      }
      return {
        ...state,
        selectors: {
          ...state.selectors,
          ...action.payload.selectors
        },
      };
    },
    set_schedule_vehicle() {
      return {
        ...state,
        vehicleSchedule: {
          schedule: action.payload.schedule,
          vehicle_id: action.payload.vehicle_id
        },
      };
    },
    set_idle_vehicle() {
      return {
        ...state,
        vehicleIdle: {
          idle: action.payload.idle,
          vehicle_id: action.payload.vehicle_id
        },
      };
    },
    set_speed_in_km_vehicle() {
      return {
        ...state,
        vehicleSpeed: {
          speed: action.payload.speed,
          vehicle_id: action.payload.vehicle_id
        },
      };
    },
    set_km_event_vehicle() {
      return {
        ...state,
        vehicleKmEvent: {
          km: action.payload.kmEvent,
          vehicle_id: action.payload.vehicle_id
        },
      };
    },
    vehicle_create_success() {
      return {
        ...state,
        vehicles: [...state.vehicles, action.payload.vehicle],
      };
    },
    vehicle_load_success() {
      return {
        ...state,
        ...action.payload
      };
    },
    vehicle_load_one_success() {
      return {
        ...state,
        searchedVehicle: action.payload.vehicle,
      };
    },
    vehicle_change_operation_states() {
      return {
        ...state,
        ...action.payload
      };
    },
    select_vehicle_groups() {
      return {
        ...state,
        selectedGroups: action.payload.groups
      };
    },
    set_vehicle_notification() {
      return {
        ...state,
        notificationEvents: { ...state.notificationEvents, ...action.payload.notificationEvents }
      };
    },
    set_vehicle_stage() {
      return {
        ...state,
        vehiclesStage: {
          stages: action.payload.stage,
          total: action.payload.total
        }
      }
    },
    vehicle_change_operation_status_states() {
      return {
        ...state,
        ...action.payload,
      }
    },
    vehicle_load_success_last_points() {
      return {
        ...state,
        ...action.payload,
      }
    }
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
