import React, { useState, useEffect } from "react";
import { MapContainer } from "components";
import { action } from "@storybook/addon-actions";
export default {
    title: "MapContainer"
};

export const MapContainerComponent = () => {
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            setCenter(
                {
                    lat: coords.latitude,
                    lng: coords.longitude
                }
            )
        })
    }, [])
    return (
        <MapContainer
            mapElementStyle={{ minHeight: "500px" }}
            center={center}
        />
    );
}
