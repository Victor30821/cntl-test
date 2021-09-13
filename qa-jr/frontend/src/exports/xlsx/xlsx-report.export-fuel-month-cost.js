import { localizedStrings } from 'constants/localizedStrings';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { translateKeys } from 'helpers/fuel';
import { api } from '../../services/api';


export default function ExportXLSX ({
    filters,
    organizationId,
    setStatusSuccessXLSX,
    setDocXlsx,
    user_settings
}) {

    const loadReports = async () => {
        try {
            const URL = "/fuel/v1/"

            const hasPeriod = !!filters.period.start_date && !!filters.period.end_date
            if (hasPeriod) {
                const params = {
                    organization_id: organizationId || '',
                    start_date: filters.period.start_date || '',
                    end_date: filters.period.end_date || '',
                    offset: 0,
                    limit: '-1',
                    group: "month",
                    format: 'cost',
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

                const { data: { fuels, total } } = await api.get(URL, { params });
                return {
                    fuels,
                    total
                }
            }
        } catch (error) {
            console.log(error)
             return {
                fuels: [],
                total:0
            }
        }
    }

  
    const lastProcess = async ({ fuels }) => {
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
