import React, { useEffect, useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MenuWithLogoBar, DriverForm, DescriptionPageHeader } from 'containers'
import { editDriver, driverChangeOperationStates,  } from 'store/modules'
import { BottomActionButtons, RadioButton, DateInput, HelpIconWithTooltip, Link } from 'components'
import { format, } from 'date-fns'
import { useForm } from 'react-hook-form'
import { localizedStrings } from 'constants/localizedStrings';
import { DRIVERS_MANAGE_PATH } from 'constants/paths';
import { setUrlParam } from 'utils/params';

export default function DriversEdit({ history, title, subtitle, icon, mainPage }) {
    const dispatch = useDispatch();
    const { register, setValue, handleSubmit, formState:{ dirty } } = useForm();

    const initialValue = history.location.state?.driver;

    const [expireDriverLicence, setExpireDriverLicence] = useState({ date: new Date(new Date(initialValue.expire_driver_license).setHours(24)) });
    const [driverStatus, setDriverStatus] = useState(initialValue.status)
    const {
        editSuccess, editLoading,
    } = useSelector(state => state.drivers);

    const {
        user: { organization_id }
    } = useSelector(state => state.auth);

    useEffect(() => {
        if (editSuccess) {
            history.push(DRIVERS_MANAGE_PATH)
            dispatch(driverChangeOperationStates({}));
        }
        // eslint-disable-next-line
    }, [editSuccess]);


    const submitForm = ({
        phone = initialValue.phone || "",
        expire_driver_license = initialValue.expire_driver_license,
        parsedDate,
        ...data
    }) => {
        if (editLoading) return;

        phone = phone.replace(/[-( )_]/g, "");

        const date = expireDriverLicence.date;
        const expireDate = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? date : new Date(date.setHours(10));

        const editedDriver = {
            id: initialValue.id, //required
            pin: initialValue.pin,//required
            status: driverStatus ?? (initialValue.status),//required
            name: data.name || initialValue.name,//required
            email: data?.email || initialValue?.email,//required
            organization_id, //required
            nickname: data.nickname,
            phone: phone.length < 6 ? " " : phone,
            code: data.code,
            driver_license: data.driver_license,
            identification_driver_key: data.keyId,
            expire_driver_license: format(expireDate, "yyyy-MM-dd"),
        }
        dispatch(editDriver(editedDriver))
    }

    const handleExpireDriverLicence = (input, val) => {
        const timeToAdjustTimezone = "T00:00:00";

        const date = new Date(val?.target?.value + timeToAdjustTimezone);

        expireDriverLicence.date = new Date(date.setHours(10)) || new Date(new Date().setHours(10));

        setExpireDriverLicence({ ...expireDriverLicence });
    }

    useEffect(() => {
        setUrlParam("edited", null);
    }, []);
    
    useEffect(() => {
        if(dirty) setUrlParam("edited", true);
    }, [dirty]);

    return (
        <MenuWithLogoBar history={history} >
            <DescriptionPageHeader
                mainPage={mainPage}
                title={title}
                pageName={subtitle}
                subtitleIsTitle
                icon={icon}
                description={localizedStrings.createDriverDesc}
                linkUrl={localizedStrings.helpLink.drivers}
                linkText={localizedStrings.learnMore}
            />

            <DriverForm
                title={subtitle}
                formId={"driver"}
                onSubmit={handleSubmit(submitForm)}
                inputsConfig={{
                    onChange: setValue,
                    register,
                    inputs: [
                        [
                            {
                                label: localizedStrings.name, name: "name", placeholder: localizedStrings.nameOfDriver,
                                maxLength: 60, initialValue: initialValue.name, type: "text"
                            },
                            {
                                label: localizedStrings.nickname, name: "nickname", placeholder: localizedStrings.nicknamePlaceholderInput,
                                maxLength: 40, initialValue: initialValue.nickname, type: "text", required: true
                            },
                        ],
                        [
                            {
                                label: localizedStrings.phone, name: "phone",
                                type: "phone", showMask: true, initialValue: initialValue.phone, required: true
                            },{
                                label: localizedStrings.email, placeholder: localizedStrings.email, name: "email",
                                type: "email", initialValue: initialValue?.email
                            },
                        ],
                        [
                            {
                                label: localizedStrings.driverLicenseNumber, placeholder: localizedStrings.driverLicenseNumberPlaceholder,
                                name: "driver_license", type: "driver_license", initialValue: initialValue.driver_license, required: true,
                            },
                            {
                                component: (props) =>
                                    <DateInput
                                        register={register}
                                        calendar={{
                                            ref: register({
                                                name: "departureDate",
                                            })
                                        }}
                                        name={"expire_driver_license"}
                                        value={new Date(new Date(expireDriverLicence.date).setHours(10))}
                                        onChange={handleExpireDriverLicence}
                                        style={{
                                            width: "100%",
                                            right: "0",
                                            left: "0",
                                            marginTop: "-5px",
                                            height: "33px"
                                        }}
                                        divStyle={{
                                            height: "auto !important"
                                        }}
                                        calendarStyle={{
                                            position: "absolute"
                                        }}
                                        hasDefaultValue={false}
                                    />,
                                label: localizedStrings.expireDriverLicenseDate,
                                style: {
                                    position: "relative"
                                },
                                required: true,
                            },
                        ],
                        !!initialValue.identification_driver_key?.length && [
                            {
                                label: localizedStrings.keyId, placeholder: localizedStrings.keyIdPlaceholder, name: "keyId",
                                type: { mask: "A" }, maxLength: 9, initialValue: initialValue?.identification_driver_key
                            },
                        ],
                        [
                            {
                                label: localizedStrings.deviceActive, name: "device", type: "text",
                                initialValue: initialValue?.device_attached ? initialValue.device_attached : localizedStrings.noDeviceAttached, readOnly: true
                            },
                            initialValue.lastDevice && {
                                label: localizedStrings.lastDevice, name: "lastDevice", type: "text",
                                initialValue: initialValue.lastDevice, readOnly: true
                            },{
                                label: localizedStrings.codeId, name: "code", initialValue: initialValue.code,
                                type: "text", placeholder: localizedStrings.codeIdPlaceholder,
                                iconAfterText: true,
                                icon: <HelpIconWithTooltip
                                    text={[
                                    localizedStrings.tooltipHelpTexts.drivers.codeId.text,
                                    <Link href={localizedStrings.tooltipHelpTexts.drivers.codeId.link} target={"_blank"}> {localizedStrings.tooltipHelpTexts.drivers.codeId.linkText}</Link>
                                ]} />,
                            },
                        ],[
                            {
                                label: localizedStrings.pin, name: "pin", type: "text",
                                initialValue: initialValue.pin, readOnly: true                            
                            },
                            {
                                hidden: true
                            },
                        ],
                        [
                            {
                                name: "status",
                                label: localizedStrings.driverStatus,
                                component: (props) =>
                                    <RadioButton
                                        name={"status"}
                                        inputs={[
                                            {
                                                default: driverStatus === 1,
                                                text: localizedStrings.active,
                                                value: 1,
                                                onChange: (e, { value }) => setDriverStatus(value)
                                            },
                                            {
                                                default: driverStatus === 0,
                                                text: localizedStrings.inactive,
                                                value: 0,
                                                onChange: (e, { value }) => setDriverStatus(value)
                                            },
                                        ]}
                                        {...props} />,
                            },
                        ],

                    ].filter(input => input)
                }}
            />

            <BottomActionButtons
                formId={"driver"}
                onCancel={() => history.goBack()}
            />
        </MenuWithLogoBar>
    );
}
