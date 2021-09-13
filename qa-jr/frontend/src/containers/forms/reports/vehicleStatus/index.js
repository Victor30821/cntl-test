import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Card,
	Button,
	FilterInput,
	Checkbox,
	Modal,
	XLSXExport,
	Switch,
	HelpIconWithTooltip,
	Link,
	Select,
	Icon,
} from "components";
import { Nav } from "reactstrap";
import { getUrlParam, setUrlParam } from "utils/params";
import { localizedStrings } from "constants/localizedStrings";
import ExportXLSX from "../../../../exports/xlsx/xlsx-report.export-vehicle-status";
import format from "date-fns/format";
import { toggleVehicleStatusReportAutoRefresh } from "store/modules";
import {
	Col,
	Row
} from "reactstrap";
import TableHeader from "containers/tableHeader";

export default function ReportsVehicleStatusForm({
	setSearchTerm,
	setSelectedIdleDays,
	setWatchSeconds,
	handleDrawer,
	stageOptions,
	selectedFilter,
	setSelectedFilter,
	selectedIdleRule,
	setSelectedIdleRule,
	showAddresses,
	setShowAddresses,
	clearFilters,
	showClearFilters,
	showAdvancedFiltersDrawer
}) {
	const dispatch = useDispatch();

	const { vehicleStatusReportAutoRefresh } = useSelector(
		(state) => state.general
	);
	const { loadLoading, loadFail, total } = useSelector(
		(state) => state.vehicleStatusReports
	);

	const {
		user: { user_settings, vehicles, role_id, organization_id },
	} = useSelector((state) => state.auth);

	const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({
		notFound: false,
		success: false,
	});
	const [docXlsx, setDocXlsx] = useState([]);
	const [openXLSXModal, setOpenXLSXModal] = useState(false);
	const inputTimeout = useRef(null);

	const [secondsToUpdate, setSecondsToUpdate] = useState(15);

	const manageAutoRefresh = () => {
		if (!vehicleStatusReportAutoRefresh) return;
		if (secondsToUpdate > 0) {
			setTimeout(() => setSecondsToUpdate(secondsToUpdate - 1), 1000);
			return;
		}
		setWatchSeconds((prevState) => prevState + 1);
		setSecondsToUpdate(15);
	};

	useEffect(() => {
		manageAutoRefresh();
	}, [secondsToUpdate]);

	const onSearchTermChange = (term = false) => {
		const lowerCaseTerm = term?.toLowerCase();
		inputTimeout != null &&
			inputTimeout.current &&
			clearTimeout(inputTimeout.current);
		inputTimeout.current = setTimeout(() => {
			setUrlParam("search", lowerCaseTerm);
			setSearchTerm(term);
		}, 1000);
	};

	const onIdleDaysChange = (input = null) => {
		inputTimeout != null &&
			inputTimeout.current &&
			clearTimeout(inputTimeout.current);
		inputTimeout.current = setTimeout(() => {
			setSelectedIdleDays(Number(input));
		}, 500);
	};

	const XLSXexportJSX = () => {
		return (
			<XLSXExport
				document={docXlsx}
				fileName={`relatorio-status-veiculo-${format(
					new Date(),
					"dd-MM-yyyy-HH-mm"
				)}`}
				successStatus={statusSuccessXLSX.success}
			/>
		);
	};

	const exportReport = (type) => {
		const typeExport = {
			pdf: () => {},
			xlsx: () => {
				setOpenXLSXModal((openXLSXModal) => (openXLSXModal = true));
				setStatusSuccessXLSX({ success: false });
				ExportXLSX({
					setStatusSuccessXLSX,
					setDocXlsx,
					user_settings,
					vehicles,
					role_id,
					organization_id,
				});
			},
		};
		return typeExport[type]();
	};

	const handleAutoRefreshSwitch = () =>
		dispatch(toggleVehicleStatusReportAutoRefresh());

	const hasZeroLength = total === 0 && !loadLoading && !loadFail;

	return (
		<Card className={"flex column"}>
			<Modal
				open={openXLSXModal}
				setOpen={setOpenXLSXModal}
				header={XLSXexportJSX()}
			/>
			<TableHeader container={
				{ maxHeight: "unset", alignItems: "flex-start" }
			}>
				<Row className="flex" style={{ flex: 1 }}>
					<Col xl="6" className="flex">
						<FilterInput
							width={"100%"}
							height={"100%"}
							marginLeft={"0px"}
							defaultValue={getUrlParam("search")}
							placeholder={localizedStrings.searchByKey}
							onChange={onSearchTermChange}
						/>
						<Icon
								divProps={{ padding: "9px 9px 9px 9px", marginLeft: "9px", border: ".5px solid #E5E5E5", borderRadius: "6px", backgroundColor: showAdvancedFiltersDrawer ? "#1A237A" : "white" }}
								icon={'filter'}
								width={'16px'}
								height={'16px'}
								color={showAdvancedFiltersDrawer ? "white" : "#1A237A"}
								cursor="pointer"
								onClick={handleDrawer}
						/>
						<span
								style={{
									fontSize: ".8rem",
									color: "red",
									cursor: "pointer",
									margin: ".8rem",
									fontWeight: "bold",
									visibility: showClearFilters ? 'visible' : 'hidden',
								}}
								onClick={clearFilters}
						>
							X {localizedStrings.clearFilters}
						</span>
						{/* <Select
						style={{
								minWidth: "150px",
								margin: "auto 5px",
						}}
						required={true}
						placeholder={"Estágio do veículo"}
						value={
							stageOptions.find((elem) => elem?.value === selectedFilter?.value)
								? selectedFilter
								: null
						}
						options={stageOptions}
						onChange={(stage) => setSelectedFilter({...stage, value: `vehicle_stage_id:${stage.value}`})}
					/>
					<Select
						style={{
								minWidth: "150px",
								margin: "auto 5px",
						}}
						required={true}
						placeholder={localizedStrings.statusReport.searchRule}
						value={selectedIdleRule}
						options={[
							{
								label: "Nenhuma regra",
								value: null,
							},
							{
								label: "Igual à",
								value: "idleEqual",
							},
							{
								label: "Maior que",
								value: "idleGreatherThan",
							},
							{
								label: "Menor que",
								value: "idleLesserThan",
							},
						]}
						onChange={(idleRule) => {
							setSelectedIdleRule(idleRule);
							setSelectedFilter(null);
						}}
					/> */}
					</Col>
					<Col xl="6" className="flex">
						{/* <FilterInput
							height={"100%"}
							maxHeight="40px"
							maxWidth="100px"
							margin="auto 0"
							width={"100%"}
							marginLeft={"1rem"}
							placeholder={"Dias"}
							onChange={onIdleDaysChange}
							hasIcon={false}
							hasHelpText={false}
							disabled={!selectedIdleRule?.value}
							border={!selectedIdleRule?.value && "1px solid #6C757D"}
							borderRadius={"5px"}
						/> */}
					<Switch
						checked={vehicleStatusReportAutoRefresh}
						onCheck={handleAutoRefreshSwitch}
						text={localizedStrings.refreshAutomatic}
							margin="auto 8px"
							optionsSwitchDiv={{ marginLeft: "1rem" }}
						textOptions={{
							style: {
								fontWeight: "bold",
								color: "#666666",
								marginTop: "3px",
								whiteSpace: "pre",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							},
						}}
						icon={
							<HelpIconWithTooltip
								divProps={{
									display: "flex",
									alignItems: "center",
								}}
								text={[
									localizedStrings.tooltipHelpTexts
										.vehicleStatusReportAutoRefresh.text,
									<Link
										href={
											localizedStrings.tooltipHelpTexts
												.vehicleStatusReportAutoRefresh.link
										}
										target={"_blank"}
									>
										{" "}
										{localizedStrings.learnMore}
									</Link>,
								]}
							/>
						}
					/>

					<Checkbox
							divOptions={{ marginLeft: "12px" }}
						checked={showAddresses}
						title={localizedStrings.showAddresses}
						onChange={() => {
							setShowAddresses(prevState => !prevState)
						}}
						></Checkbox>
				{hasZeroLength && (
							<Nav as="div" className={"fullContainerHeight"} style={{
								flex: "1",
								display: "flex",
								justifyContent: "flex-end",
							}}>
						<Button
							hasIcon={true}
							onClick={() => exportReport("xlsx")}
							iconConfig={{
								icon: "xlsx",
								width: "15px",
								color: "#192379",
							}}
									margin="auto 5px"
							backgroundColor="#fff"
							border="1px solid #E5E5E5"
							width="41px"
							minWidth="41px"
									padding="0"
							hover={{
								backgroundColor: "#F5F5FF",
							}}
							as={"a"}
						/>
					</Nav>
				)}
					</Col>
				</Row>
			</TableHeader>
		</Card>
	);
}
