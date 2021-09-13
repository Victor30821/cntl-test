import { api } from '../../services/api';
import { localizedStrings } from "constants/localizedStrings";
import { format, getHours } from "date-fns";
import { DEFAULT_NULL_VALUE } from 'constants/environment';
import { convertUserMaskToDateFns } from 'utils/convert.js';

export const ExportXLSX = ({
    service_ids,
    setStatusSuccessXLSX,
    setDocXlsx,
    setDocXlsxTabNames,
    short_date_format = "dd/MM/yyyy", 
    short_time_format = "hh:mm:ss"
}) => {

    const loadReports = async () => {
      try {
        const URL = "/logistics/v1?";
    
        const params = {
          limit: 1,
          offset: 0,
          service_ids,
        };

        const {
          data: { 
                logistics = []
            },
        } = await api.get(URL, { params });

        const has_logistics = 
            logistics.length > 0;

        if(has_logistics === false) return {
            logistics: [],
        };

        const [logistic={}] = logistics;
        
        const has_progress = 
            Array.isArray(logistic?.progress) &&
            logistic?.progress?.length > 0;
        
        if(has_progress === false) return {
            services_header_idx: [],
            services_progress_date_idx: [],
        }
        
        const place_ids = logistic?.places?.map(place => place?.place_id).join(",");
        const vehicle_ids = [...new Set(logistic?.progress?.map(vehicle => vehicle?.vehicle_id))];

        const params_places = {
            place_ids,
            limit: logistic?.places?.length || 0,
        }

        const params_vehicles = {
            vehicle_id:vehicle_ids.join(","),
            limit: vehicle_ids?.length || 0,
        }
                
        const URL_PLACES = '/place/v1';
        const URL_VEHICLES = '/vehicle/v1';

        const [
            {
                data: {
                    places = [],
                }
            },
            {
                data: {
                    vehicles = [],
                }
            }
        ] = await Promise.all([
            api.get(URL_PLACES, { params: params_places }),
            api.get(URL_VEHICLES, { params: params_vehicles }),
        ]);

        const places_idx = places?.reduce((acc, current_place) => {

            const has_index_place = 
                !!acc[current_place?.id];

            if(has_index_place === false) acc[current_place?.id] = {};

            acc[current_place?.id] = current_place;

            return acc;

        }, {});

        const vehicles_idx = vehicles.reduce((acc, current_vehicle) => {

            const has_index_vehicles = 
                !!acc[current_vehicle?.id];

            if(has_index_vehicles === false) acc[current_vehicle?.id] = {};

            acc[current_vehicle?.id] = current_vehicle;

            return acc;            

        }, {});

        const translate_day = {
            0: localizedStrings.Sunday,
            1: localizedStrings.Monday,
            2: localizedStrings.Tuesday,
            3: localizedStrings.Wednesday,
            4: localizedStrings.Thursday,
            5: localizedStrings.Friday,
            6: localizedStrings.Saturday,
        }

        const services_odometer_idx = logistic?.progress_status
            ?.reduce((acc, current_status) => {

            const date = format(new Date(`${current_status?.date} 06:00:00`), "dd/MM/yyyy");

            const has_current_status = 
                !!acc[date];

            if(has_current_status === false) acc[date] = [];

            acc[date].push(current_status);

            return acc;

        }, {});

        const start_end_odometer_idx = Object
            ?.keys(services_odometer_idx)
            ?.reduce((acc, current_service_odometer_date) => {

                const has_acc = 
                    !!acc[current_service_odometer_date];

                if(has_acc === false) acc[current_service_odometer_date] = {start_odometer: DEFAULT_NULL_VALUE, end_odometer: DEFAULT_NULL_VALUE};

                services_odometer_idx[current_service_odometer_date].sort((a,b) => a?.start_odometer - b?.start_odometer);
                
                const [first_service={}] = services_odometer_idx[current_service_odometer_date];
                const [last_service={}] = services_odometer_idx[current_service_odometer_date].reverse();

                const has_first_service =
                    !!first_service.start_odometer;

                const has_end_service = 
                    !!last_service.end_odometer;

                if(has_first_service) acc[current_service_odometer_date].start_odometer = first_service.start_odometer;

                if(has_end_service) acc[current_service_odometer_date].end_odometer = last_service.end_odometer;

                return acc;

            }, {});

        const services_header_idx = logistic?.progress?.reduce((acc, current_progress) => {

            const date = format(new Date(current_progress.date), "dd/MM/yyyy");
            const header_date = format(new Date(current_progress.date), "dd-MM-yyyy");

            const has_index_by_date = 
                Array.isArray(acc[date]);

            if(has_index_by_date === false) {

                const hour_going = getHours(new Date(logistic?.start_date));
                
                acc[date] = {
                    day_of_the_week: DEFAULT_NULL_VALUE,
                    date,
                    header_date,
                    driver_name: DEFAULT_NULL_VALUE,
                    vehicle_name: DEFAULT_NULL_VALUE,
                    service_start: `${hour_going}:00`,
                    inicial_odometer: start_end_odometer_idx[date]?.start_odometer || DEFAULT_NULL_VALUE,
                    end_odometer: start_end_odometer_idx[date]?.end_odometer || DEFAULT_NULL_VALUE
                };

                acc[date].day_of_the_week = translate_day[new Date(current_progress?.date).getDay()];

                const driver = logistic?.drivers?.find(d => d?.driver_id === current_progress?.driver_id);

                const has_driver = 
                    !!driver;
    
                if(has_driver) acc[date].driver_name = driver?.name;
    
                const has_vehicle = 
                    !!vehicles_idx[current_progress?.vehicle_id];
    
                if(has_vehicle) acc[date].vehicle_name = vehicles_idx[current_progress?.vehicle_id]?.name;
            }

            return acc;

        },{});

        const dateMaskFromConfiguration = convertUserMaskToDateFns({ mask: short_date_format, timeMask: short_time_format });
        
        const services_progress_date_idx = logistic?.progress?.reduce((acc, current_progress) => {
            
            const date = format(new Date(current_progress.date), "dd/MM/yyyy");

            const has_index_by_date = 
                Array.isArray(acc[date]);

            if(has_index_by_date === false) acc[date] = [];

            const progress_info = {
                place_id: 0,
                address: DEFAULT_NULL_VALUE,
                configured_departure: DEFAULT_NULL_VALUE,
                type: DEFAULT_NULL_VALUE,
                real_departure: DEFAULT_NULL_VALUE,
            };

            const has_place =
                !!places_idx[current_progress.place_id];

            if(has_place) {

                const place_found = places_idx[current_progress.place_id];

                progress_info.place_id = current_progress.place_id;

                const place_logistic = logistic.places.find(place => place.id === current_progress.place_id);

                const [address={}] = place_found.addresses;

                const formatted_address = `${address.address1 || DEFAULT_NULL_VALUE}, ${localizedStrings.numberAddress} ${address?.number || DEFAULT_NULL_VALUE}, ${address?.city || DEFAULT_NULL_VALUE}, ${address.state || DEFAULT_NULL_VALUE}`;

                progress_info.address = formatted_address;

                const [date,] = current_progress?.date?.split(' ');

                progress_info.configured_departure = place_logistic?.departure ? format(new Date(`${date} ${place_logistic?.departure}`), dateMaskFromConfiguration) : DEFAULT_NULL_VALUE;

                const real_departure = format(new Date(`${date} ${current_progress?.departure}`), dateMaskFromConfiguration);

                progress_info.real_departure = real_departure || DEFAULT_NULL_VALUE;

                const has_all_quals_place_ids = 
                    Array.isArray(acc[date]) && 
                    acc[date].length > 0;

                progress_info.type = localizedStrings.logisticService.boarding;

                if(has_all_quals_place_ids) {

                    const all_quals_place_ids = acc[date].place_id
                        .filter(place_id => current_progress.place_id === place_id);
                    
                    const has_place_boarding = 
                        (all_quals_place_ids?.length + 1) % 2 === 0;

                    if(has_place_boarding) progress_info.type = localizedStrings.logisticService.landing;

                }
            }

            acc[date].push(progress_info);

            return acc;

        }, {});

        const service_place_ids_idx = {};

        Object
            .keys(services_progress_date_idx)
            .forEach(date => services_progress_date_idx[date]
                .forEach(service_progress => {

                    const has_service_place_ids_idx = 
                        !!service_place_ids_idx[service_progress?.place_id];

                    if(has_service_place_ids_idx === false) service_place_ids_idx[service_progress?.place_id] = 1;

                    if(has_service_place_ids_idx) service_place_ids_idx[service_progress?.place_id] = service_place_ids_idx[service_progress?.place_id] + 1;

                    const has_place_boarding = 
                        service_place_ids_idx[service_progress?.place_id] % 2 === 0;

                    if(has_place_boarding) service_progress.type = localizedStrings.logisticService.landing;

            }));

        
        return {
            services_header_idx,
            services_progress_date_idx,
        };
      } catch (error) {
        console.log(error);
        return {
            services_header_idx: [],
            services_progress_date_idx: [],
        };
      }
    };

    const logisticsServicesLoadSuccess = ({ 
        services_header_idx = [],
        services_progress_date_idx = [],
     }) => {

      const tab_names = Object
        ?.keys(services_header_idx)
        ?.map(date => `${services_header_idx[date].header_date} - ${services_header_idx[date].day_of_the_week}`);  

      const data = Object
        ?.keys(services_header_idx)
        ?.reduce((acc,current_date) => {

            const has_services_progress_date_idx = 
                !!services_progress_date_idx[current_date];

            if(has_services_progress_date_idx) {

                const progress_header = {
                    [localizedStrings.reportsExport.day_of_the_week]: services_header_idx[current_date]?.day_of_the_week || DEFAULT_NULL_VALUE,
                    [localizedStrings.reportsExport.date]: services_header_idx[current_date]?.date || DEFAULT_NULL_VALUE,
                    [localizedStrings.reportsExport.driver_name]: services_header_idx[current_date]?.driver_name || DEFAULT_NULL_VALUE,
                    [localizedStrings.reportsExport.vehicle_name]: services_header_idx[current_date]?.vehicle_name || DEFAULT_NULL_VALUE,
                    [localizedStrings.reportsExport.service_start]: services_header_idx[current_date]?.service_start || DEFAULT_NULL_VALUE,
                    [localizedStrings.reportsExport.inicial_odometer]: services_header_idx[current_date]?.inicial_odometer || DEFAULT_NULL_VALUE,
                    [localizedStrings.reportsExport.end_odometer]: services_header_idx[current_date]?.end_odometer || DEFAULT_NULL_VALUE,
                    [" "]: " ",
                };

                const progress_day = services_progress_date_idx[current_date]
                    ?.map(all_progress_day => ({
                    [localizedStrings.reportsExport.address]: all_progress_day?.address || DEFAULT_NULL_VALUE,
                    [localizedStrings.reportsExport.reason]: all_progress_day?.type || DEFAULT_NULL_VALUE,
                    [localizedStrings.reportsExport.configured_departure]: all_progress_day?.configured_departure || DEFAULT_NULL_VALUE,
                    [localizedStrings.reportsExport.real_departure]: all_progress_day?.real_departure || DEFAULT_NULL_VALUE,
                }));

                progress_day.unshift(progress_header);

                acc.push(progress_day);
            };

            if(has_services_progress_date_idx === false) acc.push([{
                [localizedStrings.reportsExport.day_of_the_week]: DEFAULT_NULL_VALUE,
                [localizedStrings.reportsExport.date]: DEFAULT_NULL_VALUE,
                [localizedStrings.reportsExport.driver_name]: DEFAULT_NULL_VALUE,
                [localizedStrings.reportsExport.vehicle_name]: DEFAULT_NULL_VALUE,
                [localizedStrings.reportsExport.service_start]: DEFAULT_NULL_VALUE,
                [localizedStrings.reportsExport.inicial_odometer]: DEFAULT_NULL_VALUE,
                [localizedStrings.reportsExport.end_odometer]: DEFAULT_NULL_VALUE,
                [""]: "",
                [localizedStrings.reportsExport.address]: DEFAULT_NULL_VALUE,
                [localizedStrings.reportsExport.reason]: DEFAULT_NULL_VALUE,
                [localizedStrings.reportsExport.configured_departure]: DEFAULT_NULL_VALUE,
                [localizedStrings.reportsExport.real_departure]: DEFAULT_NULL_VALUE,
            }]);

            return acc;

        }, []);
        
        return {
          tab_names,
          data
        }
    }

    const lastProcess = async ({ 
        services_header_idx = [],
        services_progress_date_idx = [],
     }) => {

        const {
          tab_names = [],
          data = []
        } = logisticsServicesLoadSuccess({ 
            services_header_idx,
            services_progress_date_idx,
         });

        setStatusSuccessXLSX({ success: true });
        setDocXlsx(data);
        setDocXlsxTabNames(tab_names);
    };


    const init = async () => {
        const {
            services_header_idx = {},
            services_progress_date_idx = {},
        } = await loadReports();
        
        const has_progress_idx = 
            Object?.keys(services_progress_date_idx).length > 0;

        if(has_progress_idx === false) {
            setStatusSuccessXLSX({ notFound: true });
            return;
        }

        await lastProcess({
            services_header_idx,
            services_progress_date_idx
        });
    };

    init();
}
