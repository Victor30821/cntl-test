import React, { useState, useEffect } from 'react';
import { Card, CardForm, TextArea, FileInput, DateInput, RadioButton, CardInput, Select, Col, BottomActionButtons } from 'components'
import { Row } from "reactstrap";
import { localizedStrings } from "constants/localizedStrings";
import { useDispatch, useSelector } from 'react-redux';
import { fuelChangeSelectors } from "store/modules";
import { toast } from 'react-toastify';
import populateSelects from "constants/populateSelects";
import $ from 'jquery';
import 'jquery-mask-plugin/dist/jquery.mask.min';

export default function FuelForm({ history, onSubmit, inputsConfig, formId }) {
    const dispatch = useDispatch()
    const [fuel] = useState(inputsConfig.getValues());

    const {
        selectors
    } = useSelector(state => state.fuelSupplies);

    const {
        user: { user_settings: { volumetric_measurement_unit, distance_unit } }
    } = useSelector(state => state.auth);

    const [fieldsToValidate,] = useState([
        "driver",
        "vehicle",
        "fuel_date",
        "fuel_hour",
        "odometer",
        "liters",
        "liter_value",
    ]);
    const [errors, setErrors] = useState({
        driver: {
            message: "",
            error: false,
        },
        vehicle: {
            message: "",
            error: false,
        },
        fuel_date: {
            message: "",
            error: false,
        },
        fuel_hour: {
            message: "",
            error: false,
        },
        odometer: {
            message: "",
            error: false,
        },
        liters: {
            message: "",
            error: false,
        },
        liter_value: {
            message: "",
            error: false,
        },
    });

    function handleFile(data) {
        try {
            const [formFile] = data.target.files;
            if (!formFile) return;
            const [
                name,
                contentType
            ] = [
                    formFile?.name,
                    formFile?.type,
                ]
            if (!name || !contentType) throw new Error('error');
            const newUpload = {
                ...inputsConfig?.upload,
                name,
                headers: {
                    ContentType: contentType
                },
                file: data.target.files
            }
            inputsConfig.setUpload(newUpload)
        } catch (error) {
            toast.error(localizedStrings.errorWhenAttachingImage)
        }
    }

    const handleCalcTotal = (input) => {
        try {
            const { liter_value, liters, total_value } = inputsConfig.getValues();

            if(total_value > 0 && !liter_value && !liters) return total_value;

            const litersValue = $('#liters').masked(liters).replace(/[.]/g, '').replace(',', '.'),
                totalLiters = $('#liter_value').masked(liter_value).replace(/[.]/g, '').replace(',', '.');
            const total = totalLiters * litersValue,
                formattedTotal = total.toFixed(2);

            inputsConfig.onChange(input, formattedTotal);
            inputsConfig.setTotalLitersValue($('#liter_value').masked(formattedTotal));
        }
        catch (e) {
            console.log(e);
            inputsConfig.setTotalLitersValue(0);
        }
    }

    const showError = (field, message = localizedStrings.fieldRequired) => {
        if (!errors[field]) return;
        errors[field].message = message;
        errors[field].error = true;
    }
    const clearError = field => {
        if (!errors[field]) return;
        errors[field].message = "";
        errors[field].error = false;
    }

    function handleError({
        fields
    }) {
        let hasError = false;
        try {
            // eslint-disable-next-line
            fields.map(field => {
                const [
                    fieldValue,
                    selectorValue
                ] = [
                        inputsConfig.getValues()?.[field] ?? "",
                        selectors[field]
                    ];

                const hasValue = fieldValue.toString().trim() || selectorValue;
                hasValue
                    ? clearError(field)
                    : showError(field)
                hasError += !hasValue
            })

            setErrors({ ...errors });
        } catch (error) {
            console.log(error);
        }
        return !!hasError
    }

    const handleSubmit = (e) => {
        const hasError = handleError({ fields: fieldsToValidate });

        if (!hasError) onSubmit(e);
    }
    const getPricePerLiterLabel = () => {
        try {

            const volumetricUnit = populateSelects.volumetricUnit.find(volumetric => volumetric.value === volumetric_measurement_unit)?.unit;

            if (!volumetricUnit) throw new Error('Error getting units');

            return localizedStrings.price + `/${volumetricUnit}`;
        } catch (error) {
            return localizedStrings.price;
        }
    }
    const getLiterLabel = () => {
        try {

            const volumetricLabel = populateSelects.volumetricUnit.find(volumetric => volumetric.value === volumetric_measurement_unit)?.label;
            const name = volumetricLabel
                .split(" - ")
                .pop()
                .replace(" ", "")
                .toLowerCase();

            if (!name) throw new Error('Error getting units');

            return localizedStrings.volumetricUnitNames[name];
        } catch (error) {
            return localizedStrings.volumetricUnitNames.liter
        }
    }

    useEffect(() => {
        const { liters, liter_value } = inputsConfig.getValues();
        if(liters && liter_value) {
            handleCalcTotal('total_value')
        } 
    // eslint-disable-next-line
    }, [inputsConfig.watch("liter_value"), inputsConfig.watch("liters")])

    return (
        <>
            <Card margin={"25px 25px 0px 25px"}>
                <CardForm id={formId} padding={"16px 16px 0px 16px"} margin={"10px 0 0 0"}>
                    <Row>
                        <Col md="6" className="mb-6" style={{ marginBottom: '10px' }}>
                            <Select
                                title={localizedStrings.driver}
                                required={true}
                                error={errors.driver.error}
                                errorText={errors.driver.message}
                                loading={inputsConfig.inputs.loadingDrivers}
                                options={inputsConfig.inputs.driverOptions}
                                placeholder={localizedStrings.selectADriver}
                                onChange={(item) => {
                                    dispatch(fuelChangeSelectors({
                                        selectors: { driver: item }
                                    }))
                                }}
                                value={selectors?.driver || {}}
                                emptyStateText={localizedStrings.noDriveCreated}
                            />
                        </Col>
                        <Col md="6" className="mb-6" style={{ marginBottom: '10px' }}>
                            <Select
                                title={localizedStrings.vehicle}
                                required={true}
                                error={errors.vehicle.error}
                                errorText={errors.vehicle.message}
                                loading={inputsConfig.inputs.loadingVehicles}
                                options={inputsConfig.inputs.vehicleOptions}
                                placeholder={localizedStrings.selectAVehicle}
                                onChange={(item) => {
                                    dispatch(fuelChangeSelectors({
                                        selectors: { vehicle: item }
                                    }))
                                }}
                                value={selectors?.vehicle || {}}
                                emptyStateText={localizedStrings.noVehicleCreated}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mb-4" style={{ marginBottom: '5px' }}>
                            <DateInput
                                onChange={(e, { target }) => inputsConfig.onChange("fuel_date", target?.value)}
                                register={inputsConfig.register}
                                calendar={{
                                    ref: inputsConfig.register({
                                        name: "fuel_date",
                                        required: true
                                    })
                                }}
                                error={errors.fuel_date.error}
                                errorText={errors.fuel_date.message}
                                required={true}
                                label={localizedStrings.date}
                                name={"fuel_date"}
                                placeholder={"dd/mm/aaaa"}
                                value={fuel.fuel_date}
                            />
                        </Col>
                        <Col md="4" className="mb-4" style={{ marginBottom: '5px' }}>
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.hour,
                                        name: "fuel_hour",
                                        type: "time",
                                        error: errors.fuel_hour.error,
                                        errorText: errors.fuel_hour.message,
                                        required: true,
                                    },
                                ]}
                            />
                        </Col>
                        <Col md="4" className="mb-4" style={{ marginBottom: '5px' }}>
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.odometer + ` (${distance_unit})`,
                                        name: "odometer",
                                        type: "number",
                                        error: errors.odometer.error,
                                        errorText: errors.odometer.message,
                                        required: true,
                                        placeholder: localizedStrings.writeOdometer,
                                    },
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4" className="mb-4" style={{ marginBottom: '5px' }}>
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: getLiterLabel(),
                                        name: "liters",
                                        type: "liters",
                                        maskOptions: {
                                            reverse: true
                                        },
                                        error: errors.liters.error,
                                        errorText: errors.liters.message,
                                        placeholder: localizedStrings.writeTotalQuantity,
                                        required: true,
                                    }
                                ]}
                            />
                        </Col>
                        <Col md="4" className="mb-4" style={{ marginBottom: '5px' }}>
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: getPricePerLiterLabel(),
                                        name: "liter_value",
                                        type: "money",
                                        maskOptions: {
                                            reverse: true
                                        },
                                        error: errors.liter_value.error,
                                        errorText: errors.liter_value.message,
                                        maxLength: 5,
                                        placeholder: localizedStrings.writePrice,
                                        required: true,
                                    }
                                ]}
                            />
                        </Col>
                        <Col md="4" className="mb-4" style={{ marginBottom: '5px' }}>
                            <CardInput
                                onChange={(field,value)=>inputsConfig.setTotalLitersValue(value)}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.total_price,
                                        name: "total_value",
                                        type: "money",
                                        maskOptions: {
                                            reverse: true
                                        },
                                        placeholder: localizedStrings.writeTotalPrice,
                                        value: inputsConfig.totalLitersValue || ""
                                    }
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md="8" className="mb-8" style={{ marginBottom: '5px' }}>
                            <TextArea
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                label={localizedStrings.observation}
                                name={"fuel_observation"}
                                placeholder={localizedStrings.writeObservation}
                                defaultValue={fuel.fuel_observation}
                            />
                        </Col>
                        <Col md="4" className="mb-4" style={{ marginBottom: '5px' }}>
                            <Row>
                                <Col md="12" className="mb-12">
                                    <FileInput
                                        label={localizedStrings.file}
                                        id="fileFuel"
                                        placeholder={inputsConfig?.upload?.name || localizedStrings.filePlaceHolder}
                                        onChange={handleFile}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12" className="mb-12">
                                    <CardInput
                                        register={inputsConfig.register}
                                        inputs={[
                                            {
                                                label: localizedStrings.combustibleType,
                                                name: "fuel_type_id",
                                                type: "custom",
                                                initialValue: inputsConfig.getValues().fuel_type_id,
                                                component: (props) =>
                                                    <RadioButton
                                                        name={'fuel_type_id'}
                                                        inputs={[
                                                            {
                                                                default: true,
                                                                text: localizedStrings.gasoline,
                                                                value: "1",
                                                                onChange: (e, { value }) => inputsConfig.onChange("fuel_type_id", value)
                                                            },
                                                            {
                                                                default: false,
                                                                text: localizedStrings.ethanol,
                                                                value: "2",
                                                                onChange: (e, { value }) => inputsConfig.onChange("fuel_type_id", value)
                                                            },
                                                            {
                                                                default: false,
                                                                text: localizedStrings.diesel,
                                                                value: "4",
                                                                onChange: (e, { value }) => inputsConfig.onChange("fuel_type_id", value)
                                                            },
                                                            {
                                                                default: false,
                                                                text: localizedStrings.gnv,
                                                                value: "3",
                                                                onChange: (e, { value }) => inputsConfig.onChange("fuel_type_id", value)
                                                            },
                                                        ]}
                                                        {...props}
                                                    />
                                            }
                                        ]}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12" className="mb-12">
                                    <CardInput
                                        register={inputsConfig.register}
                                        inputs={[
                                            {
                                                name: "fully_filled",
                                                label: localizedStrings.tank,
                                                type: "custom",
                                                initialValue: inputsConfig.getValues().fully_filled,
                                                component: (props) =>
                                                    <RadioButton
                                                        name={'fully_filled'}
                                                        inputs={[
                                                            {
                                                                text: localizedStrings.complete,
                                                                default: true,
                                                                value: "1",
                                                                name: localizedStrings.complete,
                                                                onChange: (e, { value }) => inputsConfig.onChange("fully_filled", value)
                                                            },
                                                            {
                                                                text: localizedStrings.partial,
                                                                default: false,
                                                                value: "2",
                                                                name: localizedStrings.partial,
                                                                onChange: (e, { value }) => inputsConfig.onChange("fully_filled", value)
                                                            },

                                                        ]}
                                                        {...props}
                                                    />
                                            }
                                        ]}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardForm>
            </Card>
            <BottomActionButtons
                formId={"fuel"}
                onSave={handleSubmit}
            />
        </>
    );
}
