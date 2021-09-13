import {
  TRACKER_LOAD_SUCCESS,
  TRACKER_LOAD_ONE_SUCCESS,
  TRACKER_CHANGE_OPERATION_STATES,
  TRACKER_CHANGE_SELECTORS,
  SEND_SMS
} from "./reducer";
import { api, smsAPI } from "services/api";
import { smsSettting } from 'constants/environment';
import qs from 'qs';

export function trackerChangeOperationStates({
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
    type: TRACKER_CHANGE_OPERATION_STATES,
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
function fetchLoadSuccess({ trackers = [], total = 0 }) {
  return {
    type: TRACKER_LOAD_SUCCESS,
    payload: {
      trackers,
      total,
    }
  };
}
function fetchLoadOneSuccess({ tracker }) {
  return {
    type: TRACKER_LOAD_ONE_SUCCESS,
    payload: {
      tracker,
    }
  };
}

export function trackerChangeSelectors({
  selectors
}, reset) {
  return {
    type: TRACKER_CHANGE_SELECTORS,
    payload: {
      selectors,
      reset
    }
  };
}

const sendSMSCommand = ({ loading }) => {
  return {
    type: SEND_SMS,
    payload: {
      loadingSendSMS: loading,
    }
  };
}


export const loadTrackers = data => async (dispatch) => {
  dispatch(trackerChangeOperationStates({ loadLoading: true, }));
  try {
    const params = [];
    const filters = {
      organization_id: val => val && params.push("organization_id=" + val),
      vehicle_id: val => val && params.push("vehicle_id=" + val),
      limit: val => val && params.push("limit=" + val),
      offset: (val = 0) => params.push("offset=" + val),
      status: (val = 0) => params.push("status=" + val),
      search_term: val => val && params.push("search_term=" + val),
    }
    Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))

    const URL = "/tracker/v1?" + params.join("&");

    const {
      data: { trackers, total }
    } = await api.get(URL)

    dispatch(fetchLoadSuccess({ trackers, total }));
    dispatch(trackerChangeOperationStates({ loadSuccess: true, }));
    return trackers
  } catch (error) {
    dispatch(trackerChangeOperationStates({ loadFail: true }));
    return []
  }
};

export const updateTracker = ({
  tracker_id,
  vehicle_id,
  serial_number,
  phone_number,
  status,
  organization_id,
  type_tracker_id,
  phone_carrier_id,
  has_identification_driver,
}) => async (dispatch) => {

  const tracker = {
    vehicle_id: vehicle_id,
    serial_number: serial_number,
    status: status,
    has_identification_driver: has_identification_driver,
    organization_id: organization_id,
    type_tracker_id: type_tracker_id,
    phone_carrier_id: phone_carrier_id,
  }

  try {
    const URL = "/tracker/v1/" + tracker_id

    const {
      data: { tracker: responseTracker }
    } = await api.put(URL, { tracker })

    return responseTracker
  } catch (error) {
    console.log(error);
    return false
  }
};

export const changeVehicleFromTracker = ({
  new_vehicle_id_for_tracker,
  tracker_id,
  tracker: trackerData,
  organization_id,
}) => async (dispatch) => {

    try {


      if (tracker_id) {

        const {
          data: { tracker }
        } = await api.get("/tracker/v1/" + tracker_id);

        trackerData = tracker;
      }
      tracker_id = trackerData.id

      const URL = "/tracker/v1/" + tracker_id;

      trackerData = {
        vehicle_id: new_vehicle_id_for_tracker,
        serial_number: trackerData.serial_number,
        phone_number: trackerData.phone_number,
        status: 1,
        has_identification_driver: trackerData.has_identification_driver,
        organization_id,
        type_tracker_id: trackerData.type_tracker_id,
      }


      const {
        data: { tracker: responseTracker }
      } = await api.put(URL, {
        tracker: trackerData
      });

      return responseTracker
    } catch (error) {
      console.log(error);
      return false
    }
  };


export const loadOneTracker = data => async (dispatch) => {
  dispatch(trackerChangeOperationStates({ loadLoading: true, }));
  try {
    const URL = "/tracker/v1/" + data.tracker_id;

    const {
      data: { tracker }
    } = await api.get(URL)

    dispatch(fetchLoadOneSuccess({ tracker }));
    dispatch(trackerChangeOperationStates({ loadSuccess: true, }));
  } catch (error) {
    dispatch(trackerChangeOperationStates({ loadFail: true }));
  }
};

export const sendSMS = data => async dispatch => {
  try {
    dispatch(sendSMSCommand({ loading: true }));
    const URL = `/tracker/v1/?vehicle_id=${data.vehicle_id}`;

    const {
      data: { trackers }
    } = await api.get(URL);
    const [tracker] = trackers;

    if (!tracker?.type_tracker_id) return;

    const message = {
      3: '##',
      15: 'AT+GTRTO=gv50,E,07,3,,,,FFFF$',
      17: '#PARAM'
    };

    const params = {
      ...smsSettting,
      msgtext: message[tracker?.type_tracker_id],
      phone: `55${tracker.phone_number.replace(/\s/g, "").replace('-', '')}`,
      originator: 'Contele'
    };

    await smsAPI.post('/bulksms/bulksend.go', qs.stringify(params));
    dispatch(sendSMSCommand({ loading: false }));
    console.log(tracker);
  } catch (error) {
    console.log(error)
  }
};
