import { api } from '../../services/api';
import { localizedStrings } from 'constants/localizedStrings';
import loadVehiclesWithGroupsReports from 'utils/requests/vehicles/getVehiclesWithGroupsReports';
import { getAverageConsumptionByMonth } from 'helpers/fuel';
import { DEFAULT_NULL_VALUE } from 'constants/environment';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import { format } from 'date-fns';
import { translateKeys } from 'helpers/fuel';
const reportTranslateStrings = localizedStrings.reportsExport;

export default function ExportXLSX ({
    filters,
    organizationId,
    setStatusSuccessXLSX,
    setDocXlsx,
    user_settings,
}) {
    const loadReports = async () => {
        try {
            const URL = "/fuel/v1/"

            const hasPeriod = !!filters.period.start_date && !!filters.period.end_date
            if (hasPeriod) {
                const params = {
                    organization_id: organizationId || '',
                    start_date: filters.period.start_date || '',
                    end_date:  filters.period.end_date || '',
                    limit: '-1',
                    offset: filters.offset || 0,
                    group: "month",
                    format: 'consumption',
                    unit: user_settings?.distance_unit || "km"
                };

                if(filters.search_term && filters.search_term !== '') {
                    Object.assign(params, {
                        search_term: (filters && filters.search_term) || ''
                    })
                }

                if(filters.vehicle_id.length > 0 && !filters.vehicle_id.includes(0)) {
                    Object.assign(params, {
                        vehicle_id: (filters && filters.vehicle_id.join(',')) || ''
                    })
                }

                const vehicles = await loadVehiclesWithGroupsReports({
                    vehiclesIds: filters?.vehicle_id,
                    organizationId: params?.organization_id
                });

                const { data: { fuels, total } } = await api.get(URL, { params });
                return {
                    fuels,
                    vehicles,
                    total
                }
            }
        } catch (error) {
            console.log(error)
        }
    }



    const lastProcess = async ({fuels, vehicles}) => {

        if (fuels.length <= 0) return;
        setStatusSuccessXLSX({success:true});
        setDocXlsx(translateKeys({
            fuels: Object.values(fuels),
            timezone: user_settings?.timezone,
            start_date: filters.period.start_date || '',
            end_date: filters.period.end_date || '',
        }))
    };

    const init = async () => {
        const data = await loadReports();
        await lastProcess(data);
    };

    init();
}
