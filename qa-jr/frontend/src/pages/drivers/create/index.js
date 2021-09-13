import React, { useEffect, useState } from "react";
import {
  MenuWithLogoBar,
  DriverForm,
  DescriptionPageHeader
} from "containers";
import { createDriver, driverChangeOperationStates } from "store/modules";
import { useDispatch, useSelector } from "react-redux";
import { BottomActionButtons, DateInput, HelpIconWithTooltip, Link } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { DRIVERS_MANAGE_PATH } from "constants/paths";
import { Br } from "containers/forms/login/recoverPasswordForm/style";

export default function DriversCreate({ history, title, subtitle, icon, mainPage }) {
  const dispatch = useDispatch();
  const { register, setValue, handleSubmit } = useForm();

  const { createSuccess, createLoading } = useSelector(
    state => state.drivers
  );
  const {
    user: { organization_id }
  } = useSelector(state => state.auth);

  const [expireDriverLicence, setExpireDriverLicence] = useState({ date: new Date(new Date().setHours(10)) });

  useEffect(() => {
    if (createSuccess) {
      history.push(DRIVERS_MANAGE_PATH);
      dispatch(driverChangeOperationStates({}));
    }
    // eslint-disable-next-line
  }, [createSuccess]);


  const submitForm = ({ phone = "", ...data }) => {
    if (createLoading) return;
    const date = expireDriverLicence.date;
    const expireDate = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? date : new Date(date.setHours(10));

    const newDriver = {
      name: data.name,
      nickname: data.nickname,
      email: data?.email,
      phone: (phone.length !== 0 && phone.replace(/[-( )]/g, "")) || undefined,
      code: data.code,
      driver_license: data.driver_license,
      expire_driver_license: format(expireDate, "yyyy-MM-dd"),
      identification_driver_key: data.keyId,
      organization_id,
    };

    dispatch(createDriver(newDriver));
  };

  const handleExpireDriverLicence = (input, val) => {
    const date = new Date(val?.target?.value);
    expireDriverLicence.date = new Date(date.setHours(10)) || new Date(new Date().setHours(10));
    setExpireDriverLicence({ ...expireDriverLicence });
  }

  return (
    <MenuWithLogoBar history={history}>
      <DescriptionPageHeader
        mainPage={mainPage}
        title={title}
        pageName={subtitle}
        subtitleIsTitle={true}
        description={localizedStrings.createDriverDesc}
        linkUrl={localizedStrings.helpLink.drivers}
        linkText={localizedStrings.learnMore}
        icon={icon}
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
                label: localizedStrings.name,
                name: "name",
                placeholder: localizedStrings.nameOfDriver,
                type: "text",
                maxLength: 60,
              },
              {
                label: localizedStrings.nickname,
                name: "nickname",
                placeholder: localizedStrings.nicknamePlaceholderInput,
                type: "text",
                maxLength: 40,
                required: true
              }
            ],
            [
              {
                label: localizedStrings.phone,
                name: "phone",
                type: "phone",
                showMask: true,
                iconAfterText: true,
                icon: <HelpIconWithTooltip
                  text={[
                    localizedStrings.tooltipHelpTexts.drivers.driverTel.text,
                    <Link href={localizedStrings.tooltipHelpTexts.drivers.driverTel.link} target={"_blank"}> {localizedStrings.tooltipHelpTexts.drivers.driverTel.linkText}</Link>,
                    <Br height={"2px"} />,
                    localizedStrings.tooltipHelpTexts.drivers.driverTel.textAfterlink
                  ]} />,
                required: true,
              },
              {
                label: localizedStrings.codeId,
                iconAfterText: true,
                icon: <HelpIconWithTooltip
                  text={[
                    localizedStrings.tooltipHelpTexts.drivers.codeId.text,
                    <Link href={localizedStrings.tooltipHelpTexts.drivers.codeId.link} target={"_blank"}> {localizedStrings.tooltipHelpTexts.drivers.codeId.linkText}</Link>
                  ]} />,
                name: "code",
                type: "text",
                placeholder: localizedStrings.codeIdPlaceholder
              }
            ],
            [
              {
                label: localizedStrings.driverLicenseNumber,
                placeholder: localizedStrings.driverLicenseNumberPlaceholder,
                name: "driver_license",
                type: "driver_license",
                required: true
              },
              {
                label: localizedStrings.expireDriverLicenseDate,
                style: {
                  position: "relative"
                },
                component: (props) =>
                  <DateInput
                    register={register}
                    calendar={{
                      ref: register({
                        name: "expire_driver_license",
                      })
                    }}
                    value={expireDriverLicence.date}
                    name={"expire_driver_license"}
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
                  />,
                iconAfterText: true,
                icon: <HelpIconWithTooltip
                  text={[
                    localizedStrings.tooltipHelpTexts.drivers.expireDriverLicenseDate.text,
                    <Link href={localizedStrings.tooltipHelpTexts.drivers.expireDriverLicenseDate.link} target={"_blank"}> {localizedStrings.tooltipHelpTexts.drivers.expireDriverLicenseDate.linkText}</Link>
                  ]} />,
                required: true,
              },
            ],
            [
              {
                label: localizedStrings.keyId,
                placeholder: localizedStrings.keyIdPlaceholder,
                name: "keyId",
                type: { mask: "A" },
                maxLength: 9,
              },
              {
                label: localizedStrings.email,
                name: "email",
                placeholder: localizedStrings.email,
                type: "email",
              }
            ]
          ]
        }}
      />

      <BottomActionButtons
        formId={"driver"}
        onCancel={() => history.goBack()}
      />
    </MenuWithLogoBar>
  );
}
