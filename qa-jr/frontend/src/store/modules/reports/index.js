import { loadKmReports } from './km/action'
import { loadRoutesReports, attachDriverToRoute, getRoutesByFileRouteId, getDriversAndAddresses, getSingleRouteByFilters } from './routes/action'
import { loadAllDriversReports } from './allDrivers/action';
import { loadEventsReports } from './events/action';
import { loadProductivityReports } from './productivity/action';
import { loadDriversPerDayReports } from './driversPerDay/action';
import { loadChecklistReports } from './checklists/action';
import { loadConsumptionMonthReports } from './consumptionMonth/action';
import { loadMonthCostReports } from './monthCost/action';
import { loadFuelRegistersReports } from './registers/action';
import { loadDriversPerRouteReports } from './driverPerRoute/action';
import { loadAuditTrackings, sendFileToEmail } from './audit/action';
 
export {
    loadKmReports,
    loadRoutesReports,
    loadAllDriversReports,
    loadEventsReports,
    loadProductivityReports,
    loadDriversPerDayReports,
    loadChecklistReports,
    loadConsumptionMonthReports,
    loadMonthCostReports,
    loadFuelRegistersReports,
    loadDriversPerRouteReports,
    attachDriverToRoute,
    loadAuditTrackings,
    sendFileToEmail,
    getRoutesByFileRouteId,
	getDriversAndAddresses,
    getSingleRouteByFilters,
}
