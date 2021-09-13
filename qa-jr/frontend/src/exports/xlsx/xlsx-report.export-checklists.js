import { format,parseISO } from 'date-fns';
import { api } from '../../services/api';
import { localizedStrings } from 'constants/localizedStrings';
import loadVehiclesWithGroupsReports from 'utils/requests/vehicles/getVehiclesWithGroupsReports';
import { REPORTS_LIMIT_PER_REQUEST } from 'constants/environment';
import { DEFAULT_NULL_VALUE } from 'constants/environment';
import loadQuestions from 'utils/requests/getChecklistQuestions';
const reportTranslateStrings = localizedStrings.reportsExport;


export default function ExportXLSX ({
    filters,
    organizationId,
    selectedDrivers,
    selectedVehicles,
    setStatusSuccessXLSX,
    setDocXlsx,
}) {

    const loadReports = async () => {
        try {
            const URL = "/checklist/v1/"

            const hasPeriod = !!filters.period.start_date && !!filters.period.end_date
            if (hasPeriod) {
                const [{ value: valueDriver }] = selectedDrivers;
                const [{ value: valueVehicle }] = selectedVehicles;

                const allVehicle = (valueVehicle === 0 && true) || false;
                const allDrivers = (valueDriver === 0 && true) || false;

                const params = {
                    vehicle_id: selectedVehicles && selectedVehicles.map(vehicles => vehicles.value).join(','),
                    driver_id: selectedDrivers && selectedDrivers.map(drivers => drivers.value).join(','),
                    organization_id: organizationId || '',
                    start_date: filters.period.start_date,
                    end_date: filters.period.end_date,
                    limit: 1,
                    offset: 0,
                };
                allVehicle && delete params.vehicle_id;
                allDrivers && delete params.driver_id;

                const { data: { total } } = await api.get(URL, { params });

                const allChecklists = [];
                // example: user requests 12000
                // limit per request is 10000
                // we must send 2 requests ( 10000 / 12000 = 1,2 => rouding to 2)
                // for each request we limit to 6000, when the 2 requests resolves, we should have 12000 as the user requested
                const numberOfRequests = Math.ceil(total / REPORTS_LIMIT_PER_REQUEST);
                params.limit = Math.ceil(total / numberOfRequests);

                for (let offset = 0; offset < numberOfRequests; offset++) {
                    params.offset = offset;
                    const { data: { checklists = [] } } = await api.get(URL, { params });
                    allChecklists.push(...checklists);
                }

                const vehicles = await loadVehiclesWithGroupsReports({
                    vehiclesIds: filters?.vehicle_id,
                    organizationId: params?.organization_id
                });

                return {
                    checklists: allChecklists,
                    vehicles,
                    total
                }
            }
        } catch (error) {
            console.log(error)
             return {
                checklists: [],
                vehicles: [],
                total: 0
            }
        }
    }

    const lastProcess = async ({checklists, vehicles}) => {
		const questions = await loadQuestions();
        const data = checklists.map(obj => {
            const vehicle = vehicles.find(vehicle => vehicle?.vehicle_id === obj?.vehicle_id) || {};

			const checklistValues = obj.reports_items_checklist.checklist.map((checklist) => {
				const question = questions?.find(q => q?.id === checklist.checklist_question_id);

				return {
					quantity: question?.name ? 1 : 0,
					item: question?.name,
					observation: checklist.note?.trim(),
				}
            });

			const createdHour = new Date(obj.created);
            createdHour.setHours(createdHour.getHours());

			const date = new Date(obj.date);
            date.setHours(date.getHours() + 6);

            return {
                [reportTranslateStrings.hour]: format(createdHour,'HH:mm') || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.year_manufacturer]: obj?.year_manufacturer || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicleType]: vehicle?.vehicle_type || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.groups]: vehicle?.vehicle_groups || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicle_plate]: obj?.plate_number || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicle_model]: obj?.vehicle_model || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.vehicle]:obj.vehicle_name || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.driver]: obj.driver_name,
				[reportTranslateStrings.CNHExpired]: obj.driver_license_suspended ? reportTranslateStrings.yes : reportTranslateStrings.no,
                [reportTranslateStrings.checklist_items]: checklistValues?.map(checklist => checklist.item)?.filter(item => item).join(', ') || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.observation]: checklistValues?.map(checklist  => checklist.observation)?.filter(observation => observation).join(', ') || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.date]:format(date,'dd/MM/yyyy') || DEFAULT_NULL_VALUE
            }
        });
        setStatusSuccessXLSX({success:true});
        setDocXlsx(data)

    };


    const init = async () => {
        const data = await loadReports();
        await lastProcess(data);
    };

    init();
}
