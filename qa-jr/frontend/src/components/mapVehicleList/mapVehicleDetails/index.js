import React, { useState, useEffect } from "react";
import { MapVehicleDetailsStyle } from "./style.js";
import { BoxStatus, BoxName } from '../mapVehicleItem/style';
import { Text, Icon, Link } from "components";
import { localizedStrings } from "constants/localizedStrings.js";
import { DEFAULT_NULL_VALUE, vehiclesStatusTypes } from "constants/environment";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ListStyle, ItemStyle } from "components/colorfulList/style.js";
import { searchVehicleAddress, loadOneVehicle } from "store/modules";
import {
  formatSpeedToCard,
} from "helpers/ReportCardsCalc.js";
import { GROUPS_MANAGE_PATH, VEHICLES_EDIT_PATH } from "constants/paths.js";
import { formatUnit, convert } from 'helpers/IntlService';
import {
  setRoute,
  changeMapConfiguration,
  setVehicle,
  loadMapVehicles
} from 'store/modules'
import { getUrlParam, setUrlParam } from 'utils/params';
import StatusCommandVehicle from '../mapVehicleItem/statusCommandVehicle';

export default function MapVehicleDetails({ setSelectedGroups, ...options }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [vehicleGroups, setVehicleGroups] = useState([]);
  const { vehicleToShow, vehicleAddress, filters } = useSelector((states) => states.map);
  const { searchedGroup, loadLoading } = useSelector((state) => state.groups);
  const { searchedVehicle } = useSelector((state) => state.vehicles);
  const [ secondsToUpdate, setSecondsToUpdate ] = useState(59);
  const [ timerOn, setTimerOn ] = useState(false);
  const vehiclePhone = vehicleToShow?.driver?.phone?.replace(/\D/g, "").replace('55','');

  const VISUALIZER_ROLE_ID = 4;

  const lastCommands = vehicleToShow?.vehicle?.lastCommandAndFromNow || [];
  const prepareCommands = lastCommands.reduce?.((acc, item, index) => {
    index === 0 && (acc['last'] = { ...item });
    index === 1 && (acc['before'] = { ...item });
    return acc;
  }, {});

  const {
    user: {
      user_settings: { distance_unit },
      role_id,
      vehicles: allowedVehiclesIds,
      organization_id
    },
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (searchedGroup && Array.isArray(searchedGroup)) {
      const groups = searchedGroup.filter((group) => {
        const vehicleId = getUrlParam("vehicle_id")
        return group.urn.includes(vehicleId)
      });

      setVehicleGroups(groups);
    }
    // eslint-disable-next-line
  }, [loadLoading, vehicleToShow]);
  const loadVehicleInformation = () => {
    [
      searchVehicleAddress,
      () => loadOneVehicle({ vehicle_id: vehicleToShow?.vehicle?.id }),
    ].map((fn) => dispatch(fn(vehicleToShow)));
  };
  useEffect(() => {
    loadVehicleInformation();
    // eslint-disable-next-line
  }, []);

  const openVehicleEdit = (id, inputToFocus) => {
    if (searchedVehicle?.id && searchedVehicle?.id !== id) return;
    const focusInput = `#${inputToFocus}`;
    history.push(`${VEHICLES_EDIT_PATH}?vehicle_id=${searchedVehicle.id}${focusInput}`, { vehicle: searchedVehicle });
  };

  useEffect(() => {
    if (timerOn && secondsToUpdate > 0) {
      setTimeout(() => setSecondsToUpdate(secondsToUpdate - 1), 1000);

    } else {
      setSecondsToUpdate(59);
      setTimerOn(false)
    }
  }, [secondsToUpdate, timerOn]);

  const formattedOdometer = formatUnit(convert(+vehicleToShow?.odometer, 'm', distance_unit?.toLowerCase?.()).toFixed(0), distance_unit?.toLowerCase?.());

  const goToSelectedGroup = (groupName) => {
    setUrlParam("groups", groupName)
    setUrlParam("vehicle_id");
    setUrlParam("status")
    dispatch(
      changeMapConfiguration({
        showIndividualVehicle: false,
        filters: {
          ...filters,
          groups: groupName,
        },
      })
    );
    dispatch(setRoute({}));
    dispatch(setVehicle({}));
    setSelectedGroups(groupName);
    dispatch(loadMapVehicles({
      role_id,
      organization_id,
      limit: true,
      vehicle_id: allowedVehiclesIds
  }))
  }

  return (
    <MapVehicleDetailsStyle {...options.divOptions}>
      <BoxStatus style={{ paddingRight: 0 }}>
        <BoxName>
          <Icon icon={"car"} width={"16px"} height={"16px"} color="#6C757D" />
          <Text
            textOverflow={"ellipsis"}
            overflow={"hidden"}
            margin={"0 10px"}
            color={"#1A237A"}
            fontSize={"13px"}
          >
            {vehicleToShow?.vehicle?.name}
          </Text>
        </BoxName>
      </BoxStatus>
	  <StatusCommandVehicle commands={prepareCommands} />
      {vehiclesStatusTypes[vehicleToShow?.status]?.text &&
        <div>
          <ListStyle max-height="23px" padding={"0px"}>
            <ItemStyle
              color={vehiclesStatusTypes[vehicleToShow?.status]?.color}
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
                color={vehiclesStatusTypes[vehicleToShow?.status]?.color}
              >
                {vehiclesStatusTypes[vehicleToShow?.status]?.text}
              </Text>
            </ItemStyle>
          </ListStyle>
        </div>
      }
      {vehicleToShow?.speed !== undefined &&
        vehicleToShow?.speed !== null &&
        role_id !== VISUALIZER_ROLE_ID && (
          <div>
            <div style={{ display: "flex" }}>
              <Icon
                icon={"tachometer"}
                width={"16px"}
                height={"16px"}
                color="#6C757D"
              />
              <Text
                textOverflow={"ellipsis"}
                width="auto"
                overflow={"hidden"}
                margin={"0 10px 0 15px"}
                color={"#212529"}
                fontSize={"13px"}
              >
                {formatSpeedToCard(
                  vehicleToShow?.speed,
                  0,
                  distance_unit + "/h",
                  2,
                  true
                )}
              </Text>
            </div>
            {vehicleToShow?.odometer !== undefined &&
              vehicleToShow?.odometer !== null &&
              role_id !== VISUALIZER_ROLE_ID && (
                <div style={{ display: "flex" }}>
                  <Icon
                    icon={"road"}
                    width={"16px"}
                    height={"16px"}
                    color="#6C757D"
                  />
                  <Text
                    textOverflow={"ellipsis"}
                    width="auto"
                    overflow={"hidden"}
                    margin={"0 10px 0 15px"}
                    color={"#212529"}
                    fontSize={"13px"}
                  >
                {formattedOdometer || DEFAULT_NULL_VALUE}
                  </Text>
                  {searchedVehicle?.id && (
                    <button
                      onClick={() => openVehicleEdit(searchedVehicle?.id, "odometer")}
                    >
                      <Icon
                        icon={"config"}
                        width={"16px"}
                        height={"16px"}
                        color="#1A237A"
                      />
                    </button>
                  )}
                </div>
              )}
          </div>
        )}
      {vehicleAddress?.capitalizedFormattedAddress && (
        <div>
          <Icon icon={"house"} width={"16px"} height={"16px"} color="#6C757D" />
          <Link
            textOverflow={"ellipsis"}
            overflow={"hidden"}
            href={
              "https://www.google.com/maps/place/" +
              [vehicleToShow?.lat, vehicleToShow?.lng]
            }
            target={"_blank"}
            margin={"0 10px 0 15px"}
            color={"#1A237A"}
            fontSize={"13px"}
          >
            {vehicleAddress?.capitalizedFormattedAddress}
          </Link>
        </div>
      )}
      <div>
        <Icon
          icon={"calendar"}
          width={"16px"}
          height={"16px"}
          color="#6C757D"
        />
        <Text
          textOverflow={"ellipsis"}
          width="77px"
          overflow={"hidden"}
          margin={"0 6px"}
          color={"#212529"}
          fontSize={"13px"}
        >
          {vehicleToShow?.date}
        </Text>
        <Icon icon={"clock"} width={"16px"} height={"16px"} color="#6C757D" />
        <Text
          textOverflow={"ellipsis"}
          width="77px"
          overflow={"hidden"}
          margin={"0 6px"}
          color={"#212529"}
          fontSize={"13px"}
        >
          {vehicleToShow?.hour}
        </Text>
      </div>
      <div>
        <Icon icon={"license"} width={"16px"} height={"16px"} color="#6C757D" />
        <Text
          textOverflow={"ellipsis"}
          width="250px"
          overflow={"hidden"}
          margin={"0 10px"}
          color={"#212529"}
          fontSize={"13px"}
        >
          {vehicleToShow?.driver?.nickname ? (
            vehicleToShow?.driver?.nickname
          ) : (
            <div>
              {localizedStrings.driverNotIdentified}
              <button
                style={{marginLeft: "10px", border: "1px solid #1A237A", padding: ".2rem", borderRadius: "4px"}}
                onClick={() => openVehicleEdit(searchedVehicle?.id, "default_driver")}>
                <Icon
                  icon={"driver"}
                  width={"16px"}
                  height={"16px"}
                  color="#1A237A"
                />
              </button>
            </div>
          )}
          {vehicleToShow?.driver?.phone && " "}
          {vehicleToShow?.driver?.phone && role_id !== VISUALIZER_ROLE_ID && (
            <Link
              href={
                "https://api.whatsapp.com/send?phone=55" +
                vehiclePhone
              }
              target={"_blank"}
            >
              {vehicleToShow?.driver.phone}
            </Link>
          )}
        </Text>
      </div>
      {!vehicleToShow?.hideGroups && <div style={{ fontSize: "13px" }}>{localizedStrings.vehiclesGroups}</div>}
      {!vehicleToShow?.hideGroups &&
      <div>
        <span style={{ fontSize: "13px" }}>
          <Link href={GROUPS_MANAGE_PATH} target="_blank" fontSize="13px">
            {localizedStrings.clickHereToCreateANewGroup}
          </Link>
        </span>
      </div>}
      {!vehicleToShow?.hideGroups &&
        vehicleGroups &&
        vehicleGroups?.length > 0 &&
        role_id !== VISUALIZER_ROLE_ID && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {vehicleGroups.map((group) => {
                return (
                  <div
                    onClick={() => goToSelectedGroup(group?.tagName)}
                    style={{
                      padding: "4px 8px",
                      margin: "5px",
                      width: "auto",
                      cursor: "pointer",
                      border: "1px solid #1A237A",
                      borderRadius: "4px",
                      backgroundColor: "white",
                    }}
                    key={group?.tagName}
                  >
                    <Text
                      maxWidth={"5rem"}
                      color={"#1A237A"}
                      fontSize={"13px"}
                      textAlign="center"
                      textOverflow={"ellipsis"}
                      overflow={"hidden"}
                      width="auto"
                      tooltipText={group?.tagName}
                    >
                      {group?.tagName}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </MapVehicleDetailsStyle>
  );
}
