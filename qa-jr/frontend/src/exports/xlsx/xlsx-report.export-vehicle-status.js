import { localizedStrings } from 'constants/localizedStrings';
import { differenceInDays } from 'date-fns';
import { DEFAULT_NULL_VALUE, manager, noModule, vehiclesStatusTypes } from "constants/environment"
import { api } from '../../services/api';

import getLastPoints from 'utils/requests/getLastPoints';
import { conversionPerType } from 'components/VirtualizedTableItems';
import getTaggings from 'utils/requests/groups/getTaggings';
const reportTranslateStrings = localizedStrings.reportsExport;

export default function ExportXLSX({
  setStatusSuccessXLSX,
  setDocXlsx,
  user_settings,
  vehicles = undefined,
	role_id,
  organization_id
}) {

  const loadReports = async () => {
    try {
      const URL_STAGES = "/vehicle/v1/stage";
      const { data: { stages } } = await api.get(URL_STAGES);
      const separateStages = stages.length && Array.isArray(stages) &&
        stages.push({ id: 5, name: localizedStrings.messageVehicleInactiveSevenDays }) &&
        stages.reduce((acc, item) => {
          acc[item.id] = item.name;
          return acc;
        }, {});

			const vehicle_id = role_id !== manager && vehicles;
      const { lastPoints = [] } = await getLastPoints({
				vehicle_id,
        limit: false,
        getStoppedDays: true,
      });

			const taggingsResponse = await getTaggings({ organization_id });

			const taggingsIndexedByVehicleId = taggingsResponse.reduce((acc, elem) => {
				const [key] = elem.urn.split(":").reverse();
				if (!acc[key]) acc[key] = [elem.tagName];
				else acc[key].push(elem.tagName);
				return acc;
			}, {});

      return {
        lastPoints,
        separateStages,
				taggings: taggingsIndexedByVehicleId,
      }
    } catch (error) {
      console.log(error)
      return {
        lastPoints: [],
        separateStages: [],
        all_vehicles: [],
      }
    }
  }

  const lastProcess = async ({
    lastPoints = [],
    separateStages = {},
		taggings = {}
  }) => {

    // eslint-disable-next-line
    const data = lastPoints.map(report => {
      // eslint-disable-next-line
      if (!report?.vehicle?.id) return;

      const blockedStatus = [1, 3, 5];

      const vehicleHasCommands =
        Array.isArray(report?.vehicle?.lastCommandAndFromNow) &&
        report.vehicle.lastCommandAndFromNow.length > 0;

      const vehicleIsBlocked =
        vehicleHasCommands &&
        blockedStatus.includes(report.vehicle.lastCommandAndFromNow[0].type_command_id) &&
        report.vehicle.lastCommandAndFromNow[0].status === 3;

      const { value: date } = conversionPerType.date({ cellData: report?.timestamp, user_settings });
      const { value: hour } = conversionPerType.time({ cellData: report?.timestamp, user_settings });
      const { value: odometer } = conversionPerType.distance({ cellData: report?.vehicle?.odometer, user_settings, pureResult: true });
			const odemeterWithoutDistanceUnit = odometer.substring(0, odometer.length - 3);
			const pureOdometer = odemeterWithoutDistanceUnit.replace(/(\.|,)/g, '');

			const idle = report.idle === 'null' || report.idle === 'undefined' ? null : report.idle

			const isNoModule = report?.status === noModule;

      return {
        [reportTranslateStrings.vehicle]: report?.vehicle?.name,
        [reportTranslateStrings.module]: report?.vehicle?.serial_number,
        [reportTranslateStrings.vehicle_model]: report?.vehicle?.model,
        [reportTranslateStrings.vehicle_plate]: report?.vehicle?.plate_number,
        [reportTranslateStrings.year_manufacturer]: report?.vehicle?.year_manufacturer ?? DEFAULT_NULL_VALUE,
        [reportTranslateStrings.odometer]: !isNoModule && pureOdometer ? Number(pureOdometer) : DEFAULT_NULL_VALUE,
        [reportTranslateStrings.status]: vehiclesStatusTypes[report?.status]?.text,
        [reportTranslateStrings.driver]: !isNoModule ? report?.driver?.name ?? localizedStrings.driverNotIdentified : DEFAULT_NULL_VALUE,
        [reportTranslateStrings.groups]: taggings?.[report?.vehicle?.id]?.join(", ") ?? DEFAULT_NULL_VALUE,
        [reportTranslateStrings.blocked]: !isNoModule ? vehicleIsBlocked ? reportTranslateStrings.yes : reportTranslateStrings.no : DEFAULT_NULL_VALUE,
        [reportTranslateStrings.vehicleStage]: !isNoModule ? separateStages[report.vehicle.stage_vehicle_id] : DEFAULT_NULL_VALUE,
        [reportTranslateStrings.lastRecord]: !isNoModule ? date : DEFAULT_NULL_VALUE,
        [reportTranslateStrings.hour]: !isNoModule ? hour : DEFAULT_NULL_VALUE,
        [reportTranslateStrings.daysStopped]: !isNoModule && idle ? Number(idle) : DEFAULT_NULL_VALUE,
        [reportTranslateStrings.brand]: report?.vehicle?.manufacturer ? report?.vehicle?.manufacturer : DEFAULT_NULL_VALUE,
      }
    });

    setStatusSuccessXLSX({ success: true });

    setDocXlsx(data)

  };


  const init = async () => {
    const data = await loadReports();
    await lastProcess(data);
  };

  init();
}
