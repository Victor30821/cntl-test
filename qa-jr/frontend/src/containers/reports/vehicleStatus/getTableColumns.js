import React from "react";
import { Link } from "components";
import { DEFAULT_NULL_VALUE, vehiclesStatusTypes } from "constants/environment";
import redirectToMap from "utils/map/redirectToMap";
import { updateVehicle, vehicleChangeOperationStates } from "store/modules";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import getOneVehicle from "utils/requests/vehicles/getOneVehicle";

const { localizedStrings } = require("constants/localizedStrings");

const getTableColumns = ({history, stageOptions, loadReport, setTableData, showAddresses, dispatch}) => {
	const onMapView = (rowData = {}) => {
		const {
			date,
			hour,
			driver: driver_name,
		} = rowData;

		const viewData = {
			id: rowData?.vehicle_id,
			vehicle_id: rowData?.vehicle_id,
			date,
			hour,
			driver_name,
		};

		redirectToMap(viewData, history);
	};

	const updateStage = async ({ vehicle, stage }) => {
		if (vehicle) {
			vehicle["stage_vehicle_id"] = stage;
			await dispatch(updateVehicle(vehicle));
		}
	};

	const handleChangeState = async (event, data) => {
		const stageId = event.value;
		dispatch(vehicleChangeOperationStates({ editLoading: true }));
		const vehicle = await getOneVehicle(data.vehicle_id);
		await updateStage({
		  vehicle,
		  stage: stageId
		});

		loadReport();
		dispatch(vehicleChangeOperationStates({ editLoading: false }));
	};

	return [
		{
			active: true,
			key: "viewRoute",
			weight: 0.3,
			label: localizedStrings.place,
			type: "buttons",
			buttons: [
				{
					name: faCrosshairs,
					useFontAwesome: true,
					width: "30px",
					onClick: onMapView,
					style: (rowData) => ({
						cursor:
							rowData?.coords?.lat !== null && rowData?.coords?.lng !== null
								? "pointer"
								: "default",
						color:
							rowData?.coords?.lat === null &&
							rowData?.coords?.lng === null &&
							"#868E96",
					}),
				},
			],
		},
		{
			active: true,
			key: "name",
			label: localizedStrings.vehicle,
			type: "text",
      showSort: true,
		},
		{
			active: false,
			key: "model",
			label: localizedStrings.model,
			type: "text",
			showSort: true
		},
		{
			active: false,
			key: "plate_number",
			label: localizedStrings.plateNumber,
			type: "text",
			showSort: true
		},
		{
			active: false,
			key: "year_manufacturer",
			label: localizedStrings.vehicleYear,
			type: "text",
			showSort: true
		},
		{
			active: true,
			key: "odometer",
			label: localizedStrings.odometer,
			type: "distance",
      showSort: true,
		},
		{
			active: true,
			key: "status",
			label: localizedStrings.status,
			type: "text",
			showTooltip: true,
			style: (vehicle) => {
				const color = vehiclesStatusTypes[vehicle?.status_id]?.color;
				return {
					color: color,
					border: "2px solid " + color,
					borderRadius: "4px",
					padding: "2px 4px",
					backgroundColor: "#fff",
					fontWeight: "bold",
					whiteSpace: 'normal !important',
					textOverflow: 'ellipsis',
					'-webkit-line-clamp': '2',
					display: 'block',
					display: '-webkit-box',
					overflow: "hidden",
					'-webkit-box-orient': 'vertical',
					width: '100%',
					textAlign: 'center',
				};
			},
			tooltipMessage: [
				localizedStrings.statusReport.descriptionStatus,
				<Link
					href={
						"https://help.contelerastreador.com.br/pt-br/article/status-dos-veiculos-67hmpc/"
					}
					target="_blank"
				>
					{" "}
					{localizedStrings.learnMore}
				</Link>,
			],
			showSort: true
		},
		{
			active: false,
			key: "driver",
			label: localizedStrings.driver,
			type: "text",
			fallbackText: localizedStrings.driverNotIdentified,
			showSort: true
		},
		{
			active: false,
			key: "vehicle_groups",
			label: localizedStrings.groups,
			type: "text",
			fallbackText: DEFAULT_NULL_VALUE,
			showSort: true
		},
		{
			active: false,
			key: "command",
			label: localizedStrings.blocked,
			type: "boolean",
			onTrue: localizedStrings.yes,
			onFalse: localizedStrings.no,
			showTooltip: true,
			tooltipMessage: [
				localizedStrings.statusReport.descriptionBlocked,
				<Link
					href={
						"https://help.contelerastreador.com.br/pt-br/article/como-bloquear-e-desbloquear-os-veiculos-1yqw1sd/"
					}
					target="_blank"
				>
					{" "}
					{localizedStrings.learnMore}
				</Link>,
			],
			showSort: true
		},
		{
			active: true,
			key: "state",
			label: localizedStrings.vehicleStage,
			showSort: true,
			showTooltip: true,
			tooltipMessage: [
				localizedStrings.statusReport.descriptionStage,
				<Link
					href={
						"https://help.contelerastreador.com.br/pt-br/article/relatorio-de-status-dos-veiculos-1mknmv2/"
					}
					target="_blank"
				>
					{" "}
					{localizedStrings.learnMore}
				</Link>,
			],
			type: "select",
			options: stageOptions,
			status: 1,
			onChange: handleChangeState,
			name: "stage-select",
			customStyle: {
				menu: () => ({
					position: "fixed",
					backgroundColor: "#fff",
					borderRadius: "4px",
					transform: "translateY(40px) !important",
					border: '1px solid #1A237A'
				}),
				menuPortal: () => ({
					backgroundColor: "#fff",
				}),
				container: () => ({
					border: "1px solid #1A237A !important",
					borderRadius: "4px",
					width: "100% !important",
				}),
				dropdownIndicator: () => ({
					color: "#1A237A !important",
					boxSizing: "border-box",
					borderRadius: "0px 4px 4px",
					backgroundColor: "#fff !important",
					background: "#fff !important",
					border: "1px solid #fff !important",
				}),
				menuList: () => ({
					backgroundColor: "#fff",
				}),
			},
		},
		{
			active: true,
			key: "date",
			label: localizedStrings.lastRecord,
			type: "date",
			showSort: true
		},
		{
			active: false,
			key: "hour",
			label: localizedStrings.hour,
			type: "time",
		},
		{
			active: true,
			key: "idle",
			label: localizedStrings.daysStopped,
			type: "text",
			fallbackText: DEFAULT_NULL_VALUE,
			showSort: true
		},
		{
			active: false,
			key: "manufacturer",
			label: localizedStrings.brand,
			type: "text",
			showSort: true
		},
		{
			...(showAddresses && {
				active: true,
				key: "address",
				label: localizedStrings.addressSingular,
				type: "text",
				showSort: true
			}),
		},
	];
};

export default getTableColumns;
