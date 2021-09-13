import {
  vehicleOn,
  vehicleOff,
  noSignal,
    noSignal24,
    noCommunication,
    noUse,
} from "constants/environment";

import { differenceInBusinessDays, differenceInMinutes } from "date-fns";

let isFirstRefresh = true;

const getSignalType = ({ timestamp, ignition, speed, justOneVehicleOnMap, stage_vehicle_id }) => {
  const VEHICLE_WORKING_STAGE = 1;

  if (stage_vehicle_id > VEHICLE_WORKING_STAGE) {
	  return noUse;
  }

  let useAlternativeShadowAreaTimeout = justOneVehicleOnMap && !isFirstRefresh;
  const ONE_DAY = 24 * 60;
  const ONE_HOUR = 60;
  const VEHICLE_SHADOW_AREA_TIMEOUT = useAlternativeShadowAreaTimeout ? 5 : 60;
  const THREE_BUSINESS_DAYS = 3;
  
  if (justOneVehicleOnMap) isFirstRefresh = false;
  else isFirstRefresh = true
  const signalDiffInMinutes = differenceInMinutes(
    new Date(),
    new Date(timestamp)
  );

  const signalDiffInBusinessDay = differenceInBusinessDays(
	new Date(),
    new Date(timestamp)
  );

  if (!ignition || (signalDiffInMinutes > ONE_HOUR && speed < 10)) return vehicleOff;

  if (signalDiffInBusinessDay >= THREE_BUSINESS_DAYS) return noCommunication;
  
  if (signalDiffInMinutes >= ONE_DAY) return noSignal24;

  if (signalDiffInMinutes >= VEHICLE_SHADOW_AREA_TIMEOUT) return noSignal;

  return vehicleOn;
};

export default getSignalType;
