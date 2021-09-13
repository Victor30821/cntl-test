import React from 'react';
import { VehicleItemStyle, IconItemStyle, VehicleItemWrapper, ContainerActions, PlateBox, Status } from './style.js';
import { Text, Icon } from 'components';
import { localizedStrings } from 'constants/localizedStrings.js';
import { vehiclesStatusTypes, noModule } from 'constants/environment';
import { ListStyle, ItemStyle } from 'components/colorfulList/style.js';
import { useGoogleMap } from '@react-google-maps/api';
import { REPORT_ROUTES_PATH } from 'constants/paths.js';
import StatusCommandVehicle from './statusCommandVehicle';
import prefixNumbers from 'constants/prefixNumbers.json';

export default function MapVehicleItem({ location, onVehicleClick, country, ...options }) {
  const hasCommand = location?.vehicle?.lastCommandAndFromNow || [];
  const prepareCommands = hasCommand.reduce?.((acc, item, index) => {
    index === 0 && (acc['last'] = { ...item });
    index === 1 && (acc['before'] = { ...item });
    return acc;
  }, {});
    const map = useGoogleMap();
    const prefixNumber = prefixNumbers?.[country] || prefixNumbers?.['BR'];
    const driverPhoneNumber = ((location?.driver?.phone?.indexOf?.(prefixNumber) > -1 && location?.driver?.phone) || `${prefixNumber}${location?.driver?.phone || ''}`);

    return (
      <VehicleItemWrapper {...options}>
        <VehicleItemStyle
          title={localizedStrings.clickNext}
          key={location.vehicle?.id}
          clickable={location?.status !== noModule}
          onClick={() => {
            if (location?.status === noModule) return;

            onVehicleClick({
              map,
              location,
            });
          }}
        >
          <div style={{display: 'flex', padding:5}}>
             <Status color={vehiclesStatusTypes[location?.status]?.color}/>
             <PlateBox>
                {location.vehicle.plate_number}
             </PlateBox>
             <ListStyle max-height="23px" padding={"0px"} marginLeft={10}>
              <ItemStyle
                color={vehiclesStatusTypes[location?.status]?.color}
                before={{
                  margin: "-8px 4px 0px 3px",
                }}
              >
                <Text
                  textOverflow={"ellipsis"}
                  lineHeight={"13px"}
                  overflow={"hidden"}
                  margin={"0px"}
                  fontWeight={"bold"}
                  color={vehiclesStatusTypes[location?.status]?.color}
                >
                  {vehiclesStatusTypes[location?.status]?.text}
                </Text>
              </ItemStyle>
            </ListStyle>
          </div>
          <div style={{padding:5}}>
            <Icon icon={"car"} width={"16px"} height={"16px"} color="#6C757D" />
            <span
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              width: "15rem",
              margin: "0 10px",
              color: "#1A237A",
              fontSize: "13px",
            }}
              >
              {location.vehicle?.name}
            </span>
          </div>
            <StatusCommandVehicle commands={prepareCommands} />
          {location?.status !== noModule && (
            <div style={{padding:5}}>
              <Icon
                icon={"calendar"}
                width={"16px"}
                height={"16px"}
                color="#6C757D"
              />
              <Text
                textOverflow={"ellipsis"}
                overflow={"hidden"}
                margin={"0 8px"}
                color={"#212529"}
                fontSize={"13px"}
              >
                {location.date}
              </Text>
              <Icon
                icon={"clock"}
                width={"16px"}
                height={"16px"}
                color="#6C757D"
              />
              <Text
                textOverflow={"ellipsis"}
                overflow={"hidden"}
                margin={"0 8px"}
                color={"#212529"}
                fontSize={"13px"}
              >
                {location.hour}
              </Text>
            </div>
          )}
          {location?.status !== noModule && (
            <div style={{padding:5}}>
              <Icon
                icon={"driver"}
                width={"16px"}
                height={"16px"}
                color="#6C757D"
              />
              <Text
                textOverflow={"ellipsis"}
                overflow={"hidden"}
                margin={"0 10px"}
                color={"#212529"}
                fontSize={"13px"}
              >
                {location?.driver?.nickname || location?.driver?.name
                  ? location.driver?.nickname || location?.driver?.name
                  : localizedStrings.driverNotIdentified}
              </Text>
            </div>
          )}
        </VehicleItemStyle>
        <ContainerActions>
          {location?.driver?.phone && (
            <IconItemStyle
              as={"a"}
              href={
                "https://api.whatsapp.com/send?phone=" + driverPhoneNumber
              }
              target={"_blank"}
            >
              <Icon
                icon={"whatsapp"}
                width={"18px"}
                height={"18px"}
                color="#24b3a4"
              />
            </IconItemStyle>
          )}
          {location?.status !== noModule && (
            <IconItemStyle
              as={"a"}
              href={
                window.location.origin +
                REPORT_ROUTES_PATH +
                "?vehicle_id=" +
                location.vehicle.id
              }
            >
              <Icon
                icon={"route"}
                width={"16px"}
                height={"16px"}
                color="#1A237A"
              />
            </IconItemStyle>
          )}
        </ContainerActions>
      </VehicleItemWrapper>
    );
}
