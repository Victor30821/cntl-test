import { localizedStrings } from 'constants/localizedStrings';
import { api } from '../../services/api';
import { convert } from 'helpers/IntlService';
const reportTranslateStrings = localizedStrings.reportsExport;

export const ExportXLSX = ({
    setStatusSuccessXLSX,
    setDocXlsx,
    user_vehicles = [],
    organization_name = "",
    vehicle_types = [],
    organization_id,
    user_settings,
}) => {
    
    const distance_unit = user_settings.distance_unit;

    const translate_day = {
        sun: localizedStrings.sunday,
        mon: localizedStrings.monday,
        tue: localizedStrings.tuesday,
        wed: localizedStrings.wednesday,
        thu: localizedStrings.thursday,
        fri: localizedStrings.friday,
        sat: localizedStrings.saturday,
    };

    const loadVehicles = async () => {
        try {

            const URL_VEHICLE = `/vehicle/v1`;
            const URL_IDLE = `/vehicle/v1/list-idle`;
            const URL_SPEED = `/vehicle/v1/list-speed`;
            const URL_SCHEDULE = `/vehicle/v1/list-schedule`;
            const URL_TAGGING = `/vehicle/v1/tagging`;

            const vehicle_id = user_vehicles.join(',');

            const urn = `v0:cgv:vehicle:${organization_id}:*`;

            const params_tagging = {
                urn,
                perPage: 1000,
            }

            const params = {
                limit: user_vehicles?.length || 0,
                offset: 0,
                vehicle_id: vehicle_id || undefined,
            }

            const type_fuel = {
                1: localizedStrings.gasoline,
                2: localizedStrings.ethanol,
                3: localizedStrings.diesel,
                4: localizedStrings.gaz,
                5: localizedStrings.biodiesel,
                6: localizedStrings.eletric,
            }

            const {
              data: { vehicles = [] },
            } = await api.get(URL_VEHICLE, { params });

            const [
                { data: {idle_triggers = []}},
                { data: {speed_triggers = []}},
                { data: {vehicle_usage_schedules = []}},
                { data: { taggings = [] } },
            ] = await Promise.all([
                api.get(URL_IDLE, { params }),
                api.get(URL_SPEED, { params }),
                api.get(URL_SCHEDULE, { params }),
                api.get(URL_TAGGING, {params: params_tagging})
            ]);

            const tags_by_vehicle = taggings
                ?.map(tagging => {
                    const [,,,,vehicle_id] = tagging?.urn?.split(":");
                    return {
                        vehicle_id: Number(vehicle_id),
                        tag_name: tagging?.tagName || "",
                    }
            });

            const vehicles_xslsx = vehicles.map(vehicle => {

                const type_vehicle = vehicle_types?.find(type => type?.value === vehicle?.type_vehicle_id);
                const speed_trigger = speed_triggers?.find(speed => speed?.vehicle_id === vehicle?.id);
                const idle_trigger = idle_triggers?.find(idle => idle?.vehicle_id === vehicle?.id);
                const groups = tags_by_vehicle
                                    ?.filter(tags => tags?.vehicle_id === vehicle?.id)
                                    ?.map(tag => tag.tag_name)
                                    ?.join(",");

                const vehicle_usage = vehicle_usage_schedules
                                        ?.find(usage => usage?.vehicle_id === vehicle?.id);
                
                const time_usage = vehicle_usage?.vehicle_usage_schedules
                    ?.reduce((idx, usage) => {

                        const has_vehicle_usage_schedule_hours =
                          Array.isArray(usage?.vehicle_usage_schedule_hours) &&
                          usage?.vehicle_usage_schedule_hours?.length > 0;

                        if(has_vehicle_usage_schedule_hours) {

                            const [hours={}] = usage?.vehicle_usage_schedule_hours;

                            idx += ` ${translate_day[usage?.day_of_week]} (${hours?.start_time} ás ${hours?.end_time}), `;

                            return idx;

                        }

                        idx += ` ${translate_day[usage?.day_of_week]}, `;

                        return idx;
                        
                    }, "");
                
                return {
                    [reportTranslateStrings.contract]: organization_name,
                    [reportTranslateStrings.module]: vehicle?.serial_number || "",
                    [reportTranslateStrings.name]: vehicle?.name || "",
                    [reportTranslateStrings.vehicle_model]: vehicle?.model || "",
                    [reportTranslateStrings.vehicle_plate]: vehicle?.plate_number || "",
                    [reportTranslateStrings.tank]: vehicle?.tank_capacity || "0",
                    [reportTranslateStrings.year_manufacturer]: vehicle?.year_manufacturer || "",
                    [reportTranslateStrings.fuelValue]: vehicle?.liters_value || "0",
                    [reportTranslateStrings.fuelConsumption]: vehicle?.average_fuel_km || "0",
                    [`${reportTranslateStrings.odometer} - ${distance_unit}`]: convert((vehicle?.odometer || 0), "m", distance_unit).toFixed(0) || "0",
                    [reportTranslateStrings.fuelType]: type_fuel[vehicle?.type_fuel_id] || "",
                    [reportTranslateStrings.vehicleType]: type_vehicle?.label || "",
                    [reportTranslateStrings.emails]: vehicle?.email?.join(',') || localizedStrings.noEmailCreated,
                    [reportTranslateStrings.docsLink]: vehicle?.documentation_url?.length > 0 ? vehicle?.documentation_url : localizedStrings.noDocumentation,
                    [`${reportTranslateStrings.maxEngineRunnningTime} - min`]: idle_trigger?.idle_time ? idle_trigger?.idle_time : localizedStrings.noConfiguration,
                    [`${reportTranslateStrings.maxSpeedAllowed} - ${distance_unit}`]: speed_trigger?.speed_in_km_h ? convert((speed_trigger?.speed_in_km_h || 0), "km", distance_unit) : localizedStrings.noConfiguration,
                    [reportTranslateStrings.usageSchedule]: time_usage || localizedStrings.noConfiguration,
                    [reportTranslateStrings.groups]: groups || localizedStrings.noGroupCreated,
                }
            });

            setStatusSuccessXLSX({success:true});
            setDocXlsx(vehicles_xslsx);
            
        } catch (error) {
            console.error('[error] on trying to export vehicles: ' + error);
            setStatusSuccessXLSX({notFound:true});
        }
    }

    const init = async () => (await loadVehicles());

    init();
}
