import { convert } from 'helpers/IntlService';
import { format, parseISO } from "date-fns";
import { localizedStrings } from "constants/localizedStrings";
import { convertUserMaskToDateFns } from 'utils/convert';
import { DEFAULT_NULL_VALUE } from 'constants/environment';

export default function ExportXLSX ({
    routePoints,
    setStatusSuccessXLSX,
    setDocXlsx,
    setReportAlready,
    setOpenXLSXModal,
    createXLSX,
    filters,
    user_settings
}) {
    const auditReportsLoadSuccess = (routes) => {
        
        const reportTranslateStrings = localizedStrings.reportsExport;

        const extra_propertys = {
            total_distance: 0,
        }

        const report_audit = routes
            .sort((a, b) =>  new Date(a.timestamp) - new Date(b.timestamp))
            .reduce((idx, tracking, i, arr) => {

            const last_tracking = arr[i - 1];

            const has_last_tracking = last_tracking !== undefined;
            const date_mask_from_configuration = convertUserMaskToDateFns({ mask: user_settings.short_date_format, timeMask: user_settings.short_time_format });
            // COMENTADO ATÉ O MARCO FALAR SE É PRA RETIRAR
            // let time = i === 0 ? '00:00:00' : formatTimeToCard(new Date(p.timestamp).getTime() - new Date(p.timestamp), 'obj');
            // obj[localizedStrings.time] = i === 0 ? '00:00:00' : `${time.h}:${time.i}:${time.s}`;
            const report_data = {
                [localizedStrings.date]: format(parseISO(tracking?.timestamp), date_mask_from_configuration),
                [reportTranslateStrings.ignition]: tracking.ignition ? reportTranslateStrings.ignitionOn : reportTranslateStrings.ignitionOff,
                [`${reportTranslateStrings.odometer} - ${user_settings?.distance_unit}`]: tracking.odometer ? Number(convert(tracking?.odometer, 'm', user_settings?.distance_unit).toFixed(0)) : DEFAULT_NULL_VALUE,
                [`${reportTranslateStrings.distance} - ${user_settings?.distance_unit}`]: 0,
                [`${reportTranslateStrings.speed} - ${user_settings?.distance_unit}/h`]: tracking?.speed ? Number(tracking?.speed.toFixed(0)) : 0,
                [reportTranslateStrings.driver]: tracking?.driver_name || localizedStrings.driverNotIdentified,
                [reportTranslateStrings.address]: tracking?.address || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.sensor]: tracking?.sensor || DEFAULT_NULL_VALUE,
                [reportTranslateStrings.rele]: "-",
                [reportTranslateStrings.localization]: `${tracking?.lat} ${tracking?.lng}`,
            };

            if(has_last_tracking) {

                const distance = tracking?.odometer > 0 ? (tracking?.odometer - last_tracking.odometer) : 0;

                extra_propertys.total_distance += distance;

                report_data[`${reportTranslateStrings.distance} - ${user_settings?.distance_unit}`] = extra_propertys.total_distance;

            }

            idx.push(report_data);

            return idx;

        }, []);

        return report_audit;
    }

    const lastProcess = async () => {
        const data = auditReportsLoadSuccess(routePoints);
        setStatusSuccessXLSX({ success: true });
        setDocXlsx(data)
        setReportAlready({
            document: data,
            fileName: localizedStrings.reportsExport.reportAuditFileName,
            already: true,
            href: "/"
        })
        setOpenXLSXModal(false)
        createXLSX({
          document: data,
          fileName: `${localizedStrings.reportsExport.reportAuditFileName}-${filters.period?.start_date}`,
        });
    };


    const init = async () => {
        await lastProcess(routePoints);
    };

    init();
}
