import { DEFAULT_NULL_VALUE } from "constants/environment";
import { localizedStrings } from "constants/localizedStrings";
import { format } from "date-fns";

export const LOGISTICS_SERVICES_CHANGE_OPERATION_STATES =
  "logistics_services_change_operation_states";
export const LOGISTICS_SERVICES_LOAD_SUCCESS =
  "logistics_services_load_success";
export const LOGISTICS_SERVICES_CHANGE_SELECTED =
  "logistics_services_change_selected";
export const LOGISTICS_SERVICES_SET_DESTINY = "logistics_services_set_destiny";
export const LOGISTICS_SERVICE_CHANGE_SELECTORS =
  "logistics_service_change_selectors";
export const LOGISTICS_SERVICES_REMOVE_ITEM_SERVICE_DRIVERS =
  "logistics_services_remove_item_service_drivers";
export const LOGISTICS_SERVICES_SET_SERVICE_PLACE =
  "logistics_services_set_service_place";
export const LOGISTICS_SERVICES_SET_DRIVER_DAY =
  "logistics_services_set_driver_day";
export const LOGISTICS_SERVICES_SET_PLACES = "logistics_services_set_places";
export const LOGISTICS_SERVICES_SET_SWITCH_GOING_RETURN =
  "logistics_services_set_switch_going_return";
export const LOGISTICS_SERVICES_SET_TYPE_LOGISTICS =
  "logistics_services_set_type_logistics";
export const LOGISTICS_SERVICES_SET_PROGRESS = "logistics_services_set_progress";
export const LOGISTICS_SERVICES_SET_STATUS_SERVICE = "logistics_services_set_status_service";
export const LOGISTICS_SERVICES_SET_SERVICE_ID = "logistics_services_set_service_id";
export const LOGISTICS_SERVICES_SET_INITIAL_STATE = "logistics_services_set_initial_state";
export const LOGISTICS_SERVICES_SET_ACTIVE_FIT_BOUNCE = "logistics_services_set_active_fit_bounce";
export const LOGISTICS_SERVICES_LOADING_DESTINTY = "logistics_services_loading_destinty";
export const LOGISTICS_SERVICES_LOADING_TYPE_SERVICE = "logistics_services_loading_type_service";
export const LOGISTICS_SERVICES_SET_MAP_VEHICLES = "logistics_services_set_map_vehicles";
export const LOGISTICS_SERVICES_LOADING_EXCEPTION_ZIPCODE = "logistics_services_loading_exception_zipcode";
export const LOGISTICS_SERVICES_LOADING_EXCEPTION = "logistics_services_loading_exception";
export const LOGISTICS_SERVICES_SET_EXCEPTION = "logistics_services_set_exception";
export const LOGISTICS_SERVICES_SET_EXPECTION_PLACE = "logistics_services_set_expection_place";
export const LOGISTICS_SERVICES_SET_CHANGE_SELECTOR_DAYS = "logistics_services_set_change_selector_days";
export const LOGISTICS_SERVICES_SET_SWITCH_MANUAL_DEPARTURE = "logistics_services_set_switch_manual_departure";
export const LOGISTICS_SERVICES_LOADING_LS_EXPORT_FORM = "logistics_services_loading_ls_export_form";
export const LOGISTICS_SERVICES_SET_ALL_LOGISTICS = "logistics_services_set_all_logistics";

const operationStates = {
  loadLoadingTypeService: false,
  loadSucessTypeService: false,
  loadFailTypeService: false,
  loadLoading: false,
  loadSuccess: false,
  loadFail: false,
  createLoading: false,
  createSuccess: false,
  createFail: false,
  editLoading: false,
  editSuccess: false,
  editFail: false,
  updateLoading: false,
  updateSuccess: false,
  updateFail: false,
  deleteLoading: false,
  deleteSuccess: false,
  deleteFail: false,

};

const loading_destiny = {
  loadLoadingDestiny: false,
  loadSucessDestiny: false,
  loadFailDestiny: false,
}

const loading_type_service = {
  loadLoadingTypeService: false,
  loadSucessTypeService: false,
  loadFailTypeService: false,
}

const loading_exception = {
  loadLoadingException: false,
  loadSucessException: false,
  loadFailException: false,
}

const loading_exception_zipcode = {
  loadLoadingZipCodeException: false,
  loadSucessZipCodeException: false,
  loadFailZipCodeException: false,
}

const loading_ls_export_form = {
  loadLoadingLSExportForm: false,
  loadSucessLSExportForm: false,
  loadFailLSExportForm: false,
}

const hours = [
  {
    label: "00h",
    value: "00:00:00",
  },
  {
    label: "01h",
    value: "01:00:00",
  },
  {
    label: "02h",
    value: "02:00:00",
  },
  {
    label: "03h",
    value: "03:00:00",
  },
  {
    label: "04h",
    value: "04:00:00",
  },
  {
    label: "05h",
    value: "05:00:00",
  },
  {
    label: "06h",
    value: "06:00:00",
  },
  {
    label: "07h",
    value: "07:00:00",
  },
  {
    label: "08h",
    value: "08:00:00",
  },
  {
    label: "09h",
    value: "09:00:00",
  },
  {
    label: "10h",
    value: "10:00:00",
  },
  {
    label: "11h",
    value: "11:00:00",
  },
  {
    label: "12h",
    value: "12:00:00",
  },
  {
    label: "13h",
    value: "13:00:00",
  },
  {
    label: "14h",
    value: "14:00:00",
  },
  {
    label: "15h",
    value: "15:00:00",
  },
  {
    label: "16h",
    value: "16:00:00",
  },
  {
    label: "17h",
    value: "17:00:00",
  },
  {
    label: "18h",
    value: "18:00:00",
  },
  {
    label: "19h",
    value: "19:00:00",
  },
  {
    label: "20h",
    value: "20:00:00",
  },
  {
    label: "21h",
    value: "21:00:00",
  },
  {
    label: "22h",
    value: "22:00:00",
  },
  {
    label: "23h",
    value: "23:00:00",
  },
];

const selected = {
  overview_selected: {
    type_selected: true,
    type_service_selected: {},
    wating_time_selected: "0min",
    clients_selected: {},
    vehicles_selected: {},
    days_of_weeks_selected: [],
    hour_going_selected: {},
    start_date_selected: format(new Date(), "yyyy-MM-dd"),
    end_date_selected: format(new Date(), "yyyy-MM-dd"),
    inicial_destiny_selected: {},
    end_destiny_selected: {},
    type_service_selected_modal: {},
    days_of_weeks_driver_selected: [],
    period_driver_selected: [],
    service_driver_selected: {},
  },
  stop_places: {
    client_selected: {},
    place_selected: {},
    tag_selected: {},
    identification_selected: {},
    exception_day_selected: new Date(),
  },
};

const periods = [
  {
    label: localizedStrings.morning,
    value: 'morning'
  },
  {
    label: localizedStrings.afternoon,
    value: 'afternoon'
  },
  {
    label: localizedStrings.evening,
    value: 'evening'
  },
  {
    label: localizedStrings.night,
    value: 'night'
  },
];

const days = [
  {
    label: "Dom",
    value: "sun",
  },
  {
    label: "Seg",
    value: "mon",
  },
  {
    label: "Ter",
    value: "tue",
  },
  {
    label: "Qua",
    value: "wed",
  },
  {
    label: "Qui",
    value: "thu",
  },
  {
    label: "Sex",
    value: "fri",
  },
  {
    label: "Sab",
    value: "sat",
  },
];

const selectors = {
  overview_selectors: {
    selector_type_service: [],
    selector_wating_time: [
      {
        label: "5min",
        value: 5,
      },
      {
        label: "10min",
        value: 10,
      },
      {
        label: "15min",
        value: 15,
      },
      {
        label: "20min",
        value: 20,
      },
      {
        label: "25min",
        value: 25,
      },
      {
        label: "30min",
        value: 30,
      },
      {
        label: "35min",
        value: 35,
      },
      {
        label: "40min",
        value: 40,
      },
      {
        label: "45min",
        value: 45,
      },
      {
        label: "50min",
        value: 50,
      },
      {
        label: "55min",
        value: 55,
      },
      {
        label: "60min",
        value: 60,
      },
    ],
    selector_clients: [],
    selector_vehicles: [],
    selector_inicial_destiny: [],
    selector_end_destiny: [],
    selector_days_of_weeks: days,
    selector_period_driver: periods,
    selector_hour_going: hours,
    selector_hour_return: hours,
    selector_days_of_weeks_driver: [],
  },
  stop_places: {
    selector_clients: [],
    selector_places: [],
    selector_identifications: [],
  },
};

const place_exception = {
  version: "v1",
  start_date: new Date(),
  end_date: new Date(),
  zipcode: "",
  address1: "",
  address2: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  lat: "",
  lng: "",
};

const INITIAL_STATE = {
  ...operationStates,
  manual_departure: false,
  logistics: [],
  logistic: {},
  total: 0,
  messageFail: "",
  selectors,
  selected,
  types_services: [],
  services_drivers: [],
  services_places: [],
  driver_day: { name: DEFAULT_NULL_VALUE },
  switchGoingReturn: false,
  places: [],
  progress: [],
  status_service: "",
  service_id: 0,
  execute_fit_bounce: false,
  loading_destiny,
  loading_type_service,
  loading_exception,
  loading_exception_zipcode,
  loading_ls_export_form,
  map_vehicle: {},
  place_exception,
  select_export_all_logistics: [],
};

export default function logisticsServices(state = INITIAL_STATE, action) {
  const actionTypes = {
    logistics_service_change_selectors() {
      return {
        ...state,
        selectors: {
          ...state.selectors,
          ...action.payload.selectors,
        },
      };
    },
    logistics_services_load_success() {
      return {
        ...state,
        ...action.payload,
        total: action.payload.total,
      };
    },
    logistics_services_change_operation_states() {
      return {
        ...state,
        ...action.payload,
      };
    },
    logistics_services_change_selected() {
      if (action.payload.reset) {
        return {
          ...state,
          selected,
          types_services: [],
          services_drivers: [],
          services_places: [],
          selector_identifications: [],
        };
      }
      return {
        ...state,
        selectors: state.selectors,
        selected: {
          ...state.selected,
          ...action.payload.selected,
        },
      };
    },
    logistics_services_set_destiny() {
      const {
        selector_inicial_destiny = [],
        selector_end_destiny = [],
      } = action.payload.selectors.overview_selectors;
      return {
        ...state,
        selectors: {
          stop_places: state.selectors.stop_places,
          overview_selectors: {
            ...state.selectors.overview_selectors,
            selector_inicial_destiny,
            selector_end_destiny,
          },
        },
        selected: state.selected,
      };
    },
    logistics_services_remove_item_service_drivers() {
      return {
        ...state,
        services_drivers: state.services_drivers.filter(
          (drivers) =>
            drivers.driver.driver_id !== action.payload.driver.driver.driver_id
        ),
      };
    },
    logistics_services_set_service_place() {
      action.payload.services_places.forEach((service, i) => (service.id = i));
      return {
        ...state,
        services_places: action.payload.services_places,
      };
    },
    logistics_services_set_driver_day() {
      return {
        ...state,
        driver_day: action.payload.driver_day,
      };
    },
    logistics_services_set_switch_going_return() {
      return {
        ...state,
        switchGoingReturn: action.payload.switchGoingReturn,
      };
    },
    logistics_services_set_places() {
      return {
        ...state,
        places: action.payload.places,
      };
    },
    logistics_services_set_type_logistics() {
      return {
        ...state,
        types_services: action.payload.types_services,
      };
    },
    logistics_services_set_progress() {
      return {
        ...state,
        progress: action.payload.progress,
      }
    },
    logistics_services_set_status_service() {
      return {
        ...state,
        status_service: action.payload.status_service
      }
    },
    logistics_services_set_service_id() {
      return {
        ...state,
        service_id: action.payload.service_id,
      }
    },
    logistics_services_set_initial_state() {
      return {
        ...state,
        ...INITIAL_STATE
      }
    },
    logistics_services_set_active_fit_bounce() {
      return {
        ...state,
        execute_fit_bounce: action.payload.execute_fit_bounce,
      }
    },
    logistics_services_loading_destinty() {
      return {
        ...state,
        loading_destiny: action.payload.loading_destiny
      }
    },
    logistics_services_loading_type_service() {
      return {
        ...state,
        loading_type_service: action.payload.loading_type_service
      }
    },
    logistics_services_set_map_vehicles() {
      return {
        ...state,
        map_vehicle: action.payload.map_vehicle
      }
    },
    logistics_services_loading_exception() {
      return {
        ...state,
        loading_exception: action.payload.loading_exception,
      }
    },
    logistics_services_loading_exception_zipcode() {
      return {
        ...state,
        loading_exception_zipcode: {
          ...action.payload.loading_exception_zipcode
        },
      }
    },
    logistics_services_set_exception() {
      return {
        ...state,
        place_exception: {
          ...state.place_exception,
          ...action.payload.place_exception,
        }
      }
    },
    logistics_services_set_change_selector_days() {
      return {
        ...state,
        selectors: {
          overview_selectors: {
            ...state.selectors.overview_selectors,
            selector_days_of_weeks: action.payload.clean_selector_days_of_weeks ? [] : days,
          },
          stop_places: state.selectors.stop_places,
        }
      }
    },
    logistics_services_set_switch_manual_departure() {
      return {
        ...state,
        ...action.payload,
      }
    },
    logistics_services_loading_ls_export_form() {
      return {
        ...state,
        loading_ls_export_form: {
          ...action.payload
        }
      }
    },
    logistics_services_set_all_logistics() {
      return {
        ...state,
        ...action.payload,
      }
    }
  };

  if (actionTypes[action.type]) return actionTypes[action.type]();
  return state;
}
