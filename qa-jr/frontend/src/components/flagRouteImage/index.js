import React, { memo } from 'react';
import { Marker, } from '@react-google-maps/api';
import markersIcons from "../vehicleMarker/markers-svgs";

export default memo(({
    location,
    name,
    color = "#0088FF",
    clickable = false,
    showVehicleIcon = true,
}) => {

    const generateSVGMarker = (name, color) => {
        const svg = markersIcons[name]({color});
        const encode = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
			return encode;
		};

    if (!location?.lat || !location?.lng) return <></>;

    return (
        <Marker
            title={location?.name}
            clickable={clickable}
            icon={showVehicleIcon && {
                url: generateSVGMarker(name, color)
            }}
            draggable={false}
            position={{ lat: location?.lat, lng: location?.lng }}
        />
    )
})