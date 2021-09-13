import React, { useState, useEffect, useRef } from 'react';
import { Card, CardForm, CardInput, Select, Col, BottomActionButtons } from 'components'
import { Row } from "reactstrap";
import { localizedStrings } from "constants/localizedStrings";
import { useDispatch, useSelector } from 'react-redux';
import { clientChangeSelectors, searchAddreessFromZipCode } from "store/modules";
import {
    cities, getCityByName, getExactCity
} from 'utils/cities'

export default function ClientForm({
    history,
    onSubmit,
    inputsConfig,
    formId
}) {
    const dispatch = useDispatch()

    const selectInputRef = useRef(null);

    const zipcodeInputRef = useRef(null);

    const {
        selectors,
    } = useSelector(state => state.clients);

    const {
        searchedAddress,
    } = useSelector(state => state.map);

    const [visibleCities, setVisibleCities] = useState([])

    const [fieldsToValidate,] = useState([
        "company_name",
        "trading_name",
        "identification",
        "zipcode",
    ]);
    const [errors, setErrors] = useState({
        company_name: {
            message: "",
            error: false,
        },
        trading_name: {
            message: "",
            error: false,
        },
        identification: {
            message: "",
            error: false,
        },
        zipcode: {
            message: "",
            error: false,
        },
    });

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

    const handlerIndentificationAndZipCode = ({ fields }) => {
        let hasError = false;
        try {

            const hasToIgnoreValidationFields = [
                "company_name",
                "trading_name",
            ];

            fields.map(field => {
                const [
                    fieldValue
                ] = [
                        inputsConfig.getValues()?.[field] ?? "",
                        selectors[field]
                    ];

                const hasToValidateField = hasToIgnoreValidationFields.includes(field);
                
                if(hasToValidateField === false) {

                    if(field === "identification") {
                        
                        const is_cpf = fieldValue?.length === 14;
                        const is_cnpj = fieldValue?.length === 18;

                        if(is_cpf === false && is_cnpj === false) {
                            errors[field].message = localizedStrings.minCpfCpjError;
                            errors[field].error = true;
                            hasError = true; 
                        }

                        if(is_cpf === true || is_cnpj === true) {
                            errors[field].message = "";
                            errors[field].error = false;
                            hasError = false;
                        }

                    }

                    if(field === "zipcode") {

                        const has_zipcode = fieldValue?.length === 9;

                        if(has_zipcode === false) {
                            errors[field].message = localizedStrings.minZipcode;
                            errors[field].error = true;
                            hasError = true; 
                        }

                        if(has_zipcode) {
                            errors[field].message = "";
                            errors[field].error = false;
                            hasError = false; 
                        }

                    }

                }

                return hasError;
            })

            setErrors({ ...errors });
        } catch (error) {
            console.log(error);
        }
        return !!hasError

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

        const hasMinimunErrors = handlerIndentificationAndZipCode({ fields: fieldsToValidate });

        if (!hasError && !hasMinimunErrors) onSubmit(e);
    }


    const onSelectInputChange = value => {
        selectInputRef?.current && clearTimeout(selectInputRef?.current);

        selectInputRef.current = setTimeout(() => {
            const MIN_TYPED_LENGTH = 1;

            if (value?.length <= MIN_TYPED_LENGTH) return;

            const searchedCities = getCityByName({ name: value });

            setVisibleCities(searchedCities)
        }, 1000)
    }

    const onZipcodeChange = value => {
        zipcodeInputRef?.current && clearTimeout(zipcodeInputRef?.current);

        zipcodeInputRef.current = setTimeout(() => {

            const hasCompletedZipcode = value?.length === localizedStrings.zipcodeMask.length;

            if (!hasCompletedZipcode) return;

            dispatch(searchAddreessFromZipCode({
                zipCode: value,
            }))
        }, 1000)
    }

    const setAddressSettings = () => {
        if (!searchedAddress?.city) return;

        const selectedCity = getExactCity({ name: searchedAddress.city });

        [
            "neighborhood",
            "address",
        ].forEach(ids => {
            inputsConfig.onChange(ids, searchedAddress[ids]);
        });

        dispatch(clientChangeSelectors({
            selectors: { city: selectedCity }
        }))
    }

    const getIdentificationMask = valueLength => {
        const masks = {
            userMask: localizedStrings.userIdentificationMask,
            companyMask: localizedStrings.companyIdentificationMask,
        };

        if (valueLength > masks.userMask.length) return masks.companyMask;

        return localizedStrings.userIdentificationMaskWithExtraZero;
    };

    useEffect(() => {

        const initialCities = cities.slice(0, 10);

        setVisibleCities(initialCities)

    }, []);

    useEffect(() => {

        setAddressSettings();
    // eslint-disable-next-line
    }, [searchedAddress]);

    return (
        <>
            <Card margin={"25px 25px 0px 25px"}>
                <CardForm id={formId} padding={"16px"}>
                    <Row style={{
                        margin: "10px 0"
                    }}>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.name,
                                        defaultValue: inputsConfig.getValues()?.company_name,
                                        name: "company_name",
                                        type: "text",
                                        error: errors.company_name.error,
                                        errorText: errors.company_name.message,
                                        required: true,
                                        placeholder: localizedStrings.typeClientName
                                    },
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.companyName,
                                        defaultValue: inputsConfig.getValues()?.trading_name,
                                        name: "trading_name",
                                        type: "text",
                                        error: errors.trading_name.error,
                                        errorText: errors.trading_name.message,
                                        required: true,
                                        placeholder: localizedStrings.typeCompanyName
                                    },
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.companyIdentification,
                                        defaultValue: inputsConfig.getValues()?.identification,
                                        name: "identification",
                                        type: "custom",
                                        mask: getIdentificationMask(inputsConfig.getValues()?.identification?.length),
                                        maskOptions: {
                                            onKeyPress: (value, e, field, options) => {
                                                field.mask(
                                                    getIdentificationMask(value.length),
                                                    options
                                                );
                                            }
                                        },
                                        error: errors.identification.error,
                                        errorText: errors.identification.message,
                                        required: true,
                                        placeholder: localizedStrings.typeCompanyIdentification
                                    },
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.contactName,
                                        defaultValue: inputsConfig.getValues()?.contact_name,
                                        name: "contact_name",
                                        type: "text",
                                        placeholder: localizedStrings.typeContactName,
                                    },
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row style={{
                        margin: "10px 0"
                    }}>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.phone,
                                        defaultValue: inputsConfig.getValues()?.phone,
                                        name: "phone",
                                        type: "phone",
                                        placeholder: localizedStrings.typePhone,
                                    },
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.email,
                                        defaultValue: inputsConfig.getValues()?.email,
                                        name: "email",
                                        type: "email",
                                        placeholder: localizedStrings.typeEmail,
                                    },
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={(field, value) => {
                                    inputsConfig.onChange(field, value);
                                    onZipcodeChange(value)
                                }}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.zipcode,
                                        defaultValue: inputsConfig.getValues()?.zipcode,
                                        name: "zipcode",
                                        error: errors.zipcode.error,
                                        errorText: errors.zipcode.message,
                                        required: true,
                                        type: "zipcode",
                                        placeholder: localizedStrings.typeZipcode,
                                    },
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.address,
                                        value: inputsConfig.getValues()?.address,
                                        name: "address",
                                        type: "text",
                                        readOnly: true,
                                        placeholder: localizedStrings.typeAddress,
                                    },
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row style={{
                        margin: "10px 0"
                    }}>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.neighborhood,
                                        value: inputsConfig.getValues()?.neighborhood,
                                        name: "neighborhood",
                                        type: "text",
                                        readOnly: true,
                                        placeholder: localizedStrings.typeNeighborhood,
                                    }
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3" style={{
                            margin: "10px 0"
                        }}>
                            <Select
                                style={{
                                    margin: "0 10px"
                                }}
                                disabled
                                title={localizedStrings.city}
                                options={visibleCities}
                                onInputChange={onSelectInputChange}
                                onChange={(item) => {
                                    dispatch(clientChangeSelectors({
                                        selectors: { city: item }
                                    }))
                                }}
                                value={selectors?.city || {}}
                                emptyStateText={localizedStrings.noCityFound}
                                placeholder={localizedStrings.selectACity}
                            />
                        </Col>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.number,
                                        defaultValue: inputsConfig.getValues()?.number,
                                        name: "number",
                                        type: "addressNumber",
                                        placeholder: localizedStrings.typeNumber,
                                    }
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.complement,
                                        defaultValue: inputsConfig.getValues()?.complement,
                                        name: "complement",
                                        type: "text",
                                        placeholder: localizedStrings.typeComplement,
                                    }
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row style={{
                        margin: "10px 0"
                    }}>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.externalId,
                                        defaultValue: inputsConfig.getValues()?.external_id,
                                        name: "external_id",
                                        type: "text",
                                        placeholder: localizedStrings.typeExternalId,
                                    }
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3" >
                            <CardInput
                                onChange={inputsConfig.onChange}
                                register={inputsConfig.register}
                                inputs={[
                                    {
                                        label: localizedStrings.observations,
                                        defaultValue: inputsConfig.getValues()?.observation,
                                        name: "observation",
                                        type: "text",
                                        placeholder: localizedStrings.typeObservation,
                                    }
                                ]}
                            />
                        </Col>
                    </Row>
                </CardForm>
            </Card>
            <BottomActionButtons
                formId={"fuel"}
                onSave={handleSubmit}
                onCancel={() => history.goBack()}
            />
        </>
    );
}
