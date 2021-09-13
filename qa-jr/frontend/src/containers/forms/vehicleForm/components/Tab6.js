import React, { useEffect, useMemo } from "react";
import { Icon, Col, HelpIconWithTooltip, Text, Checkbox, ControlledSelect, Link, SelectOutText } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { FlexDiv } from "../style";
import { setNotificationEvents } from "store/modules";
import {
  PLAY_STORE_APP_LINK,
  APPLE_STORE_APP_LINK
} from "constants/environment";
import { getUrlParam } from "utils/params";
import { useWatch } from "react-hook-form";
import { toast } from "react-toastify";

export default function Tab6({ inputsConfig, vehicle, onChanges, errors }) {
  const dispatch = useDispatch();
  const {
    notificationEvents,
    // eslint-disable-next-line
    selectors = { email: [] }
  } = useSelector(state => state.vehicles);

  const {
    trackers
  } = useSelector(state => state.trackers);

  const emails = useWatch({
		control: inputsConfig.control,
		name: 'email'
	});

  useEffect(() => {
    const fieldEmail = inputsConfig.getValues('email');
    const hasFieldEmail = Array.isArray(fieldEmail) && fieldEmail.length >= 0
    const needUpdateFieldEmail = hasFieldEmail && (!isEmail(fieldEmail) || emailsIsGreaterThan20(fieldEmail))
    
    if(needUpdateFieldEmail){
      const newEmails = fieldEmail.slice(0, -1)
      inputsConfig.setValue('email', newEmails)
    }
  },[emails])
  
  const isTM20 = useMemo(
    () => {
      const [tracker = { type_name: "" }] = trackers.filter(module => +module.vehicle_id === +getUrlParam("vehicle_id")) || [{}];

      const trackersTypeName = tracker.type_name.toLowerCase()

      return ["tm20", "normal"].includes(trackersTypeName)
    },
    [
      trackers
    ]
  )

  const isGV50 = useMemo(
    () => {
      const [tracker = { type_name: "" }] = trackers.filter(module => +module.vehicle_id === +getUrlParam("vehicle_id")) || [{}];

      const trackersTypeName = tracker.type_name.toLowerCase()

      return ["gv50"].includes(trackersTypeName)
    },
    [
      trackers
    ]
  )

  useEffect(() => {
    if (isGV50 === true && !notificationEvents.power && !inputsConfig.pageEdit) {
      dispatch(setNotificationEvents({
        power: {
          email: true,
          app: true
        }
      }));    
    }
  }, [isGV50, notificationEvents])

  useEffect(() => {
    if (isTM20 === true && !notificationEvents.sensor && !inputsConfig.pageEdit) {
      dispatch(setNotificationEvents({
        sensor: {
          email: false,
          app: false
        }
      }));    
    }
  }, [isGV50, notificationEvents])
  
  const toggleNotification = ({
    value,
    name,
    type
  }) => {
    dispatch(setNotificationEvents({
      [name]: {
        ...notificationEvents[name],
        [type]: value
      }
    }))
  }

  const emailsIsGreaterThan20 = (emails) => {
    if(emails.length > 20){
      toast.error(localizedStrings.emailLimit)
    }
    return emails.length > 20
  }

  const isEmail = (emails) => {
    const digitEmail = emails.slice().pop()
    if(digitEmail){
      const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const isValidEmail = validEmailRegex.test(digitEmail.value);
  
      if(!isValidEmail){
        toast.error(localizedStrings.invalidEmail)
      }
      return isValidEmail
    }
    return true
  }

  const deleteEmail = (currentEmail) => {
    const fieldEmail = inputsConfig.getValues("email")
    const remainingEmails = fieldEmail.filter(email => email != currentEmail)
    inputsConfig.setValue('email',remainingEmails)
  }

  return (
    <>
      <Row>
          <Col md="5" className="mb-6">
              <ControlledSelect
                title={localizedStrings.emails}
                isMulti
                isCreatable
                isTextOut
                error={errors.email.error}
                errorText={errors.email.message}
                name="email"
                control={inputsConfig.control}
                required={true}
                placeholder={localizedStrings.fillWithYourEmail}
                emptyStateText={null}
                config={{
                  components: { DropdownIndicator:() => null }
                }}
                createMessage={" "}
              />
          </Col>
      </Row>
      <Row>
        <Col md="12" className="mb-6">
          <SelectOutText
                title = {localizedStrings.toInsertaEmail}
                onItemClick = {(item) => deleteEmail(item)}
                items={emails}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <FlexDiv minHeight={"50px"}>
            <FlexDiv flex={"1"}>
              <Text fontWeight={"500"} fontSize={"13px"} lineHeight={"19px"} color={"#666666"} marginLeft={"10px"} marginRight={"10px"} >
                {localizedStrings.kmReached}
              </Text>
              <HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.vehicleKmReached.text,
                  <Link href={localizedStrings.tooltipHelpTexts.vehicleKmReached.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                ]} />
            </FlexDiv>
            <FlexDiv>
              <Checkbox
                checked={notificationEvents.km.app}
                title={localizedStrings.app}
                onChange={(val) => toggleNotification({ value: val, name: "km", type: "app" })}
              />
              <Checkbox
                checked={notificationEvents.km.email}
                title={localizedStrings.email}
                onChange={(val) => toggleNotification({ value: val, name: "km", type: "email" })}
              />
            </FlexDiv>
          </FlexDiv>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <FlexDiv minHeight={"50px"}>
            <FlexDiv flex={"1"}>
              <Text fontWeight={"500"} fontSize={"13px"} lineHeight={"19px"} color={"#666666"} marginLeft={"10px"} marginRight={"10px"} >
                {localizedStrings.speeding}
              </Text>
              <HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.vehicleMaxSpeedAllowed.text,
                  <Link href={localizedStrings.tooltipHelpTexts.vehicleMaxSpeedAllowed.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                ]} />
            </FlexDiv>
            <FlexDiv>
              <Checkbox
                checked={notificationEvents.speeding.app}
                title={localizedStrings.app}
                onChange={(val) => toggleNotification({ value: val, name: "speeding", type: "app" })}
              />
              <Checkbox
                checked={notificationEvents.speeding.email}
                title={localizedStrings.email}
                onChange={(val) => toggleNotification({ value: val, name: "speeding", type: "email" })}
              />
            </FlexDiv>
          </FlexDiv>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <FlexDiv minHeight={"50px"}>
            <FlexDiv flex={"1"}>
              <Text fontWeight={"500"} fontSize={"13px"} lineHeight={"19px"} color={"#666666"} marginLeft={"10px"} marginRight={"10px"} >
                {localizedStrings.idleCar}
              </Text>
              <HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.vehicleIdle.text,
                  <Link href={localizedStrings.tooltipHelpTexts.vehicleIdle.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                ]} />
            </FlexDiv>
            <FlexDiv>
              <Checkbox
                checked={notificationEvents.idleCar.app}
                title={localizedStrings.app}
                onChange={(val) => toggleNotification({ value: val, name: "idleCar", type: "app" })}
              />
              <Checkbox
                checked={notificationEvents.idleCar.email}
                title={localizedStrings.email}
                onChange={(val) => toggleNotification({ value: val, name: "idleCar", type: "email" })}
              />
            </FlexDiv>
          </FlexDiv>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <FlexDiv minHeight={"50px"}>
            <FlexDiv flex={"1"}>
              <Text fontWeight={"500"} fontSize={"13px"} lineHeight={"19px"} color={"#666666"} marginLeft={"10px"} marginRight={"10px"} >
                {localizedStrings.geoFence}
              </Text>
              <HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.vehicleGeoFence.text,
                  <Link href={localizedStrings.tooltipHelpTexts.vehicleGeoFence.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                ]} />
            </FlexDiv>
            <FlexDiv>
              <Checkbox
                checked={notificationEvents.geoFence.app}
                title={localizedStrings.app}
                onChange={(val) => toggleNotification({ value: val, name: "geoFence", type: "app" })}
              />
              <Checkbox
                checked={notificationEvents.geoFence.email}
                title={localizedStrings.email}
                onChange={(val) => toggleNotification({ value: val, name: "geoFence", type: "email" })}
              />
            </FlexDiv>
          </FlexDiv>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <FlexDiv minHeight={"50px"}>
            <FlexDiv flex={"1"}>
              <Text fontWeight={"500"} fontSize={"13px"} lineHeight={"19px"} color={"#666666"} marginLeft={"10px"} marginRight={"10px"} >
                {localizedStrings.hoursOfUse}
              </Text>
              <HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.vehicleHourOfUse.text,
                  <Link href={localizedStrings.tooltipHelpTexts.vehicleHourOfUse.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                ]} />
            </FlexDiv>
            <FlexDiv>
              <Checkbox
                checked={notificationEvents.hoursOfUse.app}
                title={localizedStrings.app}
                onChange={(val) => toggleNotification({ value: val, name: "hoursOfUse", type: "app" })}
              />
              <Checkbox
                checked={notificationEvents.hoursOfUse.email}
                title={localizedStrings.email}
                onChange={(val) => toggleNotification({ value: val, name: "hoursOfUse", type: "email" })}
              />
            </FlexDiv>
          </FlexDiv>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <FlexDiv minHeight={"50px"}>
            <FlexDiv flex={"1"}>
              <Text fontWeight={"500"} fontSize={"13px"} lineHeight={"19px"} color={"#666666"} marginLeft={"10px"} marginRight={"10px"} >
                {localizedStrings.driverNotIdentified}
              </Text>
              <HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.unidentifiedDriver.text,
                  <Link href={localizedStrings.tooltipHelpTexts.unidentifiedDriver.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                ]} />
            </FlexDiv>
            <FlexDiv>
              <Checkbox
                checked={notificationEvents.unidentifiedDriver.app}
                title={localizedStrings.app}
                onChange={(val) => toggleNotification({ value: val, name: "unidentifiedDriver", type: "app" })}
              />
              <Checkbox
                checked={notificationEvents.unidentifiedDriver.email}
                title={localizedStrings.email}
                onChange={(val) => toggleNotification({ value: val, name: "unidentifiedDriver", type: "email" })}
              />
            </FlexDiv>
          </FlexDiv>
        </Col>
      </Row>
      {
        isTM20 &&
      <Row>
        <Col md="6" className="mb-6">
          <FlexDiv minHeight={"50px"}>
            <FlexDiv flex={"1"}>
              <Text fontWeight={"500"} fontSize={"13px"} lineHeight={"19px"} color={"#666666"} marginLeft={"10px"} marginRight={"10px"} >
                {localizedStrings.sensors}
              </Text>
              <HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.sensor.text,
                  <Link href={localizedStrings.tooltipHelpTexts.sensor.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                ]} />
            </FlexDiv>
            <FlexDiv>
              <Checkbox
                checked={notificationEvents.sensor ? notificationEvents.sensor.app : false}
                title={localizedStrings.app}
                onChange={(val) => toggleNotification({ value: val, name: "sensor", type: "app" })}
              />
              <Checkbox
                checked={notificationEvents.sensor ? notificationEvents.sensor.email : false}
                title={localizedStrings.email}
                onChange={(val) => toggleNotification({ value: val, name: "sensor", type: "email" })}
              />
            </FlexDiv>
          </FlexDiv>
        </Col>
      </Row>
      }
      {
        isGV50 &&
        <Row>
          <Col md="6" className="mb-6">
            <FlexDiv minHeight={"50px"}>
              <FlexDiv flex={"1"}>
                <Text fontWeight={"500"} fontSize={"13px"} lineHeight={"19px"} color={"#666666"} marginLeft={"10px"} marginRight={"10px"} >
                  {localizedStrings.vehicleStatusDesconected}
                </Text>
                <HelpIconWithTooltip
                  text={[
                    localizedStrings.tooltipHelpTexts.vehicleStatusDesconected.text,
                    <Link href={localizedStrings.tooltipHelpTexts.vehicleStatusDesconected.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                  ]} />
              </FlexDiv>
              <FlexDiv>
                <Checkbox
                  checked={notificationEvents?.power?.app}
                  title={localizedStrings.app}
                  onChange={(val) => toggleNotification({ value: val, name: "power", type: "app" })}
                />
                <Checkbox
                  checked={notificationEvents?.power?.email}
                  title={localizedStrings.email}
                  onChange={(val) => toggleNotification({ value: val, name: "power", type: "email" })}
                />
              </FlexDiv>
            </FlexDiv>
          </Col>
        </Row>
      }
      <Row style={{
        paddingTop: "25px",
        borderTop: "1px solid #cccccc80"
      }}>
        <Col md="12" className="mb-6">
          <Text fontSize={"14px"} fontWeight={"bold"} lineHeight={"19px"} color={"#333333"}>
            {localizedStrings.appFullName}
          </Text>
        </Col>
        <Col md="12" className="mb-6">
          <FlexDiv minHeight={"50px"} flexWrap={"Wrap"} >
            <Text fontWeight={"500"} fontSize={"14px"} lineHeight={"19px"} fontStyle={"italic"} color={"#333333"}>
              {localizedStrings.installAppForReceiveNotifications}
            </Text>
            <Link target="_blank" rel="noopener noreferrer" href={PLAY_STORE_APP_LINK} >
              <Icon icon={'playstore'} width={'25px'} height={'19px'} color='#1A237A' cursor="pointer" style={{ marginLeft: "8px" }} />
            </Link>
            <Link target="_blank" rel="noopener noreferrer" href={APPLE_STORE_APP_LINK} >
              <Icon icon={'applestore'} width={'25px'} height={'19px'} color='#1A237A' cursor="pointer" style={{ marginLeft: "8px" }} />
            </Link>
            <Text fontWeight={"500"}
              fontSize={"14px"}
              lineHeight={"19px"}
              withLink
              whiteSpace={"none"}
              linkProps={{ margin: "0 3px", fontWeight: "bold" }}
              fontStyle={"italic"} color={"#333333"}>
              {localizedStrings.installAppIn}
              <Link target="_blank"
                rel="noopener noreferrer"
                href={PLAY_STORE_APP_LINK} >
                {localizedStrings.installAppInPlayStore}
              </Link>
              {localizedStrings.installAppOrIn}
              <Link target="_blank"
                rel="noopener noreferrer"
                href={APPLE_STORE_APP_LINK} >
                {localizedStrings.installAppInAppStore}
              </Link>
            </Text>
          </FlexDiv>
        </Col>
      </Row>
    </>
  );
}
