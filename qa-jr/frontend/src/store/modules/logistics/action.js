import {
    LOGISTICS_SERVICES_CHANGE_OPERATION_STATES,
    LOGISTICS_SERVICES_LOAD_SUCCESS,
    LOGISTICS_SERVICES_CHANGE_SELECTED,
    LOGISTICS_SERVICES_SET_DESTINY,
    LOGISTICS_SERVICE_CHANGE_SELECTORS,
    LOGISTICS_SERVICES_REMOVE_ITEM_SERVICE_DRIVERS,
    LOGISTICS_SERVICES_SET_SERVICE_PLACE,
    LOGISTICS_SERVICES_SET_DRIVER_DAY,
    LOGISTICS_SERVICES_SET_PLACES,
    LOGISTICS_SERVICES_SET_SWITCH_GOING_RETURN,
    LOGISTICS_SERVICES_SET_TYPE_LOGISTICS,
    LOGISTICS_SERVICES_SET_PROGRESS,
    LOGISTICS_SERVICES_SET_STATUS_SERVICE,
    LOGISTICS_SERVICES_SET_SERVICE_ID,
    LOGISTICS_SERVICES_SET_INITIAL_STATE,
    LOGISTICS_SERVICES_SET_ACTIVE_FIT_BOUNCE,
    LOGISTICS_SERVICES_LOADING_DESTINTY,
    LOGISTICS_SERVICES_LOADING_TYPE_SERVICE,
    LOGISTICS_SERVICES_SET_MAP_VEHICLES,
    LOGISTICS_SERVICES_SET_EXCEPTION,
    LOGISTICS_SERVICES_LOADING_EXCEPTION_ZIPCODE,
    LOGISTICS_SERVICES_SET_CHANGE_SELECTOR_DAYS,
    LOGISTICS_SERVICES_SET_SWITCH_MANUAL_DEPARTURE,
    LOGISTICS_SERVICES_LOADING_LS_EXPORT_FORM,
    LOGISTICS_SERVICES_SET_ALL_LOGISTICS
} from './reducer';
import { localizedStrings } from 'constants/localizedStrings.js';
import { api, mapApi } from 'services/api';
import { MAX_LIMIT_FOR_SELECTORS, HTTP_STATUS } from 'constants/environment.js'
import { toast } from 'react-toastify';
import { format } from "date-fns";
import qs from 'qs';

const status_colors = {
  not_started: '#222',
  in_progress: '#0795FA',
  paused: '#FAA628',
  finished: '#22C414',
  inactive: '#FF3D3D',
}

const convert_status = {
  not_started: localizedStrings.logisticService.convert_status.not_started,
  in_progress: localizedStrings.logisticService.convert_status.in_progress,
  paused: localizedStrings.logisticService.convert_status.paused,
  finished: localizedStrings.logisticService.convert_status.finished,
  inactive: localizedStrings.logisticService.convert_status.inactive
}

export const logisticsServicesChangeOperationStates = ({
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
    createLoading = false,
    createSuccess = false,
    createFail = false,
    editLoading = false,
    editSuccess = false,
    editFail = false,
    deleteLoading = false,
    deleteSuccess = false,
    deleteFail = false,
    loadLoadingTypeService = false,
    loadSucessTypeService = false,
    loadFailTypeService = false,
    loadLoadingException = false,
    loadSucessException = false,
    loadFailException = false,
    loadLoadingZipCodeException = false,
    loadSucessZipCodeException = false,
    loadFailZipCodeException = false,
  }) => {
    return {
      type: LOGISTICS_SERVICES_CHANGE_OPERATION_STATES,
      payload: {
        loadLoadingTypeService,
        loadSucessTypeService,
        loadFailTypeService,
        loadLoading,
        loadSuccess,
        loadFail,
        createLoading,
        createSuccess,
        createFail,
        editLoading,
        editSuccess,
        editFail,
        deleteLoading,
        deleteSuccess,
        deleteFail,
      }
    };
  }

  export const fetchLoadSuccess = ({ services_drivers = [] ,logistics = [], logistic = {}, types_services = [], total = 0 }) => {
    return {
      type: LOGISTICS_SERVICES_LOAD_SUCCESS,
      payload: {
        services_drivers,
        logistics,
        logistic,
        types_services,
        total,
      },
    };
  }

  export const setServicePlace = ({ services_places = [] }) => {
    return {
      type: LOGISTICS_SERVICES_SET_SERVICE_PLACE,
      payload: {
        services_places,
      }
    }
  }

  export const fetchRemoveItemFromServiceDrivers = ({ driver }) => {
    return {
      type: LOGISTICS_SERVICES_REMOVE_ITEM_SERVICE_DRIVERS,
      payload: {
        driver,
      }
    }
  }

  export const logisticsChangeSelected = ({ selected }) => {
    return {
      type: LOGISTICS_SERVICES_CHANGE_SELECTED,
      payload: {
        selected,
      }
    };
  }

  export const logisticsChangeSelectors = ({ selectors }) => {
    return {
      type: LOGISTICS_SERVICE_CHANGE_SELECTORS,
      payload: {
        selectors,
      }
    };
  }

  export function setDestiny({ selectors }) {
    return {
        type: LOGISTICS_SERVICES_SET_DESTINY,
        payload: {
            selectors
        }
    };
  }

  export function setDriverDay({ driver_day }) {
    return {
      type: LOGISTICS_SERVICES_SET_DRIVER_DAY,
      payload: {
        driver_day
      }
    }
  }

  export function setPlaces({ places }) {
    return {
      type: LOGISTICS_SERVICES_SET_PLACES,
      payload: {
        places
      }
    }
  }

  export function setSwitchGoingReturn({ switchGoingReturn }) {
    return {
      type: LOGISTICS_SERVICES_SET_SWITCH_GOING_RETURN,
      payload: {
        switchGoingReturn
      }
    }
  }

  export function setTypeLogistics({ types_services }) {
    return {
      type: LOGISTICS_SERVICES_SET_TYPE_LOGISTICS,
      payload: {
        types_services
      }
    }
  }

  export function setProgress({ progress }) {
    return {
      type: LOGISTICS_SERVICES_SET_PROGRESS,
      payload: {
        progress
      }
    }
  }

  export function setStatusService({ status_service }) {
    return {
      type: LOGISTICS_SERVICES_SET_STATUS_SERVICE,
      payload: {
        status_service
      }
    }
  }

  export function setServiceId({ service_id }) {
    return {
      type: LOGISTICS_SERVICES_SET_SERVICE_ID,
      payload: {
        service_id
      }
    }
  }

  export function setInitialState() {
    return {
      type: LOGISTICS_SERVICES_SET_INITIAL_STATE,
      payload: {},
    }
  }

  export function setActiveFitBounce({ execute_fit_bounce }) {
    return {
      type: LOGISTICS_SERVICES_SET_ACTIVE_FIT_BOUNCE,
      payload: {
        execute_fit_bounce
      }
    }
  }

  export function setLoadingDestiny({
    loadLoadingDestiny = false,
    loadSucessDestiny = false,
    loadFailDestiny = false,
  }){
    return {
      type: LOGISTICS_SERVICES_LOADING_DESTINTY,
      payload: {
        loading_destiny: {
          loadLoadingDestiny,
          loadSucessDestiny,
          loadFailDestiny,
        }
      }
    }
  }

  export function setLoadingTypeService({
    loadLoadingTypeService = false,
    loadSucessTypeService = false,
    loadFailTypeService = false,
  }){
    return { 
      type: LOGISTICS_SERVICES_LOADING_TYPE_SERVICE,
      payload: {
        loading_type_service: {
          loadLoadingTypeService,
          loadSucessTypeService,
          loadFailTypeService,
        }
      }
    }
  }

  export function setMapVehicle({ map_vehicle }) {
    return {
      type: LOGISTICS_SERVICES_SET_MAP_VEHICLES,
      payload: {
        map_vehicle,
      }
    }
  }

  export function setLoadingZipcode({
    loadLoadingZipCodeException = false,
    loadSucessZipCodeException = false,
    loadFailZipCodeException = false,
  }){
    return {
      type: LOGISTICS_SERVICES_LOADING_EXCEPTION_ZIPCODE,
      payload: {
        loading_exception_zipcode: {
          loadLoadingZipCodeException,
          loadSucessZipCodeException,
          loadFailZipCodeException,
        }
      }
    }
  }

  export function setServicesException({ place_exception }) {
    return {
      type: LOGISTICS_SERVICES_SET_EXCEPTION,
      payload: {
        place_exception
      }
  }
}

  export function setChangeSelectorDaysOfWeeks({ clean_selector_days_of_weeks }) {
    return {
      type: LOGISTICS_SERVICES_SET_CHANGE_SELECTOR_DAYS,
      payload: {
        clean_selector_days_of_weeks
      }
    }
  }

  export function setSwichManualDeparture({ manual_departure }) {
    return {
      type: LOGISTICS_SERVICES_SET_SWITCH_MANUAL_DEPARTURE,
      payload: { 
        manual_departure,
      }
    }
  }

  export function loadLSExportForm({ 
    loadLoadingLSExportForm = false,
    loadSucessLSExportForm = false,
    loadFailLSExportForm = false,
   }) {
     return {
       type: LOGISTICS_SERVICES_LOADING_LS_EXPORT_FORM,
       payload: {
        loadLoadingLSExportForm,
        loadSucessLSExportForm,
        loadFailLSExportForm,
       }
     }
   }

   export function setSelectExportAllLogistics({ select_export_all_logistics }) {
     return {
       type: LOGISTICS_SERVICES_SET_ALL_LOGISTICS,
       payload: {
        select_export_all_logistics
       }
     }
   }

export const loadLogisticsServices = data => async (dispatch) => {
  dispatch(logisticsServicesChangeOperationStates({ loadLoading: true, }));
  try {

    const params = [];

    const filters = {
      offset: (val = 0) => params.push("offset=" + val),
      limit: val => val && params.push("limit=" + val),
      search_term: val => val && params.push("search_term=" + val),
      driver_ids: val => val && params.push("driver_ids=" + val),
      place_ids: val => val && params.push("place_ids=" + val),
      client_ids: val => val && params.push("client_ids=" + val),
      service_ids: val => val && params.push("service_ids=" + val),
      status: val => val && params.push("status=" + val),
    }

    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

    const URL = "/logistics/v1?" + params.join("&");

    const { data: { logistics = [], total = 0 } } = await api.get(URL);
    
    // eslint-disable-next-line
    logistics.map(logistic => {

      logistic.vehicle_name = "";
      logistic.driver_name = "";
      logistic.client_name = "";

      const has_status = logistic.status && logistic.status.length > 0;
      if(has_status) {
        logistic.status_color = status_colors[logistic.status] || "#22C414";
        logistic.status_filter = convert_status[logistic.status] || "Concluido";
      }

      const has_driver = Array.isArray(logistic.drivers) && logistic.drivers.length > 0;
      if(has_driver) {
        const [driver = {}] = logistic.drivers;
        const drivers_quantity = (logistic.drivers.length) - 1;
        const plus_drivers = drivers_quantity === 0 ? "" : ` +${drivers_quantity}`
        logistic.driver_name = driver?.name + plus_drivers;
      }

      const start_date_formated = format(new Date(logistic.start_date), "dd/MM/yyyy");
      const end_date_formated = format(new Date(logistic.end_date), "dd/MM/yyyy");

      logistic.start_end_formated = `${start_date_formated} ${localizedStrings.logisticService.until} ${end_date_formated}`;

      logistic.vehicle_name = logistic.vehicles?.map?.(vehicle => vehicle.name)?.join?.(", ");

      logistic.client_name = logistic.clients?.map?.(client => client.name)?.join?.(", ");

      logistic.name_type = logistic.type === "departure" ? logistic.name + ` (${localizedStrings.logisticService.going})` : logistic.name +  ` (${localizedStrings.logisticService.goback})`;

    });

    dispatch(fetchLoadSuccess({ logistics, total }));
    dispatch(logisticsServicesChangeOperationStates({ loadSuccess: true, }));

  } catch (error) {
    console.log('[error] error loadLogisticsServices: ' + error);
    dispatch(logisticsServicesChangeOperationStates({ loadFail: true }));
  }
}

export const deleteLogisticsServices = data => async (dispatch) => {
  dispatch(logisticsServicesChangeOperationStates({ deleteLoading: true, }));
  try {

    const { 
      id = 0,
      offset = 0,
      limit = 0,
      organization_id = 0,
      search_term = "", 
      status = data.status === 'active'?'inactive':'active'
    } = data;

    const URL = "/logistics/v1/" + id;

    await api.delete(URL);

    toast.success(localizedStrings.logisticService.service_edit.sucess)

    dispatch(logisticsServicesChangeOperationStates({ deleteSuccess: true, }));

  } catch (error) {
    toast.error(localizedStrings.logisticService.error.deleteService);
    dispatch(logisticsServicesChangeOperationStates({ deleteFail: true }));
  }
}

export const loadTypeServices = data => async (dispatch) => {
  dispatch(setLoadingTypeService({ loadLoadingTypeService: true }));
  try {

    const params = [];

    const filters = {
      offset: (val = 0) => params.push("offset=" + val),
      limit: val => val && params.push("limit=" + val),
      organization_id: val => val && params.push("organization_id=" + val),
      search_term: val => val && params.push("search_term=" + val),
    }

    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

    const URL = "/logistics/v1/type?" + params.join("&");

    const { data: { types = [] } } = await api.get(URL);

    dispatch(setTypeLogistics({ types_services: types }));
    dispatch(setLoadingTypeService({ loadSucessTypeService: true }));
  } catch (error) {
    dispatch(setLoadingTypeService({ loadFailTypeService: true }));
  }
}

export const loadDestiny = data => async dispatch => {
  dispatch(setLoadingDestiny({ loadLoadingDestiny: true, }));
  try {

    const params = [];

    const filters = {
      client_ids: val => val && params.push("client_ids=" + val),
      limit: val => val && params.push("limit=" + val),
      offset: (val = 0) => params.push("offset=" + val),
    }

    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

    const defaultParams = params.join("&");

    const URL_PLACES = "place/v1?" + defaultParams;

    const { data: { places } } = await api.get(URL_PLACES);

    const destiny_places = places?.map(place => ({ label: place.name, value: place }));

    const selectors = {
      overview_selectors: {
        selector_inicial_destiny: destiny_places,
        selector_end_destiny: destiny_places
      }
    }

    dispatch(setDestiny({ selectors }));
    dispatch(setLoadingDestiny({ loadSucessDestiny: true, }));
  } catch (error) {
    dispatch(setLoadingDestiny({ loadFailDestiny: true, }));
  }
}

export const createTypeService = data => async (dispatch) => {
  dispatch(setLoadingTypeService({ loadLoadingTypeService: true }));
  try {

    const { name, organization_id ,idle_time } = data;

    const URL = "logistics/v1/type";

    const params = {
      types: [{
        name,
        idle_time,
      }]
    }

    await api.post(URL, qs.stringify(params));

    toast.success(localizedStrings.logisticService.type_service_create.sucess_create_service);
    dispatch(setLoadingTypeService({ loadSucessTypeService: true }));
    dispatch(loadTypeServices({
      limit: MAX_LIMIT_FOR_SELECTORS,
      offset: 0,
      search_term: "",
      organization_id
    }));
  } catch (error) {
    toast.error(localizedStrings.logisticService.type_service_create.error_create_type_service);
    dispatch(setLoadingTypeService({ loadFailTypeService: true }));
  }
}

const setPlacesOnClients = ({ clients, places }) => {
  return clients.map(client => {
    const place = places.filter(p => p.client_id === client.id);
    const has_place = place !== undefined;
    client.place = [];
    if(has_place) client.place = place;
    return client;
  });
}

export const loadStopPlacesSelectors = data => async (dispatch) => {
  dispatch(logisticsServicesChangeOperationStates({ loadSuccess: true }));
  try {

    const params = [];

    const filters = {
      client_ids: val => val && params.push("client_ids=" + val),
      limit: val => val && params.push("limit=" + val),
      offset: (val = 0) => params.push("offset=" + val),
    }

    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

    const defaultParams = params.join("&");

    const URL_CLIENTS = "/client/v1?" + defaultParams;

    const URL_PLACES = "/place/v1?" + defaultParams;

    const { data: { clients } } = await api.get(URL_CLIENTS);

    const { data: { places } } = await api.get(URL_PLACES);

    const clients_with_places = setPlacesOnClients({ clients, places });

    const places_for_selectos = places.map(place => ({ label: `${place?.name}`,  value: place?.identification, place: { ...place } }));

    const identification_for_selectos = places.map(place => ({ label: `${place?.identification}`,  value: place?.identification, place: { ...place } }));
    
    const clients_for_selectors = clients_with_places.map(client => ({ label: client.company_name, value: client }));

    const selectors = {
      stop_places: {
        selector_clients: clients_for_selectors,
        selector_places: places_for_selectos,
        selector_identifications: identification_for_selectos,
      }
    };

    dispatch(logisticsChangeSelectors({ selectors }));

  } catch (error) {
    console.log('[error] on getting places and clients: ' + error);
  }
}

export const createLogisticService = data => async (dispatch) => {
  dispatch(logisticsServicesChangeOperationStates({ createLoading: true }));
  try {

    const { logistics = [] } = data;

    const URL = 'logistics/v1';
    
    const params = { logistics };

    await api.post(URL, params);

    dispatch(logisticsServicesChangeOperationStates({ createSuccess: true, }));
    toast.success(localizedStrings.logisticService.service_create.sucess);
  } catch (error) {
    toast.error(localizedStrings.logisticService.service_create.error);
    dispatch(logisticsServicesChangeOperationStates({ createFail: true }));
  }
}


export const editLogisticService = data => async (dispatch) => {
  dispatch(logisticsServicesChangeOperationStates({ editLoading: true }));
  try {

    const { logistic = {} } = data;

    const id = logistic.id;

    const URL = 'logistics/v1/' + id;

    delete logistic.id;
    
    const params = { logistic };

    await api.put(URL, params);

    dispatch(logisticsServicesChangeOperationStates({ editSuccess: true, }));
    toast.success(localizedStrings.logisticService.service_edit.sucess);
  } catch (error) {
    toast.error(localizedStrings.logisticService.service_edit.error);
    dispatch(logisticsServicesChangeOperationStates({ editFail: true }));
  }
}

export const getProgressLogisticsService = data => async (dispatch) => {
  try {

    const today = new Date();

    const today_format = format(today, "yyyy-MM-dd");

    const {
      limit = 50,
      service_id = 0,
      date = ""
    } = data;

    const has_date = date?.length > 0;

    let URL = "";

    if(has_date) URL = `/logistics/v1/progress?limit=${limit}&service_id=${service_id}&offset=0&date=${date}`;

    if(has_date === false) URL = `/logistics/v1/progress?limit=${limit}&service_id=${service_id}&offset=0&date=${today_format}`;

    const { data: { progress = [] } } = await api.get(URL);

    dispatch(setProgress({ progress }));
    
  } catch (error) {
    console.log('[error] error on getting progress: ' + error);
    toast.error(localizedStrings.logisticService.error.progressError);
  }
}

 
export const loadRouteMapVehicle = data => async (dispatch) => {
  try {

    const params = [];

    const filters = {
      vehicle_id: val => val && params.push("vehicle_id=" + val),
      limit: (val = true) => params.push("limit=" + !!val),
    }

    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false));

    const URL = "/api/v1/last-points?" + params.join("&");

      const {
        data: { last_points: map_vehicle_obj }
      } = await mapApi.get(URL);

      const has_last_positions = Array.isArray(map_vehicle_obj?.last_positions) && map_vehicle_obj?.last_positions.length > 0;

      const map_vehicle = {
        driver: map_vehicle_obj.driver || {},
        vehicle: map_vehicle_obj?.vehicle || {},
        last_positions: [],
        first_position: {lat: 0 , lng: 0},
      };

      if(has_last_positions) {

        const last_positions_order = map_vehicle_obj?.last_positions
          .sort((a, b) =>  new Date(b.timestamp) - new Date(a.timestamp))
          .map(position => ({ lat: position.lat, lng: position.lng }));

        const [first_position={}] = map_vehicle_obj?.last_positions;

        map_vehicle.last_positions = last_positions_order;

        map_vehicle.first_position = first_position;
        
      }

      dispatch(setMapVehicle({ map_vehicle }));

  } catch (error) {
    console.log(error);
  }
};

export const searchZipCodeException = data => async dispatch => {

  dispatch(setLoadingZipcode({ loadLoadingZipCodeException: true }));
  const { zipCode } = data;
  const errorFlag = "<error>";

  const [viacep, widenet] = [0, 1];
  const URLs = {
      [viacep]: `https://viacep.com.br/ws/${zipCode}/json/`,
      [widenet]: `https://apps.widenet.com.br/busca-cep/api/cep/${zipCode}.json`,
  }


  const addressParser = (rawAddress, index) => {
      
      const parsedAddress = {
          address: null,
          neighborhood: null,
          city: null,
          state: null
      }

      const zipcodeApisParser = {
          [viacep]: rawAddress => {
              parsedAddress.address1 = rawAddress?.logradouro;
              parsedAddress.neighborhood = rawAddress?.bairro;
              parsedAddress.city = rawAddress?.localidade;
              parsedAddress.state = rawAddress?.uf;
              return true
          },
          [widenet]: rawAddress => {
              parsedAddress.address1 = rawAddress?.address;
              parsedAddress.neighborhood = rawAddress?.district;
              parsedAddress.city = rawAddress?.city;
              parsedAddress.state = rawAddress?.state;
              return true
          },
      }

      if (!zipcodeApisParser?.[index]?.(rawAddress)) return dispatch(setLoadingZipcode({ loadFailZipCodeException: true }));

      dispatch(setLoadingZipcode({ loadSucessZipCodeException: true }));
      dispatch(setServicesException({ place_exception: parsedAddress }));
      return;
  }



  const getAddress = async (url = false, index) => {
      try {
          if (!url) throw errorFlag;

          const result = await api.get(url);

          if (!result || result?.data?.status === HTTP_STATUS.NOT_FOUND || result?.data?.erro) return getAddress(URLs[index + 1], index + 1);

          addressParser(result?.data ?? {}, index);

      } catch (error) {
          dispatch(setLoadingZipcode({ loadFailZipCodeException: true }));
      }
  }
  getAddress(URLs[viacep], viacep);
}

export const loadAllServiceLogistics = data => async (dispatch) => {
  try {

    dispatch(loadLSExportForm({ loadLoadingLSExportForm: true }));

    const params = {
      offset: 0,
      limit: Number.MAX_SAFE_INTEGER,
      status: "active",
    };

    const URL = "/logistics/v1";

    const { data: { logistics = [] } } = await api.get(URL, { params });

    const select_export_all_logistics = logistics?.map(l => ({ label: l.name, value: l.id, }));

    select_export_all_logistics.unshift({ label: localizedStrings.logisticService.all, value: 0 });

    dispatch(setSelectExportAllLogistics({ select_export_all_logistics }));

    dispatch(loadLSExportForm({ loadSucessLSExportForm: true }));
    
  } catch (error) {
    dispatch(loadLSExportForm({ loadLoadingLSExportForm: true }));
    console.error(error);
  }
}