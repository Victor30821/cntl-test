import React, { useEffect } from 'react';
import { ButtonWithIcon, Icon, Link, Text } from 'components';
import { Container, Title, BoxTitle, OdometerText } from './styles';
import { ListStyle, ItemStyle } from 'components/colorfulList/style.js';
import { useSelector } from "react-redux";
import { formatUnit, convert } from 'helpers/IntlService';
import { VEHICLES_EDIT_PATH, DRIVERS_PATH, REPORT_ROUTES_PATH } from "constants/paths.js";
import { useHistory } from "react-router-dom";
import { localizedStrings } from "constants/localizedStrings";
import { useGoogleMap } from '@react-google-maps/api'
import { searchAddressInfoWindow } from "store/modules"
import { PlateBox, Status } from '../mapVehicleList/mapVehicleItem/style.js';
import { vehiclesStatusTypes } from 'constants/environment';
import StatusCommandVehicle from '../mapVehicleList/mapVehicleItem/statusCommandVehicle';

export default function InfoWindowMarker ({ location, onVehicleClick, setStateMarker, dispatch }) {
    const history = useHistory();
    const map = useGoogleMap();
    const {
        user: { user_settings: { distance_unit } }
    } = useSelector(state => state.auth);

    const {
        infoWindowAddress
    } = useSelector(state => state.map)

    const openVehicleEdit = ({vehicle}) => {
        if (!vehicle?.id) return;
        const focusInput = "#odometer";
        history.push(`${VEHICLES_EDIT_PATH}?vehicle_id=${vehicle.id}${focusInput}`, { vehicle: vehicle });
    };

    const has_loaded_address = 
        !!infoWindowAddress &&
        !!infoWindowAddress?.formattedAddress;

    useEffect(() =>{

        const has_adresss_from_previous_vehicle = 
            !!infoWindowAddress &&
            !!infoWindowAddress.formattedAddress;

        if(has_adresss_from_previous_vehicle) {
            dispatch(searchAddressInfoWindow({
                lat: null,
                lng: null,
            }));
        }

    },[location?.lat, location?.lng]);

	const lastCommands = location?.vehicle?.lastCommandAndFromNow || [];
	const prepareCommands = lastCommands.reduce?.((acc, item, index) => {
		index === 0 && (acc['last'] = { ...item });
		index === 1 && (acc['before'] = { ...item });
		return acc;
	}, {});

    return (
        <Container>
            <BoxTitle>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title>{location?.vehicle?.name}</Title>
                </div>
                <div style={{ display: 'flex' }}>
                    <ButtonWithIcon
                        icon={"eye"}
                        onClick={() => {
                            onVehicleClick({
                                map,
                                showListVehicles: false,
                                location
                            })
                            setStateMarker(null);
                        }}
                        width="auto"
                        customBackgrounddivor={"transparent"}
                        customTextColor={"#1D1B84"}
                        customIconColor={"#1D1B84"}
                        border={"1px solid transparent"}
                        background={"#F5F5F5"}
                        maxHeight={36}
                        style={{ display: "flex" }}
                        position={"relative"}
                        borderRadius={20}
                        minWidth={36}
                        marginRight={10}
                        iconOptions={{
                            divProps: {
                                position: "absolute",
                                left: "8px",
                                width: "18px",
                            },
                        }}
                        textOptions={{
                            whiteSpace: "none",
                            fontSize: "16px",
                        }}
                    />
                    <ButtonWithIcon
                        icon={"route"}
                        onClick={() => window.open(window.location.origin + REPORT_ROUTES_PATH + "?vehicle_id=" + location?.vehicle?.id, '_self')}
                        width="auto"
                        customBackgrounddivor={"transparent"}
                        customTextColor={"#1D1B84"}
                        customIconColor={"#1D1B84"}
                        border={"1px solid transparent"}
                        background={"#F5F5F5"}
                        maxHeight={36}
                        style={{ display: "flex" }}
                        position={"relative"}
                        borderRadius={20}
                        minWidth={36}
                        iconOptions={{
                            divProps: {
                                position: "absolute",
                                left: "8px",
                                width: "18px",
                            },
                        }}
                        textOptions={{
                            whiteSpace: "none",
                            fontSize: "16px",
                        }}
                    />
                </div>
            </BoxTitle>
			<div style={{display: 'flex', alignItems: 'center'}}>
				<StatusCommandVehicle commands={prepareCommands} />
			</div>
			<div style={{display: 'flex', alignItems: 'center', paddingTop: '8px'}}>
				<Status color={vehiclesStatusTypes[location?.status]?.color}/>
				<PlateBox style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					whiteSpace: 'nowrap'
				}}>
					{location.vehicle.plate_number}
				</PlateBox>
				<ListStyle max-height="23px" padding={"0px"} marginLeft={10}>
				<ItemStyle
					color={vehiclesStatusTypes[location?.status]?.color}
					style={{position: 'relative', width: 175}}
					before={{
						margin: 0,
						position: "absolute",
						top: -10,
					}}
				>
					<Text
					textOverflow={"ellipsis"}
					lineHeight={"13px"}
					overflow={"hidden"}
					margin={"0 0 0 12px"}
					fontWeight={"bold"}
					color={vehiclesStatusTypes[location?.status]?.color}
					>
					{vehiclesStatusTypes[location?.status]?.text}
					</Text>
				</ItemStyle>
				</ListStyle>
			</div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {
                    location?.odometer &&
                    <OdometerText>
                        {
                            formatUnit(
                                convert(location?.odometer, 'm', distance_unit?.toLowerCase?.()).toFixed(0),
                                distance_unit?.toLowerCase?.()
                            )
                        }
                    </OdometerText>
                }
                <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => openVehicleEdit({ vehicle: location?.vehicle })}
                >
                    <Icon
                        icon={"config"}
                        width={"16px"}
                        height={"16px"}
                        color="#1A237A"
                    />
                </button>
            </div>
            <div style={{marginTop: '5px'}}>
                <span
                    style={{
                        color: "#1A237A",
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: has_loaded_address === false ? "pointer" : "initial"
                    }}
                    onClick={() => {

                        if(has_loaded_address === false) dispatch(searchAddressInfoWindow({
                            lat: location?.lat,
                            lng: location?.lng,
                        }));
                    }}
                >
                {has_loaded_address ? infoWindowAddress?.formattedAddress : localizedStrings.viewAddress}
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px', verticalAlign: 'center' }}>
                {(location?.driver?.nickname || location?.driver?.name) && (
                    <div style={{marginRight: '25px'}}>
                        <Link
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            href={window.location.origin + DRIVERS_PATH + '/gerenciar'}
                            target={"_blank"}
                            marginTop={"5px"}
                            color={"#1A237A"}
                            fontSize={"13px"}
                            title={location?.driver?.name}
                        >
                            {location?.driver?.nickname || location?.driver?.name}
                        </Link>
                    </div>
                )}

                {location?.driver?.phone && (
                    <div>
                        <Link
                            style={{ display: 'flex' }}
                                marginLeft={5}
                            fontSize={13}
                            href={
                                "https://api.whatsapp.com/send?phone=" +
                                location?.driver?.phone
                            }
                            target={"_blank"}
                        >
                            <Icon icon={"whatsapp"} width={"16px"} height={"16px"} color="#0F9D58" />
                            {location?.driver.phone}
                        </Link>
                    </div>
                )}
            </div>
        </Container>
    )
};
