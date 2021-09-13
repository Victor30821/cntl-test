
export const SET_MAP_CONFIGURATION = "set_map_configuration";
export const SET_INDIVIDUAL_VEHICLE = "set_individual_vehicle";
export const SET_USER_LOCATION = "set_user_location";
export const SET_VEHICLE_ADDRESS = "set_vehicle_address";
export const SET_SEARCHED_ADDRESS = "set_searched_address";
export const SET_SEARCHED_ADDRESS_LATLNG = "set_searched_address_latlng";
export const SET_ROUTE = "set_route";
export const SET_ROUTES = "set_routes";
export const MAP_CHANGE_OPERATION_STATES = "map_change_operation_states";
export const SET_BEST_ROUTE = "set_best_route";
export const SET_MULTI_ADDRESSES = "set_multi_addresses";
export const SET_SEARCHED_ALL_ADDRESS_LATLNG = "set_searched_all_address_latlng";
export const SET_ADDRESS_INFO_WINDOW = "set_address_info_window";

const operationStates = {
    loadLoading: false,
    loadSuccess: false,
    loadFail: false,
    addressLoading: false,
    addressFail: false,
    addressSuccess: false,
    loadLoadingFromException: false
}
export const INITIAL_STATE = {
  ...operationStates,
  showTraffic: false,
  showGroups: false,
  showListVehicles: true,
  showIndividualVehicle: false,
  vehicleToShow: {},
  filters: {
      status: false,
      groups: false,
      text: false,
  },
  selectedGroups: [],
  searchedAddress: [],
  searchedAddressLatLng: [],
  vehicleAddress: {},
  route: {},
  routes: {
    allRoutes: [],
    currentRoute: {},
    coordinates: [],
  },
  infoWindowAddress: "",
};


export default function map(state = INITIAL_STATE, action) {

    const actionTypes = {
        set_best_route(){
            return {
                ...state,
                routes: {
                    ...state.routes,
                    coordinates: action.payload.coordinates || [],
                    start_location: action.payload.start_location || {},
                    end_location: action.payload.end_location || {},
                    waypoint_order: action.payload.waypoint_order || [],
                    legs: action.payload.legs || [],
                },
            }
        },
        set_routes() {
            const currentRoute = action.payload.routes?.currentRoute;
            const routeIndex = state.routes.allRoutes.findIndex(route => route?.id === currentRoute?.id)
            if (currentRoute?.routeIndex === undefined && routeIndex !== -1) currentRoute.routeIndex = routeIndex;

            return {
                ...state,
                routes: {
                    allRoutes: action.payload.routes?.allRoutes || state.routes?.allRoutes,
                    currentRoute: action.payload.routes?.currentRoute || state.routes?.currentRoute,
                },
            }
        },
        map_change_operation_states() {
            return {
                ...state,
                ...action.payload,
            }
        },
        set_route() {
            return {
                ...state,
                route: action.payload.route,
                url: action.payload.url
            }
        },
        set_map_configuration() {
            return {
                ...state,
                ...action.payload,
            }
        },
        set_individual_vehicle() {
            return {
                ...state,
                vehicleToShow: action.payload.vehicle,
            }
        },
        set_vehicle_address() {
            return {
                ...state,
                vehicleAddress: action.payload.vehicleAddress
            }
        },
        set_searched_address() {
            return {
                ...state,
                searchedAddress: action.payload.searchedAddress
            }
        },
        set_searched_address_latlng() {
            if (action.payload.clear) {
                state.searchedAddressLatLng = []
            } else {
                if (!action.payload.searchedAddressLatLng?.length) {
                    state.searchedAddressLatLng = [];
                }
                else {
                    state.searchedAddressLatLng.push(action.payload.searchedAddressLatLng);
                }
            }
            return {
                ...state,
                searchedAddressLatLng: state.searchedAddressLatLng
            }
        },
        set_searched_all_address_latlng() {
            if(action.payload.clear) {
                state.searchedAddressLatLng = []
                return {
                    ...state,
                }
            }
            return {
                ...state,
                ...action.payload,
            }
        },
        set_address_info_window() {
            return {
                ...state,
                ...action.payload,
            }
        }
    }

    if (actionTypes[action.type]) return actionTypes[action.type]();
    return state
}
