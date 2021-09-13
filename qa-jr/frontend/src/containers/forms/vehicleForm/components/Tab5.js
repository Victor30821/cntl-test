import React from "react";
import { Col, ControlledSelect, HelpIconWithTooltip, Link,Text } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { useDispatch, useSelector } from "react-redux";
import { vehicleChangeSelectors } from "store/modules";
import { Icon } from 'components';
import { CirclePicker } from 'react-color';

export default function Tab5({ inputsConfig, errors }) {
  const dispatch = useDispatch({})
  const {
    selectors
  } = useSelector(state => state.vehicles);

  const {
    loadLoading, loadFail, groups
  } = useSelector(state => state.groups);

  const formatGroups = group => {
    return {
      label: group.tagName,
      value: group.tagName
    }
  }

  return (
    <div style={{display: "flex", flexWrap: "wrap"}}>
        <Col md="8" className="mb-6">
          <div style={{ flex: 1, position: "relative" }}>
            <ControlledSelect
              style={{
                minWidth: "200px",
                marginRight: "10px"
              }}
              isMulti
              name="taggings"
              control={inputsConfig.control}
              error={loadFail}
              icon={<HelpIconWithTooltip
                text={[
                  localizedStrings.tooltipHelpTexts.vehicleGroupMapVisualization.text,
                  <Link href={localizedStrings.tooltipHelpTexts.vehicleGroupMapVisualization.link} target={"_blank"}> {localizedStrings.tooltipHelpTexts.vehicleGroupMapVisualization.linkText}</Link>
                ]} />}
              loading={loadLoading}
              title={localizedStrings.groupFilter}
              placeholder={localizedStrings.groupFilter}
              options={groups?.map(formatGroups)}
              emptyStateText={localizedStrings.noGroupCreated}
            />
          </div>
        </Col>

      <Col md="3" className="mb-3">
          <ControlledSelect
            title={localizedStrings.vehicleTypeOnMap}
            required={true}
            error={errors.icon.error}
            errorText={errors.icon.message}
            options={inputsConfig.inputs.vehicleTypeOnMapOptions}
            placeholder={localizedStrings.selectVehicleType + "..."}
            name="icon"
            control={inputsConfig.control}
          />
        </Col>
        <Col style={{ display: 'flex', flexDirection: 'column' }} md="4" className="mb-4">
          <Text font-style={'normal'} font-weight={'bold'} font-size={'13px'}
            line-height={'19px'}
            letter-spacing={'0.1px'}
            color={'#666666'}
            margin-bottom={'4px'}
          >
            {localizedStrings.vehicleColor}
          </Text>
          <CirclePicker color={selectors?.icon_color?.value} onChange={(item) => {
            dispatch(vehicleChangeSelectors({
              selectors: { icon_color: {value:item?.hex}, icon_background_color: {value: '#fff'} }
            }))
          }}
            colors={inputsConfig.inputs.iconColorOptions.map(color => color?.value)}
          />
        </Col>
        <Col style={{display: 'flex',justifyContent: 'center',alignItems: 'center',alignSelf: 'center',height: '100%'}} md="2" className="mb-6">
          <Icon
            id={`${localizedStrings.turnOn}-${selectors?.icon?.value}`}
            className={'type-icons'}
            icon={inputsConfig.getValues().icon?.value}
            width={"60px"} height={"60px"} marginLeft={"10px"}
            color={selectors?.icon_color?.value} />
          <Text font-style={'normal'} font-weight={'bold'} font-size={'13px'}
            line-height={'19px'}
            letter-spacing={'0.1px'}
            color={'#666666'}
            margin-bottom={'4px'}
          >
            {localizedStrings.turnOn}
          </Text>
        </Col>
        <Col style={{display: 'flex',justifyContent: 'center',alignItems: 'center',alignSelf: 'center',height: '100%'}} md="2" className="mb-6">
          <Icon
          id={`${localizedStrings.typeStatusOfMarker.off}-${selectors?.icon?.value}`}
          className={'type-icons'}
          icon={`${inputsConfig.getValues().icon?.value}-${localizedStrings.typeStatusOfMarker.off}`}
          width={"60px"} height={"60px"} marginLeft={"10px"}
          color={selectors?.icon_color?.value}/>
          <Text font-style={'normal'} font-weight={'bold'} font-size={'13px'}
            line-height={'19px'}
            letter-spacing={'0.1px'}
            color={'#666666'}
            margin-bottom={'4px'}
          >
            {localizedStrings.turnOff}
          </Text>
        </Col>
        {/* {
          vehicle.activeDevice &&
          <Col md="4" className="mb-6">
            <CardInput
              onChange={onChanges.handleInput}
              register={inputsConfig.register}
              inputs={[
                {
                  label: localizedStrings.activeDevice,
                  name: "active_device",
                  icon: <HelpIconWithTooltip
                    text={[
                      localizedStrings.tooltipHelpTexts.vehicleActiveDevice.text,
                    ]} />,
                  type: "text",
                  value: vehicle.activeDevice,
                  readOnly: true,
                }
              ]}
            />
          </Col>
        }
        {
          vehicle.previousActiveDevice &&
          <Col md="4" className="mb-6">
            <CardInput
              onChange={onChanges.handleInput}
              register={inputsConfig.register}
              inputs={[
                {
                  label: localizedStrings.previousActiveDevice,
                  name: "previous_active_device",
                  type: "text",
                  value: vehicle.previousActiveDevice,
                  readOnly: true,
                }
              ]}
            />
          </Col>
        } */}
    </div>
  );
}
