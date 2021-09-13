import React, { memo, useState } from 'react';
import { Icon } from 'components';
import { Marker,InfoWindow } from '@react-google-maps/api';
import { formatUnit } from 'helpers/IntlService';
import { parseISO, format } from 'date-fns';
import markersIcons from "../vehicleMarker/markers-svgs";
import { convertUserMaskToDateFns } from 'utils/convert';
import { ContainerBox, ContainerClose, ContainerSpeedBox } from './styles';
import { localizedStrings } from "constants/localizedStrings";
import { useEffect } from 'react';

const generateSVGMarker = (route, greaterSpeed, onGoing = false) => {
    const RED = "#d80404";
    const BLUE = "#1D1B84";
    const pinColor = greaterSpeed === route?.speed ? RED : BLUE;

	const iconName = onGoing ? "route_on_going" : "pin";

    const svg = markersIcons[iconName]?.({ color: pinColor });
    const encode = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

    return encode;
  };

export default memo(({
    routes = [],
    settings,
	onGoing = false
}) => {
    const [showInfoWindow, setShowInfoWindow] = useState(null);
	const [waitTimeoutToShowInfo, setWaitTimeoutToShowInfo] = useState(null);
	const [routesToShow, setRoutesToShow] = useState([]);

	useEffect(() => {
		if (onGoing) {
            routes = routes.sort((a, b) => {
				if (!a.timestamp) return 1;
				if (!b.timestamp) return -1;

				return new Date(b.timestamp) - new Date(a.timestamp);
            });
			setRoutesToShow(routes.slice(1));
		} else {
			setRoutesToShow(routes);
		}
	}, [onGoing, routes]);

	const handleMouseOver = index => {
		const timeout = setTimeout(() => {
			setShowInfoWindow(index);
		}, 300);

		setWaitTimeoutToShowInfo(timeout);
    };

	const handleMouseOut = () => {
        if (waitTimeoutToShowInfo) {
			clearTimeout(waitTimeoutToShowInfo)
		}
    };

	const handleCloseContainer = () => {
        setShowInfoWindow(null);
    };

    const routeSpeeds = routesToShow?.map(route => route?.speed);

    const greaterSpeed = Math.max.apply(Math, routeSpeeds);

    return routesToShow?.map((route, index) => {
        return (
            <Marker
                id={index}
                key={index}
                onMouseOver={() => handleMouseOver(index)}
				onMouseOut={() => handleMouseOut(index)}
                draggable={false}
                icon={{
                    url: generateSVGMarker(route, greaterSpeed, onGoing),
                    width: 10,
                    height: 10
                }}
                position={{ lat: route?.lat, lng: route?.lng }}
            >
                {(showInfoWindow === index) && (
                    <InfoWindow style={{ display: 'none' }} id={`info-${index}`} key={index}>
                        <ContainerBox>
                            <ContainerClose onClick={() => handleCloseContainer()}>
                                <Icon icon={"plus"} width={"16px"} style={{ margin: "0 12px 0 0", transform: "rotate(45deg) scale(1)", }} height={"16px"} color={"#2E2C8C"} />
                            </ContainerClose>
                            <ContainerSpeedBox>
                                <Icon icon={"tachometer"} width={"16px"} style={{ margin: "0 12px 0 0" }} height={"16px"} color={"#2E2C8C"} />
                              <label>{localizedStrings.velocity}: {route.speed} {settings.distance_unit}/h</label>
                            </ContainerSpeedBox>
                            <ContainerSpeedBox>
                                <Icon icon={"clock"} width={"16px"} style={{ margin: "0 12px 0 0" }} height={"16px"} color={"#2E2C8C"} />
                                <label>{localizedStrings.date}: {format(parseISO(route.timestamp),  convertUserMaskToDateFns({mask:settings.short_date_format,timeMask: settings.short_time_format}))}</label>
                            </ContainerSpeedBox>
                        </ContainerBox>
                    </InfoWindow>
                )}
            </Marker>
        )
    })
})
