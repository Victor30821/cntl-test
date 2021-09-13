import { combineReducers } from "redux";
import commands from "./commands/reducer";
import users from "./users/reducer";
import auth from "./auth/reducer";
import menu from "./menu/reducer";
import general from "./general/generalSlice";
import fences from "./fences/reducer";
import drivers from "./drivers/reducer";
import groups from "./groups/reducer";
import vehicleStatusReports from "./reports/vehicleStatus/reducer";
import kmReports from "./reports/km/reducer";
import routesReports from "./reports/routes/reducer";
import allDriversReports from "./reports/allDrivers/reducer";
import eventsReports from "./reports/events/reducer";
import productivityReports from "./reports/productivity/reducer";
import driversPerDayReports from "./reports/driversPerDay/reducer";
import driversPerRouteReports from "./reports/driverPerRoute/reducer";
import checklistReports from "./reports/checklists/reducer";
import consumptionMonthReports from "./reports/consumptionMonth/reducer";
import monthCostReports from "./reports/monthCost/reducer";
import fuelRegistersReports from "./reports/registers/reducer";
import organization from "./organization/reducer";
import vehicles from "./vehicles/reducer";
import fuelSupplies from "./fuelSupplies/reducer";
import map from "./map/reducer";
import trackers from "./trackers/reducer";
import clients from "./clients/reducer";
import places from "./places/reducer";
import logisticsServices from "./logistics/reducer";
import solicitations from "./solicitations/reducer";
import audit from "./reports/audit/reducer";
import usage from "./usageAchievement/reducer";

const allReducers = combineReducers({
  commands,
  users,
  menu,
  fences,
  drivers,
  groups,
  vehicleStatusReports,
  kmReports,
  routesReports,
  allDriversReports,
  eventsReports,
  productivityReports,
  driversPerDayReports,
  checklistReports,
  consumptionMonthReports,
  monthCostReports,
  fuelRegistersReports,
  driversPerRouteReports,
  organization,
  vehicles,
  auth,
  fuelSupplies,
  map,
  trackers,
  clients,
  places,
  logisticsServices,
  solicitations,
  general,
  audit,
  usage
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    localStorage.clear()
    state = undefined;
  }

  return allReducers(state, action);
};

export default rootReducer;