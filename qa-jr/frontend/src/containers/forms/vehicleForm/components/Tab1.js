import React, { useState, useMemo, useCallback, useEffect } from "react";
import { CardInput, ControlledSelect, HelpIconWithTooltip, Col, Link, ModalChangeVehicleFromContract, ModalChangeModuleFromVehicle, Switch } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { useSelector } from "react-redux";
import generateYearRange from "utils/generateYearRange";
import { useWatch } from "react-hook-form";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getUrlParam } from "utils/params";
import { Title } from "../style";

const MySwal = withReactContent(Swal)
export default function Tab1({ inputsConfig, handleSubmit, onChanges, errors, history }) {

  let defaultDriverAutoFocus = false;
  let paramVehicleId = getUrlParam("vehicle_id");

	const {
		user: {
			user_settings: {
				thousands_separators,
				decimal_separators
			}
		}
	} = useSelector(state => state.auth);

  const {
    drivers, loadLoading: loadingDrivers
  } = useSelector(state => state.drivers);


  const idToFocus = history.location.hash;
  if (idToFocus) {
    if (idToFocus === "#default_driver") {
      defaultDriverAutoFocus = true;
    }
    if (idToFocus === "#odometer") {
      const elementToFocus = window.document.querySelector(
        idToFocus
      );
      if (elementToFocus) elementToFocus.focus();
    }
  }

	const [showOdometerMessage, setShowOdometerMessage] = useState(false);
	const [showVehicleNameMessage, setShowVehicleNameMessage] = useState(false);

  const {
	  trackers,
	  loadLoading
	} = useSelector(state => state.trackers);

	const initialTracker = useMemo(() => {
		if (!Array.isArray(trackers)) return false;

		const [tracker] = trackers.filter(module => +module.vehicle_id === +getUrlParam("vehicle_id")) || [];

		return tracker;
	}, [trackers?.length])

	const {
		user: {
			company_name,
			organization_id,
			is_admin
		},
	} = useSelector((state) => state.auth);

	const userOrganizations = useMemo(() => {
		try {
			const {
				organizations = []
			} = JSON.parse(window.localStorage.getItem("@associated_organization")) || { organizations: [] };
			return organizations;
		} catch (error) {
			console.log(error);
			return []
		}
	}, [])

    const vehicleHasIdentificationDriver = useMemo(() => {
		const [vehicleTracker] = (trackers || []).filter(tracker => tracker.vehicle_id == paramVehicleId);
		return vehicleTracker?.has_identification_driver;
	}, [trackers]);

	const formatValue = (field, value) => {
		const valueInteger = value.replace(',', '').replace('.', '');

		const realValue = valueInteger / 100;

		const replaceDecimalValueRegex = /(.*)(.)(.{2})$/;
		const replaceValue = `$1${decimal_separators}$3`;

		const formattedValue = realValue.toLocaleString("pt-BR",
					{ minimumFractionDigits: 2 })
					.replace(".", thousands_separators)
					.replace(replaceDecimalValueRegex, replaceValue)

		document.querySelector(`#${field}`).value = formattedValue;
	}

	const selectorCompanyName = useWatch({
		control: inputsConfig.control,
		name: 'company_name'
	});
	const selectorTrackerSerialNumber = useWatch({
		control: inputsConfig.control,
		name: 'tracker_serial_number'
	});
	const switchVehicleStatus = useWatch({
		control: inputsConfig.control,
		name: 'status'
	});

	const showConfirmationModal = async () => {
		const inicialCompany = {
			label: company_name,
			value: organization_id
		}

		const { isConfirmed } = await MySwal.fire({
			confirmButtonText: localizedStrings.yes,
			cancelButtonText: localizedStrings.no,
			showCancelButton: false,
			showConfirmButton: false,
			confirmButtonColor: "#1a2565",
			html: <ModalChangeVehicleFromContract
				MySwal={MySwal}
			/>,
			customClass: {
				popup: 'modal-vehicle-container',
				header: 'modal-vehicle-header',
				title: 'modal-vehicle-title',
				content: 'modal-vehicle-content',
			}
		})

		if (!isConfirmed) return inputsConfig.setValue("company_name", inicialCompany);
		handleSubmit()
	}

	const showDeactivationModal = async () => {
		const updateVehicleStatus = !switchVehicleStatus ? 1 : 0;

		if (!switchVehicleStatus) return inputsConfig.setValue('status', updateVehicleStatus);

		const { isConfirmed } = await MySwal.fire({
			confirmButtonText: localizedStrings.yes,
			cancelButtonText: localizedStrings.no,
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonColor: "#1a2565",
			html: <div>
				<p>
					{localizedStrings.disableVehicleAttentionTitle}
				</p>
				<br/>
				<p>
					{localizedStrings.disableVehicleMessage}
				</p>
				<br/>
				<p>
					{localizedStrings.areYouSureUWantToContinue}
				</p>
			</div>,
		})

		if (isConfirmed) return inputsConfig.setValue('status', updateVehicleStatus);
	}
	useEffect(() => {
		const hasChangedOrganization = selectorCompanyName && selectorCompanyName.value !== organization_id;
		if(!selectorCompanyName && !inputsConfig.pageEdit) {
			const [ myCompany = {} ] = userOrganizations.filter(organization => organization?.id === organization_id);
			const selectedCompany = {
				label: myCompany.company_name,
				value: myCompany.id
			}
			inputsConfig.setValue("company_name", selectedCompany);
		}
		if (hasChangedOrganization && inputsConfig.pageEdit) showConfirmationModal();
	}, [
		selectorCompanyName?.value, organization_id
	])
	const showTrackerConfirmationModal = async (initialTracker) => {
		const { isConfirmed } = await MySwal.fire({
			confirmButtonText: localizedStrings.yes,
			cancelButtonText: localizedStrings.no,
			showCancelButton: false,
			showConfirmButton: false,
			confirmButtonColor: "#1a2565",
			html: <ModalChangeModuleFromVehicle
				MySwal={MySwal}
			/>,
			customClass: {
				popup: 'modal-vehicle-container',
				header: 'modal-vehicle-header',
				title: 'modal-vehicle-title',
				content: 'modal-vehicle-content',
			}
		})

		if (!isConfirmed) return inputsConfig.setValue("tracker_serial_number", {
			label: initialTracker?.serial_number,
			value: initialTracker?.id
		});
		handleSubmit()
	}

	useEffect(() => {
		const hasInitialTracker = !!initialTracker;
		const hasChangedTracker = selectorTrackerSerialNumber?.value > 0 && selectorTrackerSerialNumber?.value !== initialTracker?.id;
		if(hasChangedTracker && hasInitialTracker &&!loadLoading && inputsConfig.pageEdit) showTrackerConfirmationModal(initialTracker);
	}, [
		selectorTrackerSerialNumber?.value, 
		initialTracker,
		loadLoading
	])

	

	const contractInput = useCallback(() => (<Col md="6" className="mb-6">
		<ControlledSelect
			style={{ margin: 10 }}
			title={localizedStrings.contract}
			required={true}
			error={errors.company_name.error}
			errorText={errors.company_name.message}
			ref={inputsConfig.register}
			placeholder={localizedStrings.contract}
			control={inputsConfig.control}
			name={"company_name"}
			options={userOrganizations.map(organization => ({
				label: organization.company_name,
				value: organization.id
			}))}
			disabled={userOrganizations.length <= 1}
		/>
	</Col>), [
		userOrganizations,
	])

  return (
		<div style={{ display: "flex", flexWrap: "wrap" }}>
			{contractInput()}
			  <Col md="6" className="mb-6">
				  <ControlledSelect
					  style={{ margin: 10 }}
					  title={localizedStrings.module}
					  ref={inputsConfig.register}
					  placeholder={localizedStrings.module}
					  control={inputsConfig.control}
					  name={"tracker_serial_number"}
					  options={[
						  {
							  label: localizedStrings.unlinkModule,
							  value: 0
						  },
						  ...trackers.filter(tracker => tracker.vehicle_id === null).map(tracker => ({ label: tracker.serial_number, value: tracker.id })),
					  ]}
					  disabled={!is_admin && userOrganizations.length <= 1} 
				  />
				</Col>
			<Col md="6" className="mb-6">
				{showVehicleNameMessage && (
					<span
						style={{
							position: "absolute",
							left: "12rem",
							bottom: "3.5rem",
							width: "20rem",
							backgroundColor: "white",
							border: "2px solid #C2C7CA",
							padding: "1rem",
							borderRadius: "5px",
						}}
					>
						{localizedStrings.vehicleNameToShowInReportsMessage}
					</span>
				)}
				<CardInput
					onChange={onChanges.handleInput}
					onFocus={() => setShowVehicleNameMessage(true)}
					onBlur={() => {
						window.location.hash = "";
						setShowVehicleNameMessage(false);
					}}
					register={inputsConfig.register}
					inputs={[
						{
							label: localizedStrings.vehicleNameToShowInReports,
							name: "name",
							type: "text",
							noMask: true,
							required: true,
							placeholder: localizedStrings.vehicleNameToShowInReports,
							error: errors.name.error,
							errorText: errors.name.message,
							iconAfterText: true,
							icon: (
								<HelpIconWithTooltip
									text={[
										localizedStrings.tooltipHelpTexts.vehicleNameToShowInReportsTooltip.text,
									]}
								/>
							),
						},
					]}
				/>
			</Col>
			<Col md="6" className="mb-6">
				<CardInput
					onChange={onChanges.handleInput}
					register={inputsConfig.register}

					inputs={[
						{
							label: localizedStrings.vehicleModel,
							name: "model",
							type: "text",
							maxLength: 100,
							required: true,
							placeholder: localizedStrings.vehicleModelExample,
							error: errors.model.error,
							errorText: errors.model.message,
						},
					]}
				/>
			</Col>
			<Col md="6" className="mb-6">
				<CardInput
					onChange={onChanges.handleInput}
					register={inputsConfig.register}
					inputs={[
						{
							label: localizedStrings.plateNumber,
							name: "plate_number",
							type: "plate",
							required: true,
							placeholder: localizedStrings.vehiclePlateExample,
							error: errors.plate_number.error,
							errorText: errors.plate_number.message,
						},
					]}
				/>
			</Col>
			<Col md="6" className="mb-6">
				<CardInput
					onChange={onChanges.handleInput}
					register={inputsConfig.register}
					inputs={[
						{
							label:
								localizedStrings.vehicleTank +
								" - " +
								localizedStrings.fillTheMaxCapacity,
							name: "tank_capacity",
							type: "number",
							maxLength: 5,
							required: true,
							placeholder: localizedStrings.vehicleTankExample,
							error: errors.tank_capacity.error,
							errorText: errors.tank_capacity.message,
						},
					]}
				/>
			</Col>
			<Col md="6" className="mb-6">
				<ControlledSelect
					style={{ margin: 10 }}
					title={localizedStrings.vehicleType}
					required={true}
					error={errors.type_vehicle_id.error}
					errorText={errors.type_vehicle_id.message}
					icon={
						<HelpIconWithTooltip
							text={[localizedStrings.tooltipHelpTexts.vehicleType.text]}
						/>
					}
					options={inputsConfig.inputs.vehicleTypeOptions}
					name="type_vehicle_id"
					control={inputsConfig.control}
					placeholder={localizedStrings.selectVehicleType + "..."}
				/>
			</Col>
			<Col md="6" className="mb-6">
				<ControlledSelect
					style={{ margin: 10 }}
					title={localizedStrings.selectManufacturerYear}
					error={errors.year_manufacturer.error}
					errorText={errors.year_manufacturer.message}
					ref={inputsConfig.register}
					placeholder={localizedStrings.selectManufacturerYear}
					control={inputsConfig.control}
					name={"year_manufacturer"}
					options={generateYearRange()}
				/>
			</Col>
			<Col md="6" className="mb-6">
				<CardInput
					onChange={(...values) => {
						onChanges.handleInput(...values);
						formatValue(...values);
					}}
					register={inputsConfig.register}
					inputs={[
						{
							label: localizedStrings.fuelPrice,
							name: "liters_value",
							type: "mini_money",
							maskOptions: { reverse: true },
							required: true,
							placeholder: localizedStrings.vehicleLitersPriceExample(decimal_separators),
							error: errors.liters_value.error,
							errorText: errors.liters_value.message,
							iconAfterText: true,
							icon: (
								<HelpIconWithTooltip
									text={[
										localizedStrings.tooltipHelpTexts.vehicleFuelPrice.text,
										<Link
											href={
												localizedStrings.tooltipHelpTexts
													.vehicleMedianConsumption.link
											}
											target={"_blank"}
										>
											{" "}
											{localizedStrings.learnMore}
										</Link>,
									]}
								/>
							),
						},
					]}
				/>
			</Col>
			<Col md="6" className="mb-6">
				<CardInput
					onChange={(...values) => {
						onChanges.handleInput(...values);
						formatValue(...values);
					}}
					register={inputsConfig.register}
					inputs={[
						{
							label: localizedStrings.medianConsumptionOfFuel,
							name: "average_fuel_km",
							type: "average_liters",
							iconAfterText: true,
							icon: (
								<HelpIconWithTooltip
									text={[
										localizedStrings.tooltipHelpTexts.vehicleMedianConsumption
											.text,
										<Link
											href={
												localizedStrings.tooltipHelpTexts
													.vehicleMedianConsumption.link
											}
											target={"_blank"}
										>
											{" "}
											{localizedStrings.learnMore}
										</Link>,
									]}
								/>
							),
							maskOptions: { reverse: true },
							required: true,
							placeholder:
								localizedStrings.vehicleMedianPriceConsumptionExample,
							error: errors.average_fuel_km.error,
							errorText: errors.average_fuel_km.message,
						},
					]}
				/>
			</Col>
			<Col md="6" className="mb-6">
				{showOdometerMessage && (
					<span
						style={{
							position: "absolute",
							left: "12rem",
							bottom: "3.5rem",
							width: "20rem",
							backgroundColor: "white",
							border: "2px solid #C2C7CA",
							padding: "1rem",
							borderRadius: "5px",
						}}
					>
						{localizedStrings.editOdometerMessage}
					</span>
				)}
				<CardInput
					onChange={onChanges.handleInput}
					onFocus={() => setShowOdometerMessage(true)}
					onBlur={() => {
						window.location.hash = "";
						setShowOdometerMessage(false);
					}}
					register={inputsConfig.register}
					inputs={[
						{
							label: localizedStrings.odometerAdjustment,
							name: "odometer",
							maxLength: 20,
							placeholder: inputsConfig.pageEdit ? localizedStrings.vehicleOdometerExample : "",
							error: errors.odometer.error,
							errorText: errors.odometer.message,
							iconAfterText: true,
							readOnly: !inputsConfig.pageEdit,
							icon: (
								<HelpIconWithTooltip
									text={[
										!!inputsConfig.pageEdit 
										? localizedStrings.tooltipHelpTexts.vehicleOdometerAdjustment.text
										: localizedStrings.tooltipHelpTexts.vehicleOdometerCreate.text,
										<Link
											href={
												!!inputsConfig.pageEdit
												? localizedStrings.tooltipHelpTexts.vehicleOdometerAdjustment.link
												: localizedStrings.tooltipHelpTexts.vehicleOdometerCreate.link
											}
											target={"_blank"}
										>
											{" "}
											{localizedStrings.learnMore}
										</Link>,
									]}
								/>
							),
						},
					]}
				/>
			</Col>
			<Col md="6" className="mb-6">
				<ControlledSelect
					style={{ margin: 10 }}
					title={localizedStrings.fuelType}
					required={true}
					error={errors.type_fuel_id.error}
					errorText={errors.type_fuel_id.message}
					options={inputsConfig.inputs.fuelTypeOptions}
					name="type_fuel_id"
					control={inputsConfig.control}
					placeholder={localizedStrings.selectFuelType + "..."}
				/>
			</Col>
			{!vehicleHasIdentificationDriver && (
				<Col md="6" className="mb-6">
					<ControlledSelect
						style={{ margin: 10 }}
						title={localizedStrings.selectTheDefaultDriver}
						error={errors.default_driver.error}
						errorText={errors.default_driver.message}
						onBlur={() => {
							window.location.hash = "";
						}}
						loading={loadingDrivers}
						name="vehicle_driver_id"
						control={inputsConfig.control}
						options={
							drivers?.map((driver) => {
								return {
									label: driver.name,
									value: driver.id,
								};
							}) || []
						}
						placeholder={localizedStrings.selectADriver + "..."}
						autoFocus={defaultDriverAutoFocus}
						emptyStateText={localizedStrings.noDriverFound}
						isClearable={true}
					/>
				</Col>
			)}
			<Col md="6" className="mb-6">
        		<CardInput
					onChange={onChanges.handleInput}
					register={inputsConfig.register}
					inputs={[
						{
							label: localizedStrings.brand,
							name: "manufacturer",
							maxLength: 60,
							required: false,
							placeholder: localizedStrings.manufacturerName,
							type: "text",
						},]}
          		/>
        	</Col>
			{inputsConfig.pageEdit && is_admin && (
				<Col md="6" className="mb-6">
					<div style={{ margin: 10 }}>
						<Title>
							{localizedStrings.vehicleSituation}
							<HelpIconWithTooltip text={''} />
						</Title>
						<div style={{ marginTop: 12 }}>
							<Switch
								checked={switchVehicleStatus}
								ref={inputsConfig.register('status')}
								onCheck={showDeactivationModal}
								text={switchVehicleStatus ? localizedStrings.activated : localizedStrings.desactivated}
								disableSwitch={(switchVehicleStatus === undefined)}
							/>
						</div>
					</div>
				</Col>
			) || ''}
		</div>
	);
}
