import { api } from '../../services/api';
import { format } from 'date-fns';
import { localizedStrings } from 'constants/localizedStrings';
const reportTranslateStrings = localizedStrings.reportsExport;


export const ExportXLSX = async ({
    organization_id,
    setStatusSuccessXLSX,
    setDocXlsx,
}) => {

    const loadReports = async () => {
        try {

            const URL = "/driver/v1";

            const params = {
                limit: 1000,
                offset: 0,
                organization_id,
                status: "1",
            }

            const { data: { drivers = [] } } = await api.get(URL, { params });

            const drivers_xlsx = drivers?.map(driver => {

                const extra_propertys = {
                    expire_driver_license: "",
                }

                const has_expire_driver_license = driver?.expire_driver_license !== undefined && driver?.expire_driver_license?.length > 0;

                if(has_expire_driver_license) {
                    const [full_year] = driver?.expire_driver_license?.split("T");
                    const [year, month, day] = full_year.split("-");
                    extra_propertys.expire_driver_license = new Date(year, month, day, "06", "00", "00");
                }


                return {
                    [reportTranslateStrings.name]: driver?.name || "",
                    [reportTranslateStrings.nickname]: driver?.nickname || "",
                    [reportTranslateStrings.telephone]: driver?.phone || "",
                    [reportTranslateStrings.idCode]: driver?.code || "",
                    [reportTranslateStrings.CNH]: driver?.driver_license || "",
                    [reportTranslateStrings.CNHExpirationDate]: has_expire_driver_license ? format(new Date(extra_propertys.expire_driver_license), 'dd/MM/yyyy') : "",
                    [reportTranslateStrings.email]: driver?.email || "", 
                }
            })
            
            setStatusSuccessXLSX({ success: true });
            setDocXlsx(drivers_xlsx);
            
        } catch (error) {
            console.log(error)
            setStatusSuccessXLSX({ notFound: true });
        }
    }

    const init = async () => await loadReports()

    init();
}