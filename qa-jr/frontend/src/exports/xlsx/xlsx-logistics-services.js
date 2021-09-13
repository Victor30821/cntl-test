import { api } from '../../services/api';
import { MAX_LIMIT_FOR_SELECTORS } from 'constants/environment';
import { localizedStrings } from "constants/localizedStrings";
import { format } from "date-fns";

export const ExportXLSX = ({
    organization_id,
    search_term,
    setStatusSuccessXLSX,
    setDocXlsx,
    setDocXlsxTabNames,
}) => {

  const convert_status = {
    active: localizedStrings.logisticService.convert_status.active,
    inactive: localizedStrings.logisticService.convert_status.inactive
  }

    const loadReports = async () => {
      try {
        const URL = "/logistics/v1?";

        const URL_TYPE_SERVICE = "/logistics/v1/type?";
    
        const params = {
          limit: MAX_LIMIT_FOR_SELECTORS,
          offset: 0,
          status: "active",
        };

        const params_type_service = {
          limit: MAX_LIMIT_FOR_SELECTORS,
          offset: 0,
        };

        const {
          data: { logistics, total },
        } = await api.get(URL, { params });

        const {
          data: { types },
        } = await api.get(URL_TYPE_SERVICE, { params_type_service });

        logistics.forEach(logistic => {

          logistic.vehicle_name = "";
          logistic.driver_name = "";
          logistic.client_name = "";
          logistic.places_quantity = String(logistic.places.length) || "0";
    
          const has_driver = Array.isArray(logistic.drivers) && logistic.drivers.length > 0;
          if(has_driver) {
            const [driver = {}] = logistic.drivers;
            const drivers_quantity = (logistic.drivers.length) - 1;
            const plus_drivers = drivers_quantity === 0 ? "" : ` +${drivers_quantity}`
            logistic.driver_name = driver.name + plus_drivers;
          }

          const has_type_service = Array.isArray(types) && types.length > 0;
          if(has_type_service) {
            const type_service = types.find(type => type.id === logistic.type_service_id);
            const found_type_service = type_service !== undefined;
            if(found_type_service) logistic.service_name = type_service.name;
          }

          const start_date_formated = format(new Date(logistic.start_date), "dd/MM/yyyy");
          const end_date_formated = format(new Date(logistic.end_date), "dd/MM/yyyy");
    
          logistic.start_end_formated = `${start_date_formated} ${localizedStrings.logisticService.until} ${end_date_formated}`;
    
          logistic.vehicle_name = logistic.vehicles?.map?.(vehicle => vehicle.name)?.join?.(", ");
          
          logistic.client_name = logistic.clients?.map?.(client => client.name)?.join?.(", ");
    
        });

        return {
          logistics,
          total,
        };
      } catch (error) {
        console.log(error);
        return {
          routes: [],
          total: 0,
        };
      }
    };

    const logisticsServicesLoadSuccess = ({ logistics }) => {

      const tab_names = logistics.map(l => `${l.id} - ${l.name}`);

      const data = logistics.map(logistic => {
        return {
            [localizedStrings.reportsExport.code]: logistic.id,
            [localizedStrings.reportsExport.name]: logistic.name,
            [localizedStrings.reportsExport.vehicle]: logistic.vehicle_name,
            [localizedStrings.reportsExport.client]: logistic.client_name,
            [localizedStrings.reportsExport.driver]: logistic.driver_name,
            [localizedStrings.reportsExport.service]: logistic.service_name,
            [localizedStrings.reportsExport.period]: logistic.start_end_formated,
            [localizedStrings.reportsExport.status]: convert_status[logistic.status] || convert_status.not_started,
            [localizedStrings.reportsExport.stopPoints]: logistic.places.length,
          }
        });
        
        return {
          tab_names,
          data
        }
    }

    const lastProcess = async ({ logistics = [] }) => {
        const {
          data = [],
          tab_names = []
        } = logisticsServicesLoadSuccess({ logistics });
        setStatusSuccessXLSX({ success: true });
        setDocXlsx(data);
        setDocXlsxTabNames(tab_names);
    };


    const init = async () => {
        const data = await loadReports();
        await lastProcess(data);
    };

    init();
}
