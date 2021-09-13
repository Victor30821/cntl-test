import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { DEFAULT_NULL_VALUE, REPORTS_LIMIT_PER_REQUEST } from 'constants/environment';
import { localizedStrings } from 'constants/localizedStrings';
import loadVehiclesWithGroupsReports from 'utils/requests/vehicles/getVehiclesWithGroupsReports';
import { getEventInfo, getEventType } from 'helpers/eventsHandler';
const reportTranslateStrings = localizedStrings.reportsExport;

export default function ExportXLSX ({
    organizationId,
    setStatusSuccessXLSX,
    setDocXlsx,
    filters,
    searchedGroup,
    user_settings
}) {

    const loadReports = async () => {
        try {
            const URL = "/event/v1/";
            const hasPeriod = !!filters.period.start_date && !!filters.period.end_date
            const [eventId] = filters.type_event_id;

            if (hasPeriod) {
                const params = {
                    vehicle_id: filters.vehicle_id.join(','),
                    organization_id: organizationId || '',
                    start_date: filters.period.start_date || '',
                    end_date: filters.period.end_date || '',
                    limit: 1,
                    offset: 0,
                };

                if (!filters.vehicle_id || filters.vehicle_id === 0 || Number(params.vehicle_id) === 0) delete params.vehicle_id;
                if(eventId) params.type_event_id = filters.type_event_id.join(',');

                const { data: { total = 0 } } = await api.get(URL, { params });
                params.limit = total;

                const vehicles = await loadVehiclesWithGroupsReports({
                    vehiclesIds: filters?.vehicle_id?.flat(),
                    organizationId: params?.organization_id
                });

                const allEvents = [];
                // example: user requests 12000 
                // limit per request is 10000
                // we must send 2 requests ( 10000 / 12000 = 1,2 => rouding to 2)
                // for each request we limit to 6000, when the 2 requests resolves, we should have 12000 as the user requested
                const numberOfRequests = Math.ceil(total / REPORTS_LIMIT_PER_REQUEST);
                params.limit = Math.ceil(total / numberOfRequests);

                for (let offset = 0; offset < numberOfRequests; offset++) {
                    params.offset = offset;
                    const { data: { events = [] } } = await api.get(URL, { params });
                    allEvents.push(...events);
                }
                return {
                    events: allEvents,
                    total,
                    vehicles
                }
            }
        } catch (error) {
            console.log(error)
            return {
                events: [],
                total: 0
            }
        }
    }

    const lastProcess = async ({ events = [], total, vehicles = []}) => {
        const newData = [];
        events.forEach(obj => {
            let newObj = {};
            const {
                setting: value_settings,
                value,
            } = getEventInfo(obj, user_settings);

            const type_event_name = getEventType(obj.type_event_name)

            newObj[reportTranslateStrings.event] = type_event_name
            newObj[reportTranslateStrings.realized] = value
            newObj[reportTranslateStrings.more_informations] = value_settings

            let groupsNames = '';
            searchedGroup.forEach((group, index) => {
                const split = group.urn.split(':');
                if(parseInt(split[split.length - 1]) === obj.vehicle_id) {
                    groupsNames += group.tagName + (index === searchedGroup.length - 1 ? '' : ', ') ;
                }
            });

            const vehicle = vehicles.find(vehicle => vehicle?.vehicle_id === obj?.vehicle_id);

            const date = format(parseISO(obj.time), 'dd/MM/yyyy');
            const time = format(parseISO(obj.time), 'HH:mm');
            newObj[reportTranslateStrings.vehicle] = obj?.vehicle_name || DEFAULT_NULL_VALUE;
            newObj[reportTranslateStrings.date] = date;
            newObj[reportTranslateStrings.groups] = groupsNames;
            newObj[reportTranslateStrings.hour] = time;
            newObj[reportTranslateStrings.vehicle_model] = vehicle?.vehicle_model || DEFAULT_NULL_VALUE;
            newObj[reportTranslateStrings.groups] = vehicle?.vehicle_groups || DEFAULT_NULL_VALUE;
            newObj[reportTranslateStrings.year_manufacturer] = vehicle?.year_manufacturer || DEFAULT_NULL_VALUE;
            newObj[reportTranslateStrings.vehicle_plate] = vehicle?.plate_number || DEFAULT_NULL_VALUE;
            newObj[reportTranslateStrings.vehicleType] = vehicle?.vehicle_type || DEFAULT_NULL_VALUE;
            newObj[reportTranslateStrings.driver] = obj?.driver_name || localizedStrings.driverNotIdentified;
            newData.push(newObj);
        });
        
        setStatusSuccessXLSX({ success: true });
        setDocXlsx(newData)
    };


    const init = async () => {
        const data = await loadReports();
        await lastProcess(data);
    };

    init();
}
