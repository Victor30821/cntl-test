import React, { useState, useEffect } from "react";
import { CardInput, Col, Text, HelpIconWithTooltip, Link } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { useSelector,useDispatch } from "react-redux";
import { FlexDiv } from "../style";
import { Button } from "components";
import { removeKmEvent } from "store/modules";
import { initialSetup } from "../defaultValues";

export default function Tab3({ inputsConfig, onChanges }) {
  const dispatch = useDispatch();
  
  const [kmTriggersConfiguration, setKmTriggersConfiguration] = useState(initialSetup);
  
  const {
    vehicleKmEvent
  } = useSelector(state => state.vehicles)

  const {
    user
  } = useSelector(state => state.auth)

  useEffect(() => {
    const hasKmEvent = vehicleKmEvent?.km?.length > 0;
    if (hasKmEvent) setKmTriggersConfiguration([{name:"", value_in_km:""}, ...vehicleKmEvent?.km])
    // eslint-disable-next-line
  }, [vehicleKmEvent?.km])

  const editItem = (newItem, index, array) => {
    array.splice(index, 1);
    array.splice(index, 0, newItem);
  }
  const handleInputs = (fieldType = "kmTrigger", fieldName, value, index) => {
    const currentConfiguration = JSON.parse(JSON.stringify(kmTriggersConfiguration[index]))
    currentConfiguration[fieldName] = value;
    editItem(currentConfiguration, index, kmTriggersConfiguration);
    setKmTriggersConfiguration([...kmTriggersConfiguration]);
    inputsConfig.setValue("kmTrigger", JSON.stringify([...kmTriggersConfiguration]));
  }

  const addInputRow = () => {
    setKmTriggersConfiguration([{name:"", value_in_km:""},...kmTriggersConfiguration]);
  }

  const removeInputRow = (index) => {
    const currentConfiguration = JSON.parse(JSON.stringify(kmTriggersConfiguration));
    const [currentSetting]  = currentConfiguration.filter((km,indexKM)=> indexKM === index) || [{}];
    currentSetting?.id && dispatch(removeKmEvent({kmTrigger:[{vehicle_id:currentSetting.vehicle_id, id:currentSetting.id}]}));
    currentConfiguration.splice(index, 1);
    setKmTriggersConfiguration([...currentConfiguration]);
  }

  const deleteUniqueKmTrigger = (data) => {
    dispatch(removeKmEvent({kmTrigger:[data]}));
    setKmTriggersConfiguration([{name: "", value_in_km:""}]);
  };
  const totalRegister = kmTriggersConfiguration.length;
  return (
    <>
      <Row style={{
        paddingBottom: "10px",
        marginBottom: "22px",
        borderBottom: "1px solid #cccccc80"
      }}>
        <Col md="12" className="mb-6">
          <FlexDiv>
            <Text fontWeight={"500"} fontSize={"14px"} lineHeight={"19px"} fontStyle={"italic"} color={"#333333"}>
              {localizedStrings.createKmEventDescription}
            </Text>
            <HelpIconWithTooltip
              text={[
                localizedStrings.tooltipHelpTexts.vehicleKmReached.text,
                <Link href={localizedStrings.tooltipHelpTexts.vehicleKmReached.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
              ]} />
          </FlexDiv>
        </Col>
      </Row>
      {
        kmTriggersConfiguration.map((kmTrigger, index) => {
          return (
            <Row key={index}>
              <Col md="6" className="mb-6">
                <CardInput
                  onChange={(fieldType, value) => handleInputs(fieldType, "name", value, index)}
                  register={inputsConfig.register}
                  inputs={[
                    {
                      label: localizedStrings.nameOfKmEvent,
                      type: "text",
                      name: `kmTrigger[${index}].name`,
                      value: kmTrigger?.name,
                      readOnly: !!kmTrigger?.id,
                    }
                  ]}
                />

              </Col>

              <Col md="3" className="mb-3">
                <CardInput
                  onChange={(fieldType, value) => handleInputs(fieldType, "value_in_km", value, index)}
                  register={inputsConfig.register}
                  inputs={[
                    {
                      label: localizedStrings.odometerInUserUnit(user?.user_settings?.distance_unit),
                      type: "number",
                      name: `kmTrigger[${index}].value_in_km`,
                      value: kmTrigger?.value_in_km,
                      readOnly: !!kmTrigger?.id,
                    }
                  ]}
                />
              </Col>
              <Col md="3" className="mb-3" style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                flexDirection: index === 0 && kmTrigger?.id && totalRegister === 1 && 'column'
              }}>
                {index === 0 && kmTrigger?.id && totalRegister === 1 && (
                  <Button
                    title={localizedStrings.removeEvent}
                    onClick={() => deleteUniqueKmTrigger(kmTrigger)}
                    backgroundColor={"#fff"}
                    border={"1px solid #FD3995"}
                    textConfig={{
                      color: "#FD3995"
                    }}
                    flex={"1"}
                    width={'100%'}
                    marginBottom={'5px'}
                  />
                )}
                <Button
                  title={
                    index === 0
                      ? localizedStrings.addEvent
                      : localizedStrings.removeEvent
                  }
                  onClick={
                    index === 0
                      ? () => addInputRow()
                      : () => removeInputRow(index)
                  }
                  width={index === 0 && kmTrigger?.id && totalRegister === 1 && '100%'}
                  backgroundColor={index === 0 ? "#1a2565" : "#fff"}
                  border={index === 0 ? "none" : "1px solid #FD3995"}
                  textConfig={{
                    color: index === 0 ? "#fff" : "#FD3995"
                  }}
                  flex={"1"}
                />
              </Col>

            </Row>

          )
        })
      }    </>
  );
}
