import { api } from '../../services/api';
import loadVehiclesWithGroupsReports from 'utils/requests/vehicles/getVehiclesWithGroupsReports';
import { formatFuelRegister } from 'helpers/fuel';
import { REPORTS_LIMIT_PER_REQUEST } from 'constants/environment';
import { localizedStrings } from 'constants/localizedStrings';
import { translateKeys } from 'helpers/fuel';

export default function ExportXLSX ({
    filters,
    organizationId,
    setStatusSuccessXLSX,
    setDocXlsx,
    user_settings,
}) {
    const loadReports = async () => {
        try {
            const URL = "/fuel/v1/register"

            const hasPeriod = !!filters.period.start_date && !!filters.period.end_date
            if (hasPeriod) {
                const params = {
                    organization_id: organizationId || '',
                    start_date: filters.period.start_date,
                    end_date: filters.period.end_date,
                    group: "vehicle",
                    limit: 1,
                    offset: 0,
                };

                if (filters.search_term && filters.search_term !== '') {
                    Object.assign(params, {
                        search_term: (filters && filters.search_term) || ''
                    })
                }

                if (filters.vehicle_id.length > 0 && !filters.vehicle_id.includes(0)) {
                    Object.assign(params, {
                        vehicle_id: (filters && filters.vehicle_id.join(',')) || ''
                    })
                }

                if (filters.driver_id.length > 0 && !filters.driver_id.includes(0)) {
                    Object.assign(params, {
                        driver_id: (filters && filters.driver_id.join(',')) || ''
                    })
                }

                const { data: { total } } = await api.get(URL, { params });

                const allFuels = {
                    fuels: {}
                }
                // example: user requests 12000 
                // limit per request is 10000
                // we must send 2 requests ( 10000 / 12000 = 1,2 => rouding to 2)
                // for each request we limit to 6000, when the 2 requests resolves, we should have 12000 as the user requested
                const numberOfRequests = Math.ceil(total / REPORTS_LIMIT_PER_REQUEST);
                params.limit = Math.ceil(total / numberOfRequests);

                for (let offset = 0; offset < numberOfRequests; offset++) {
                    params.offset = offset;
                    Object.assign(params, {
                        offset,
                        format: 'register',
                        unit: user_settings?.distance_unit || "km"
                    })
                    const { data: { fuels = {} } } = await api.get(URL, { params });
                    allFuels.fuels = {
                        ...allFuels.fuels,
                        ...fuels
                    }
                }

                return {
                    fuels: allFuels?.fuels,
                    total
                }
            }
        } catch (error) {
            console.log(error)
            return {
                vehicles: [],
                fuels: [],
                total: 0
            }
        }
    }
   

    const lastProcess = async ({ fuels, vehicles }) => {
        setStatusSuccessXLSX({ success: true });

        setDocXlsx(translateKeys({
            fuels: Object.values(fuels),
            timezone: user_settings?.timezone
        }))
    };


    const init = async () => {
        const data = await loadReports();
        await lastProcess(data);
    };

    init();
}
