import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardInput, HelpIconWithTooltip, Text, CardTitle, Link, Card, Checkbox, ButtonWithIcon } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Col } from "reactstrap";
import { useSelector } from "react-redux";
import { FlexDiv } from "../style";
import { useWatch } from "react-hook-form";
import { HourRangeSelector, CheckboxList } from "components/hoursOfUse";


const weekDays = [
  { id: 1, name: localizedStrings.monday, selected: false, disabled: false },
  { id: 2, name: localizedStrings.tuesday, selected: false, disabled: false },
  { id: 3, name: localizedStrings.wednesday, selected: false, disabled: false },
  { id: 4, name: localizedStrings.thursday, selected: false, disabled: false },
  { id: 5, name: localizedStrings.friday, selected: false, disabled: false },
  { id: 6, name: localizedStrings.saturday, selected: false, disabled: false },
  { id: 7, name: localizedStrings.sunday, selected: false, disabled: false },
]
const hours = [
  {
    from: "00:00",
    to: "09:00",
  }
]

const weeklyInitialSchedule = {
  weekDays: {
    1: { id: 1, name: localizedStrings.monday, selected: false, disabled: false },
    2: { id: 2, name: localizedStrings.tuesday, selected: false, disabled: false },
    3: { id: 3, name: localizedStrings.wednesday, selected: false, disabled: false },
    4: { id: 4, name: localizedStrings.thursday, selected: false, disabled: false },
    5: { id: 5, name: localizedStrings.friday, selected: false, disabled: false },
    6: { id: 6, name: localizedStrings.saturday, selected: false, disabled: false },
    7: { id: 7, name: localizedStrings.sunday, selected: false, disabled: false },
  },
  hours
}

const invisibleInputStyle = {
  opacity: "0",
  width: "0px",
  height: "0px",
  padding: "0",
  margin: "0",
  borderWidth: "0px",
}
export default function Tab2({ history, inputsConfig, onChanges, errors, vehicle }) {

  const hours = useWatch({
    control: inputsConfig.control,
    name: 'hours'
  });

  const daysSelected = useWatch({
    control: inputsConfig.control,
    name: 'daysSelected'
  });

  const hasLoaded = Array.isArray(hours) && Array.isArray(daysSelected);

  const setHours = hours => inputsConfig.setValue('hours', hours);

  const setDaysSelected = daysSelected => inputsConfig.setValue('daysSelected', daysSelected);

  const [errorsInConfig, setErrors] = useState(false)

  const daysDisabledPerId = useMemo(() => {
    const hasDays = Array.isArray(daysSelected) && daysSelected.length > 0;
    if (!hasDays) return [];

    const daysIdsSelected = daysSelected.reduce(((daysToDisable, currentDayCheckbox) => {
      const dayId = currentDayCheckbox
        .map((checkbox) => checkbox?.id)
        .filter(Boolean)
      daysToDisable.push(dayId);
      return daysToDisable
    }), []);

    const daysIdsDisabled = daysIdsSelected.reduce(((daysIdsToDisable, currentDayCheckbox, index) => {
      const otherDays = daysIdsSelected.slice()

      otherDays.splice(index, 1);

      const daysToDisable = otherDays.flat().filter(id => !currentDayCheckbox.includes(+id));
      daysIdsToDisable.push(daysToDisable);
      return daysIdsToDisable
    }), []);


    return daysIdsDisabled
    // eslint-disable-next-line
  }, [JSON.stringify(daysSelected)]);


  const {
    editLoading,
  } = useSelector(state => state.vehicles);

  const toggleCheckbox = useCallback(({
    configurationIndex,
    checkboxIndex,
    index,
  }) => {
    const newCheckboxList = Object.assign([], daysSelected);

    const hasToRemove = !!newCheckboxList[configurationIndex][checkboxIndex]

    if (hasToRemove) newCheckboxList[configurationIndex].splice(checkboxIndex, +hasToRemove);

    if (!hasToRemove) newCheckboxList[configurationIndex].splice(checkboxIndex, +hasToRemove, weeklyInitialSchedule.weekDays[index + 1])

    setDaysSelected(newCheckboxList)
  }, [daysSelected, setDaysSelected])

  useEffect(() => {

    const defaultWeekdays = weekDays.slice().map(week => ({ ...week, selected: true }))

    addBlockConfig(
      [{ from: "08:00", to: "18:00", }],
      defaultWeekdays.slice(0, 5)
    );

  }, [])

  const onChangeTime = useCallback(({
    configurationIndex,
    to,
    from,
    hourIndex,
  }) => {
    const newHoursList = Object.assign([], hours);

    newHoursList[configurationIndex][hourIndex] = {
      to,
      from,
    }

    setHours(newHoursList)
  }, [hours, setHours])

  const addBlockConfig = useCallback(
    (
      hoursDefault = [{
        to: "00:00",
        from: "00:00",
      }],
      day = []
    ) => {
    const newHoursList = Object.assign([], hours);
    const newCheckboxList = Object.assign([], daysSelected);

      newHoursList.splice(newHoursList.length, 0, hoursDefault)
      newCheckboxList.splice(newCheckboxList.length, 0, day)

    setDaysSelected(newCheckboxList)
    setHours(newHoursList)

  }, [daysSelected, hours]);

  const removeBlockConfig = useCallback(({
    configurationIndex,
    hoursList = hours
  }) => {
    const newHoursList = Object.assign([], hoursList);
    const newCheckboxList = Object.assign([], daysSelected);

    newHoursList.splice(configurationIndex, 1)
    newCheckboxList.splice(configurationIndex, 1)

    setDaysSelected(newCheckboxList)
    setHours(newHoursList)

  }, [daysSelected, hours]);

  const removeDay = useCallback(({
    configurationIndex,
    hourIndex,
  }) => {
    const newHoursList = Object.assign([], hours);

    newHoursList[configurationIndex].splice(hourIndex, 1)

    if (newHoursList[configurationIndex].length === 0) {
      removeBlockConfig({ configurationIndex, hoursList: newHoursList });
      return;
    }

    setHours(newHoursList)
    // eslint-disable-next-line
  }, [hours, setHours])

  const addDay = useCallback(({
    configurationIndex,
    hourIndex,
  }) => {
    const newHoursList = Object.assign([], hours);

    newHoursList[configurationIndex].splice(hourIndex + 1, 0, {
      to: "00:00",
      from: "00:00"
    })

    setHours(newHoursList)
  }, [hours, setHours])

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Col md="6" className="mb-6">
        <CardInput
          onChange={onChanges.handleInput}
          register={inputsConfig.register}
          inputs={[
            {
              label: localizedStrings.maxSpeedAllowed,
              name: "speed",
              type: "number",
              maxLength: 4,
              iconAfterText: true,
              icon: <HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.vehicleMaxSpeedAllowed.text,
                  <Link href={localizedStrings.tooltipHelpTexts.vehicleKmReached.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                ]} />,
              placeholder: localizedStrings.maxSpeedAllowedExample,
              error: errors.speed.error,
              errorText: errors.speed.message,
            }
          ]}
        />

      </Col>
      <Col md="6" className="mb-6">
        <CardInput
          onChange={onChanges.handleInput}
          register={inputsConfig.register}
          inputs={[
            {
              label: localizedStrings.maxTimeStoppedWithTheEngineOn,
              name: "idle",
              type: "number",
              maxLength: 8,
              iconAfterText: true,
              icon: <HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.vehicleIdle.text,
                  <Link href={localizedStrings.tooltipHelpTexts.vehicleIdle.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
                ]} />,
              placeholder: localizedStrings.maxTimeStoppedExample,
              error: errors.idle.error,
              errorText: errors.idle.message,
            }
          ]}
        />
      </Col>
      <Col md="12" className="mb-12" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}>
        <FlexDiv
          padding={"18px 0"}
          marginBottom={"22px"}
          borderBottom={"1px solid #cccccc80"}
          width="100%"
        >
          <Text fontWeight={"500"} fontSize={"14px"} lineHeight={"19px"} fontStyle={"italic"} color={"#333333"}>
            {localizedStrings.selectDaysAndHoursOfUsage}
          </Text>
          <HelpIconWithTooltip
            text={[
              localizedStrings.tooltipHelpTexts.vehicleHourOfUse.text,
              <Link href={localizedStrings.tooltipHelpTexts.vehicleHourOfUse.link} target={"_blank"}> {localizedStrings.learnMore}</Link>
            ]} />
        </FlexDiv>
        {
          ((hours?.length === 0 && !hasLoaded) || editLoading)
            ? <Card margin={"12px 0"} width="100%" loading={!hasLoaded || editLoading} />
            : null
        }
        <input ref={inputsConfig.register("hours")} style={invisibleInputStyle} />
        <input ref={inputsConfig.register("daysSelected")} style={invisibleInputStyle} />
        {
          hasLoaded && !editLoading && Array.isArray(daysSelected) &&
          daysSelected.map((checkboxList, configurationIndex) => {
            return <>
              <Card margin={"12px 0"} width="100%">
                <CardTitle color={"#333"} fontWeight={"bold"} fontSize={"14px"} >
                  {localizedStrings.hoursOfUseOut}
                </CardTitle>
                <CheckboxList
                  weekDays={weekDays}
                  daysDisabledPerId={daysDisabledPerId}
                  checkboxList={checkboxList}
                  configurationIndex={configurationIndex}
                  toggleCheckbox={toggleCheckbox}
                />
                {
                  Array.isArray(hours[configurationIndex]) &&
                  hours[configurationIndex].map((hour, hourIndex, hoursArray) => {

                    return <HourRangeSelector
                      configurationIndex={configurationIndex}
                      hourIndex={hourIndex}
                      hour={hour}
                      setErrors={setErrors}
                      errors={errorsInConfig}
                      onChangeTime={onChangeTime}
                      removeDay={removeDay}
                      addDay={addDay}
                      hideMinusBtn={!(hourIndex !== 0 || configurationIndex !== 0)}
                    />
                  })
                }
              </Card>
            </>
          })
        }
        <ButtonWithIcon
          title={localizedStrings.configOtherDays}
          icon={"plus"}
          margin={"12px"}
          disabled={
            errorsInConfig || Array.from(new Set(daysDisabledPerId.flat())).length >= weekDays.length
          }
          onClick={() => addBlockConfig()}
          width="auto"
          textOptions={{
            margin: "0 0 0 10px",
            whiteSpace: "none",
          }}
        />
      </Col>

    </div>
  );

}
