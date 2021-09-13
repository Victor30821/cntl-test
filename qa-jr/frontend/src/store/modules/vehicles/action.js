import {
  VEHICLE_LOAD_SUCCESS,
  VEHICLE_LOAD_ONE_SUCCESS,
  VEHICLE_CHANGE_OPERATION_STATES,
  SET_VEHICLE_NOTIFICATION,
  SET_SPEED_IN_KM_VEHICLE,
  SET_IDLE_VEHICLE,
  SET_SCHEDULE_VEHICLE,
  VEHICLE_CHANGE_SELECTORS,
  SET_KM_EVENT_VEHICLE,
  SET_VEHICLE_STAGE,
  VEHICLE_CHANGE_OPERATION_STATUS_STATES,
  VEHICLE_LOAD_SUCCESS_LAST_POINTS
} from "./reducer";
import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import qs from "qs";
import {
  vehicleOn,
  vehicleOff,
  noSignal,
  noSignal24,
  noModule,
  noCommunication,
  noUse
} from 'constants/environment'
import { validateData } from "../helpers";
import { localizedStrings } from 'constants/localizedStrings.js';
import { api, mapApi } from "services/api";
import { editVehicleGroups, editDefaultDriver, } from 'store/modules'
import { toast } from "react-toastify";
import getSignalType from "utils/getSignalType";

function fetchLoadLastPoints({ pointsHistory, lastPoints, statusSummary }) {
  return {
    type: VEHICLE_LOAD_SUCCESS_LAST_POINTS,
    payload: {
      pointsHistory,
      lastPoints,
      statusSummary,
    }
  };
}

function fetchLoadSuccess({ vehicles, total }) {
  return {
    type: VEHICLE_LOAD_SUCCESS,
    payload: {
      vehicles,
      total,
    }
  };
}
function fetchLoadOneSuccess({ vehicle }) {
  return {
    type: VEHICLE_LOAD_ONE_SUCCESS,
    payload: {
      vehicle,
    }
  };
}
function setNotification(notificationEvents) {
  return {
    type: SET_VEHICLE_NOTIFICATION,
    payload: {
      notificationEvents
    }
  };
}
function setScheduleVehicle({ schedule, vehicle_id }) {
  return {
    type: SET_SCHEDULE_VEHICLE,
    payload: {
      schedule,
      vehicle_id
    }
  };
}
function setKmEventVehicle({ kmEvent, vehicle_id }) {
  return {
    type: SET_KM_EVENT_VEHICLE,
    payload: {
      kmEvent,
      vehicle_id
    }
  };
}
function setIdleVehicle({ idle, vehicle_id }) {
  return {
    type: SET_IDLE_VEHICLE,
    payload: {
      idle,
      vehicle_id
    }
  };
}
function setSpeedInKmVehicle({ speed, vehicle_id }) {
  return {
    type: SET_SPEED_IN_KM_VEHICLE,
    payload: {
      speed,
      vehicle_id
    }
  };
}

function vehicleStageLoadSuccess({ stage, total }) {
  return {
    type: SET_VEHICLE_STAGE,
    payload: {
      stage,
      total
    }
  };
}

const setNotificationEvents = notificationEvents => dispatch => dispatch(setNotification(notificationEvents))



function vehicleChangeSelectors({
  selectors
}, reset) {
  return {
    type: VEHICLE_CHANGE_SELECTORS,
    payload: {
      selectors,
      reset
    }
  };
}
function vehicleChangeOperationStates({
  loadLoading = false,
  loadSuccess = false,
  loadFail = false,
  createLoading = false,
  createSuccess = false,
  createFail = false,
  editLoading = false,
  editSuccess = false,
  editFail = false
}) {
  return {
    type: VEHICLE_CHANGE_OPERATION_STATES,
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
    }
  };
}

const vehicleChangeOperationStatusStates = ({
  loadStatusLoading = false,
  loadStatusSuccess = false,
  loadStatusFail = false,
}) => {
  return {
    type: VEHICLE_CHANGE_OPERATION_STATUS_STATES,
    payload: {
      loadStatusLoading,
      loadStatusSuccess,
      loadStatusFail,
    }
  }
}

const vehicleChangeOperationVehiclesStates = ({
  loadVehiclesLoading = false,
  loadVehiclesSuccess = false,
  loadVehiclesFail = false,
}) => {
  return {
    type: VEHICLE_CHANGE_OPERATION_STATUS_STATES,
    payload: {
      loadVehiclesLoading,
      loadVehiclesSuccess,
      loadVehiclesFail,
    }
  }
}
const configureMaxSpeed = ({
  speed,
  vehicle_id
}, dispatch) => dispatch(saveMaxSpeed({ speed, vehicle_id }));

const configureIdle = ({
  idle,
  vehicle_id
}, dispatch) => dispatch(saveIdle({ idle, vehicle_id }));

const configureSchedule = ({
  schedule,
  vehicle_id
}, dispatch) => dispatch(saveSchedule({ schedule, vehicle_id }));

const configureNotifications = ({
  notificationEvents,
  vehicle_id
}, dispatch) => dispatch(saveNotifications({ notificationEvents, vehicle_id }));

const configureKmEvent = ({
  kmTrigger,
  selectedKmTrigger,
  vehicle_id
}, dispatch) => dispatch(editKmEvent({ kmTrigger, selectedKmTrigger, vehicle_id }));

const configureGroups = ({
  groups,
  selectedGroups,
  vehicle_id,
  organization_id,
}, dispatch) => Array.isArray(groups) && dispatch(editVehicleGroups({
  groups: groups.map(group => group.tagName),
  selectedGroups: selectedGroups.map(group => group.value),
  vehicle_id,
  organization_id,
}))
const configureDefaultDriver = ({
  driver_id,
  vehicle_id,
  initialDriverId
}, dispatch) => dispatch(editDefaultDriver({
  vehicle_id,
  newDriverId: driver_id,
  initialDriverId,
}))

const getVehiclesStage = ({ onChange = () => { } }) => async dispatch => {
  const URL = "/vehicle/v1/stage";

  await api.get(URL).then(result => {
    const hasStages = result?.data?.stages;
    if (hasStages) {
      const stage = result.data.stages,
        total = result?.data?.total;

      dispatch(vehicleStageLoadSuccess({ stage, total }));
      dispatch(vehicleChangeOperationStates({ loadSuccess: true }));
      onChange(stage);
    }
    dispatch(vehicleChangeOperationStates({ loadFail: true }));
  }).catch(e => {
    console.log(e);
    dispatch(vehicleChangeOperationStates({ loadFail: true }));
  })
}

const createVehicle = (
  data,
  options = {
    showToast: false,
    ignoreSuccess: false
  }
) => async dispatch => {
  dispatch(vehicleChangeOperationStates({ createLoading: true }));
  try {
    const URL = "/vehicle/v1/";
    const params = {
      vehicles: [{
        status: data?.status ?? 1,
        organization_id: data.organization_id,
        liters_value: parseFloat(data?.liters_value),
        type_fuel_id: data?.type_fuel_id?.value,
        type_vehicle_id: data?.type_vehicle_id?.value,
        name: data?.name,
        model: data?.model,
        plate_number: data?.plate_number,
        tank_capacity: data?.tank_capacity,
        icon: data?.icon?.value,
        icon_color: data?.icon_color?.value,
        icon_background_color: data?.icon_background_color?.value,
        odometer: data?.odometer,
        email: data?.email?.map(elem => elem.value),
        documentation_url: data?.documentation_url,
        average_fuel_km: parseFloat(data?.average_fuel_km),
        year_manufacturer: data?.year_manufacturer?.value,
        manufacturer: data?.manufacturer,
      }]
    }
    const {
      data: { vehicles }
    } = await api.post(URL, qs.stringify(params))

    const [vehicle] = vehicles;

    const vehicle_id = vehicle.id;

    const requests = {
      speed: val => val && configureMaxSpeed({ speed: val, vehicle_id }, dispatch),
      idle: val => val && configureIdle({ idle: val, vehicle_id }, dispatch),
      schedule: val => val?.scheudle?.vehicle_usage_schedule && configureSchedule({ schedule: val, vehicle_id }, dispatch),
      notificationEvents: val => val && configureNotifications({ notificationEvents: val, vehicle_id }, dispatch),
      kmTrigger: val => val?.[0]?.name && configureKmEvent({ kmTrigger: [], selectedKmTrigger: val, vehicle_id }, dispatch),
      default_driver: val => val && configureDefaultDriver({ vehicle_id, driver_id: val?.value, }, dispatch),
      groups: val => Array.isArray(val) &&  configureGroups({
        groups: data.initialGroups,
        selectedGroups: val,
        vehicle_id,
        organization_id: data.organization_id,
      }, dispatch)
    }
    const promisses = Object.keys(data)
      .map(attr => requests?.[attr]?.(data?.[attr] ?? false))
      .filter(attr => attr);

    await Promise.all(promisses);

    if(!!options.ignoreSuccess)dispatch(vehicleChangeOperationStates({ createSuccess: true, }));
    if (options.showToast) toast.success(localizedStrings.success.create.vehicle);
    return { vehicle }
  } catch (error) {

    const is_conflict = String(error).includes("409");

    if(is_conflict) {
      if (options.showToast) toast.error(localizedStrings.error.update.plate_duplicated);
      dispatch(vehicleChangeOperationStates({ createFail: true, editFail: true }), options.ignoreSuccess = false);
      return { vehicle: {} };
    }

    if (options.showToast) toast.error(localizedStrings.error.create.vehicle);
    console.log(error)
    dispatch(vehicleChangeOperationStates({ createFail: true }));
    return { vehicle: {} };
  }
};

const updateVehicleStage = data => async dispatch => {
  dispatch(vehicleChangeOperationStates({ editLoading: true }));
  const URL = "/vehicle/v1/" + data.vehicle_id;
  const params = {
    vehicle: {
      stage_vehicle_id: data.stage_vehicle_id
    }
  }

  await api.put(URL, qs.stringify(params))
    .then(result => {
      console.log(result);
      dispatch(vehicleChangeOperationStates({ editSuccess: true, }));
    })
    .catch(e => {
      console.log(e);
      dispatch(vehicleChangeOperationStates({ editFail: true }));
    });
}

const updateVehicle = (
  data,
  options = {
    showToast: true,
    ignoreSuccess: false
  }
) => async dispatch => {
  dispatch(vehicleChangeOperationStates({ editLoading: true }));
  try {

    const URL = "/vehicle/v1/" + data.vehicle_id;
    const params = {
      vehicle: {
        status: data.status ?? 1,
        organization_id: data.organization_id,
        liters_value: data?.liters_value,
        type_fuel_id: data?.type_fuel_id?.value || data?.type_fuel_id,
        type_vehicle_id: data?.type_vehicle_id?.value,
        name: data?.name,
        model: data?.model,
        plate_number: data?.plate_number,
        tank_capacity: data?.tank_capacity,
        icon: data?.icon?.value,
        icon_color: data?.icon_color?.value,
        icon_background_color: data?.icon_background_color?.value,
        email: data?.email?.map?.(elem => elem.value),
        documentation_url: data?.documentation_url,
        average_fuel_km: data?.average_fuel_km,
        stage_vehicle_id: data?.stage_vehicle_id,
        year_manufacturer: data?.year_manufacturer?.value,
        manufacturer: data?.manufacturer,
      }
    }
    const {
      data: { vehicle }
    } = await api.put(URL, qs.stringify(params))
    const vehicle_id = vehicle?.id || data.vehicle_id;

    const requests = {
      speed: val => val && configureMaxSpeed({ speed: val, vehicle_id }, dispatch),
      idle: val => val && configureIdle({ idle: val, vehicle_id }, dispatch),
      schedule: val => val && configureSchedule({ schedule: val, vehicle_id }, dispatch),
      notificationEvents: val => val && configureNotifications({ notificationEvents: val, vehicle_id }, dispatch),
      kmTrigger: val => val?.[0]?.name && configureKmEvent({ kmTrigger: data.initialKmTrigger, selectedKmTrigger: val, vehicle_id }, dispatch),
      default_driver: val => val && configureDefaultDriver({ vehicle_id, driver_id: val?.value || data?.default_driver?.value, initialDriverId: data.initialDriverId, }, dispatch),
      groups: val => configureGroups({
        groups: data.initialGroups,
        selectedGroups: val,
        vehicle_id,
        organization_id: data.organization_id,
      }, dispatch)
    }
    const promisses = Object.keys(data)
      .map(attr => requests?.[attr]?.(data?.[attr] ?? false))
      .filter(attr => attr);

    await Promise.all(promisses);

    if (!options.ignoreSuccess) dispatch(vehicleChangeOperationStates({ editSuccess: true, createSuccess: true}));
    if (options.showToast) toast.success(localizedStrings.success.update.vehicle);

  } catch (error) {

    const is_conflict = String(error).includes("409");

    if(is_conflict) {
      toast.error(localizedStrings.error.update.plate_duplicated);
      dispatch(vehicleChangeOperationStates({ editFail: true , createFail: true}));
      return;
    }
    console.log(error);
    if (options.showToast) toast.error(localizedStrings.error.update.vehicle);
    dispatch(vehicleChangeOperationStates({ editFail: true }));

  }
};


const getKmTriggersToDelete = ({
  initialKmTriggers = [],
  newKmTriggers = []
}) => {
  return initialKmTriggers.filter(initialKmEvent => !newKmTriggers.find(newKm => {
    const [
      hasSameName,
      hasSameValue
    ] = [
        newKm.name === initialKmEvent.name,
        +newKm.value_in_km === +initialKmEvent.value_in_km
      ]
    return hasSameName && hasSameValue
  }))
}
const getKmTriggersToCreate = ({
  initialKmTriggers = [],
  newKmTriggers = []
}) => {
  return newKmTriggers.filter(newKmEvent => !initialKmTriggers.find(initialKm => {
    const [
      hasSameName,
      hasSameValue
    ] = [
        initialKm.name === newKmEvent.name,
        +initialKm.value_in_km === +newKmEvent.value_in_km
      ]
    return hasSameName && hasSameValue
  }))
}
const editKmEvent = data => async dispatch => {
  try {
    if (!Array.isArray(data.kmTrigger)) return;

    const kmEventsToCreate = getKmTriggersToCreate({
      initialKmTriggers: data.kmTrigger,
      newKmTriggers: data.selectedKmTrigger
    });
    const kmEventsIdsToDelete = getKmTriggersToDelete({
      initialKmTriggers: data.kmTrigger,
      newKmTriggers: data.selectedKmTrigger
    });

    const payloadToCreate = {
      kmTrigger: kmEventsToCreate,
      vehicle_id: data.vehicle_id
    }
    const payloadToDelete = {
      kmTrigger: kmEventsIdsToDelete,
      vehicle_id: data.vehicle_id
    }

    const hasToCreateGroup = payloadToCreate.kmTrigger.length > 0;
    const hasToDelete = payloadToDelete.kmTrigger.length > 0;

    const promisses = [
      hasToCreateGroup && dispatch(saveKmEvent(payloadToCreate)),
      hasToDelete && dispatch(removeKmEvent(payloadToDelete)),
    ].filter(promise => promise);

    await Promise.all(promisses);

  } catch (error) {
    console.log(error);
  }
};
const removeKmEvent = data => async dispatch => {
  try {
    const promisses = data.kmTrigger.map(kmEvent => {
      const URL = "/vehicle/v1/" + kmEvent.vehicle_id + "/km/" + kmEvent.id;
      return api.delete(URL);
    })
    await Promise.all(promisses)

  } catch (error) {
    console.log(error);
  }
};
const saveKmEvent = data => async dispatch => {
  const URL = "/vehicle/v1/" + data.vehicle_id + "/km";
  try {
    const kmObj = {
      km_triggers: data.kmTrigger.map(kmEvent => ({
        name: kmEvent?.name,
        value_in_km: kmEvent?.value_in_km,
      }))
    }

    await api.post(URL, qs.stringify(kmObj));

  } catch (error) {
    console.log(error);
  }
};


const loadNotifications = data => async dispatch => {
	const NOTIFICATION_TYPE_APP = 'app';
	const NOTIFICATION_TYPE_EMAIL = 'email';

  const URL = "/vehicle/v1/" + data.vehicle_id + "/notifications";
  try {
    const {
      data: { notifications }
    } = await api.get(URL);
    const newNotification = {
      km: {
        [NOTIFICATION_TYPE_APP]: true,
        [NOTIFICATION_TYPE_EMAIL]: true
      },
			power: {
				[NOTIFICATION_TYPE_APP]: true,
        [NOTIFICATION_TYPE_EMAIL]: true
			},
      speeding: {
        [NOTIFICATION_TYPE_APP]: true,
        [NOTIFICATION_TYPE_EMAIL]: true
      },
      idleCar: {
        [NOTIFICATION_TYPE_APP]: true,
        [NOTIFICATION_TYPE_EMAIL]: true
      },
      geoFence: {
        [NOTIFICATION_TYPE_APP]: true,
        [NOTIFICATION_TYPE_EMAIL]: true
      },
      hoursOfUse: {
        [NOTIFICATION_TYPE_APP]: true,
        [NOTIFICATION_TYPE_EMAIL]: true
      },
      unidentifiedDriver: {
        [NOTIFICATION_TYPE_APP]: true,
        [NOTIFICATION_TYPE_EMAIL]: true
      },
      sensor: {
        [NOTIFICATION_TYPE_APP]: false,
        [NOTIFICATION_TYPE_EMAIL]: false
      }
    }
    const triggerTypes = {
      speed_trigger: () => "speeding",
      km_trigger: () => "km",
      power_event_trigger: () => "power",
      vehicle_usage_trigger: () => "hoursOfUse",
      idle_time_trigger: () => "idleCar",
      fence_trigger: () => "geoFence",
      unidentified_driver: () => "unidentifiedDriver",
      sensor_trigger: () => "sensor",
    }

		const appNotification = notifications.find(notification =>
			notification.type_notification === NOTIFICATION_TYPE_APP
		);

		const emailNotification = notifications.find(notification =>
			notification.type_notification === NOTIFICATION_TYPE_EMAIL
		);

		if (appNotification) {
			Object.keys(appNotification).forEach(type => {
				const currentValue = appNotification[type] ? true : false;
				const triggerFunction = triggerTypes[type];

				if (!triggerFunction) return;

				const attribute = triggerFunction(currentValue, NOTIFICATION_TYPE_APP)
				newNotification[attribute] = {
					...newNotification[attribute],
					[NOTIFICATION_TYPE_APP]: !!currentValue
				}
			});

			Object.keys(emailNotification).forEach(type => {
				const currentValue = emailNotification[type] ? true : false;
				const triggerFunction = triggerTypes[type];

				if (!triggerFunction) return;

				const attribute = triggerFunction(currentValue, NOTIFICATION_TYPE_EMAIL)
				newNotification[attribute] = {
					...newNotification[attribute],
					[NOTIFICATION_TYPE_EMAIL]: !!currentValue
				}
			});
		}

    dispatch(setNotification(newNotification));
  } catch (error) {
    console.log(error);
  }
};

const saveNotifications = data => async dispatch => {
  const URL = "/vehicle/v1/" + data.vehicle_id + "/notifications";
  const selectedEvents = data.notificationEvents;
  try {
    const eventsTypes = ["email", "app"];
    const notificationsData = {
      notifications: eventsTypes.map(event => {
        return {
          type_notification: event,
          speed_trigger: +selectedEvents?.speeding[event] || 0,
          km_trigger: +selectedEvents?.km[event] || 0,
          sensor_trigger: +selectedEvents?.sensor[event] || 0,
          power_event_trigger: +selectedEvents?.power?.[event] || 0,
          vehicle_usage_trigger: +selectedEvents?.hoursOfUse?.[event] || 0,
          idle_time_trigger: +selectedEvents?.idleCar?.[event] || 0,
          fence_trigger: +selectedEvents?.geoFence?.[event] || 0,
          unidentified_driver: +selectedEvents?.unidentifiedDriver?.[event] || 0,
        }
      })
    }
    await api.put(URL, qs.stringify(notificationsData));

  } catch (error) {
    console.log(error);
  }
};


const saveSchedule = data => async dispatch => {

  const translate_day_of_week = {
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
    7: 'sun',
  }

  const URL = "/vehicle/v1/" + data.vehicle_id + "/schedule";
  try {
    dispatch(vehicleChangeOperationStates({ editLoading: true }))
    const vehicle_usage_schedule = data.schedule.vehicle_usage_schedule
      ?.map(schedule => {
      return {
        ...schedule,
        day_of_week: translate_day_of_week[schedule?.day_of_week]
      };
    });

    await api.post(URL, qs.stringify({ vehicle_usage_schedule }))

    dispatch(vehicleChangeOperationStates({}))

  } catch (error) {
    console.log(error);
    dispatch(vehicleChangeOperationStates({ editFail: true }));
  }
};


const saveIdle = data => async dispatch => {
  const URL = "/vehicle/v1/" + data.vehicle_id + "/idle";
  const params = {
    idle_trigger: {
      idle_time: data.idle,
      vehicle_id: data.vehicle_id,
    }
  }
  await api.post(URL, qs.stringify(params))
};


const saveMaxSpeed = data => async dispatch => {
  const URL = "/vehicle/v1/" + data.vehicle_id + "/speed";
  const params = {
    speed_trigger: {
      speed_in_km_h: data.speed
    }
  }
  await api.post(URL, qs.stringify(params))
};


const loadVehicleSchedule = data => async dispatch => {
  try {
    const URL = "/vehicle/v1/" + data.vehicle_id + "/schedule";

    const {
      data: { vehicle_usage_schedule }
    } = await api.get(URL, { params: data.params || {} })

    dispatch(setScheduleVehicle({
      schedule: vehicle_usage_schedule,
      vehicle_id: data.vehicle_id
    }));
    return vehicle_usage_schedule
  } catch (error) {
    console.log(error);
    return []
  }
};


const loadVehicleKmEvent = data => async dispatch => {
  try {
    const URL = "/vehicle/v1/" + data.vehicle_id + "/km";

    const {
      data: { km_triggers }
    } = await api.get(URL);

    dispatch(setKmEventVehicle({
      kmEvent: km_triggers,
      vehicle_id: data.vehicle_id
    }));

  } catch (error) {
    console.log(error);
  }
};


const loadVehicleIdle = data => async dispatch => {
  try {
    const URL = "/vehicle/v1/" + data.vehicle_id + "/idle";

    await api.get(URL)
      .then(result => {
        const idleObj = result?.data?.idle_trigger || [];
        dispatch(setIdleVehicle({
          idle: idleObj?.idle_time,
          vehicle_id: idleObj?.vehicle_id
        }));
      })

  } catch (error) {
    console.log(error);
  }
};


const loadVehicleSpeed = data => async dispatch => {
  try {
    const URL = "/vehicle/v1/" + data.vehicle_id + "/speed";
    await api.get(URL)
      .then(result => {
        const speedObj = result?.data?.speed_trigger || [];
        dispatch(setSpeedInKmVehicle({
          speed: speedObj?.speed_in_km_h,
          vehicle_id: speedObj?.vehicle_id
        }));
      })
  } catch (error) {
    console.log(error);
  }
};

const orderByLastPosition = (a, b) => {
	if (!a.timestamp) return 1;
	if (!b.timestamp) return -1;

	return new Date(b.timestamp) - new Date(a.timestamp);
}

const loadMapVehicles = data => async (dispatch) => {
  dispatch(vehicleChangeOperationStates({ loadLoading: true, }));
  try {
    const params = [];
    if(data.limit && data?.role_id === 2) delete data.vehicle_id;
    const filters = {
      limit: (val = true) => params.push("limit=" + !!val),
      vehicle_id: (val) => params.push("vehicle_id=" + val),
      best_route: (val) => params.push("best_route=" + val),
    };

    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false));
    const URL = "/api/v1/last-points?" + params.join("&");

    const {
      data: { last_points: pointsHistory }
    } = await mapApi.get(URL);
    const statusSummary = {
      [vehicleOn]: 0,
      [vehicleOff]: 0,
      [noSignal]: 0,
      [noSignal24]: 0,
      [noCommunication]: 0,
      [noUse]: 0,
      [noModule]: 0,
    }

    const history = (typeof pointsHistory === 'object' && !pointsHistory.length && [pointsHistory]) || pointsHistory;
    const qtyPoints = history.length;
    const { user_settings } = JSON.parse(
      window.localStorage.getItem("user_settings")
    );
    const { timezone } = user_settings;
    const lastPoints = history
      .map?.(vehicleObj => {
        try {
          const has_last_postions = !!vehicleObj?.last_positions?.vehicle_id || vehicleObj?.last_positions?.length > 0;
            if (has_last_postions === false) {
              statusSummary[noModule] += 1;
              return {
                driver: vehicleObj.driver || {},
                vehicle: vehicleObj.vehicle,
                status: noModule,
              };
          }

          const lastPositions = JSON.parse(JSON.stringify(vehicleObj?.last_positions))?.pop?.() || vehicleObj?.last_positions;
          const { timestamp, speed, ignition } = lastPositions;


          if (lastPositions?.length === 0) {
            statusSummary[noModule] += 1;
            return {
              driver: vehicleObj.driver || {},
              vehicle: vehicleObj.vehicle,
              status: noModule
            }
          }

          if (timestamp === undefined || timestamp === null) return;
          const timezonedData = utcToZonedTime(timestamp, timezone);
          const formattedDate = format(timezonedData, `dd/MM/yyyy HH:mm`, { timeZone: timezone });
          const [date, hour] = formattedDate.split(" ")

          const status = getSignalType({
            timestamp,
            ignition,
            speed,
            justOneVehicleOnMap: qtyPoints === 1,
			stage_vehicle_id: vehicleObj?.vehicle?.stage_vehicle_id,
          });
          statusSummary[status] += 1;
          const penultimatePosition = (!data.limit && vehicleObj.last_positions?.[vehicleObj.last_positions.length - 2]) || null;
          const lastPosition = (!data.limit && vehicleObj.last_positions?.[vehicleObj.last_positions.length - 1]) || null;
          const pointsfromDirection = (!data.limit && Array.isArray(vehicleObj.last_positions) && { before: penultimatePosition, after: lastPosition }) || vehicleObj?.pointsfromDirection;
          return {
            ...lastPositions,
            pointsfromDirection: pointsfromDirection,
            lat: parseFloat(lastPositions.lat),
            lng: parseFloat(lastPositions.lng),
            date,
            hour,
            lastRegister: new Date(timestamp),
            status,
            driver: vehicleObj.driver,
            vehicle: vehicleObj.vehicle,
          };
        } catch (error) {
          console.log(error)
        }
      })
      .filter?.(vehicleObj => vehicleObj)
      .sort?.(orderByLastPosition) || [];

    dispatch(fetchLoadLastPoints({ pointsHistory, lastPoints, statusSummary }));
    dispatch(vehicleChangeOperationStates({ loadSuccess: true }));
    return { pointsHistory, lastPoints, statusSummary }
  } catch (error) {
    console.debug(error);
    dispatch(vehicleChangeOperationStates({ loadFail: true }));
  }
};

const loadVehicles = data => async (dispatch) => {
  dispatch(vehicleChangeOperationVehiclesStates({ loadVehiclesLoading: true, }));
  try {
    const params = [];
    const filters = {
      organization_id: val => val && params.push("organization_id=" + val),
      vehicle_id: val => val && params.push("vehicle_id=" + val),
      limit: val => val && params.push("limit=" + val),
      offset: (val = 0) => params.push("offset=" + val),
      search_term: val => val && params.push("search_term=" + val),
      status: val => val && params.push("status=" + val),
      sort: val => val && params.push("sort=" + val),
    }

    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

    const URL = "/vehicle/v1?" + params.join("&");

    const {
      data: { vehicles, total }
    } = await validateData(api.get(URL), "vehicles");

    dispatch(fetchLoadSuccess({ vehicles, total }));
    dispatch(vehicleChangeOperationVehiclesStates({ loadVehiclesSuccess: true, }));
    return { vehicles, total }
  } catch (error) {
    dispatch(vehicleChangeOperationVehiclesStates({ loadVehiclesFail: true }));
  }
};

const loadOneVehicle = data => async (dispatch) => {
  try {
    const URL = '/vehicle/v1/' + data.vehicle_id;

    dispatch(vehicleChangeOperationStates({ loadLoading: true, }));

    const {
      data: { vehicle }
    } = await api.get(URL);
    dispatch(fetchLoadOneSuccess({ vehicle }));
    dispatch(vehicleChangeOperationStates({ loadSuccess: true, }));

  } catch (error) {
    dispatch(vehicleChangeOperationStates({ loadFail: true }));
    console.log(error);
  }
};

const loadReportVehiclesStatus = data => async (dispatch) => {
  dispatch(vehicleChangeOperationStatusStates({ loadStatusLoading: true, }));
  try {
    const params = [];
    const filters = {
      organization_id: val => val && params.push("organization_id=" + val),
      vehicle_id: val => val && params.push("vehicle_id=" + val),
      limit: val => val && params.push("limit=" + val),
      offset: (val = 0) => params.push("offset=" + val),
      search_term: val => val && params.push("search_term=" + val),
      status: val => val && params.push("status=" + val),
    }

    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

    const URL = "/vehicle/v1?" + params.join("&");
    const URL_TAGGING = `/vehicle/v1/tagging`;

    const urn = `v0:cgv:vehicle:${data?.organization_id}:*`;

		const params_tagging = {
			urn,
			perPage: 1000,
		}

    const {
      data: { vehicles, total }
    } = await validateData(api.get(URL), "vehicles");

    const [
			{ data: { taggings = [] } },
		] = await Promise.all([
			api.get(URL_TAGGING, { params: params_tagging })
    ]);

    const tags_by_vehicle = taggings?.map(tag => {
			const [, , , , vehicle_id] = tag?.urn?.split(":");
			return {
				vehicle_id: Number(vehicle_id),
				tag_name: tag?.tagName || "",
			}
    })

    const vehiclesList = vehicles.map(vehicle => {
			const groups = tags_by_vehicle
				?.filter(tags => tags?.vehicle_id === vehicle?.id)
				?.map(tag => tag.tag_name)
        ?.join(",");

			return {
        ...vehicle,
        vehicle_groups: groups
			}
    });

    dispatch(fetchLoadSuccess({ vehicles: vehiclesList, total }));
    dispatch(vehicleChangeOperationStatusStates({ loadStatusSuccess: true, }));
  } catch (error) {
    dispatch(vehicleChangeOperationStatusStates({ loadStatusFail: true }));
  }
};


export {
  createVehicle,
  loadMapVehicles,
  loadVehicles,
  loadOneVehicle,
  loadVehicleSpeed,
  loadVehicleIdle,
  loadVehicleKmEvent,
  loadVehicleSchedule,
  loadNotifications,
  updateVehicle,
  saveMaxSpeed,
  saveNotifications,
  saveSchedule,
  saveIdle,
  setNotificationEvents,
  vehicleChangeSelectors,
  vehicleChangeOperationStates,
  vehicleStageLoadSuccess,
  getVehiclesStage,
  updateVehicleStage,
  removeKmEvent,
  loadReportVehiclesStatus
}
