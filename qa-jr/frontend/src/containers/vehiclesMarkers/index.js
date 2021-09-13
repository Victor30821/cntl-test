import React, { useState, useEffect } from 'react'
import { VehicleMarker } from 'components'
import { useSelector } from 'react-redux';

export default function VehiclesMarkers({
    vehicleNamesVisibility,
    setStateMarker,
    mapRef,
    vehiclesPosition,
    centerVehicles,
    stateRoute
}) {
    const [visiblesMarkers, setVehiclesMarkers] = useState([]);
    const {
        showIndividualVehicle, showListVehicles, route, vehicleToShow
    } = useSelector(state => state.map);

    const getRegion = (vehicles) => {

        try {

            const [{ lat, lng }] = vehicles;

            if (lng === undefined || lng === undefined) throw new Error('lat or lng undefined')

            let bounds = {
                lat_min: lat,
                lng_min: lng,
                lat_max: lat,
                lng_max: lng
            };

            vehicles.forEach(vehicle => {
                let coordinates = { lat: vehicle.lat, lng: vehicle.lng };

                bounds.lat_min = Math.min(bounds.lat_min, coordinates.lat);
                bounds.lat_max = Math.max(bounds.lat_max, coordinates.lat);
                bounds.lng_min = Math.min(bounds.lng_min, coordinates.lng);
                bounds.lng_max = Math.max(bounds.lng_max, coordinates.lng);
            });

            const midX = (bounds.lat_min + bounds.lat_max) / 2;
            const midY = (bounds.lng_min + bounds.lng_max) / 2;

            if (isNaN(midX) || isNaN(midY)) throw new Error('lat or lng not a number')

            return {
                lat: midX,
                lng: midY
            }

        } catch (e) {

        }

        return false
    }

    const filterVehicleToShow = location => {
        try {
            const {
                vehicle: { id }
            } = location;

            return id === vehicleToShow?.vehicle?.id || !vehicleToShow?.vehicle?.id;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const filterVehicleByLatLng = location => {
        try {
            const { lat, lng } = location;

            const boundingBox = mapRef?.current?.getBounds()?.toUrlValue()?.split(",");

            if (boundingBox) {
                const [
                    latSouthWest,
                    lngSouthWest,
                    latNorthEast,
                    lngNorthEast,
                ] = boundingBox;
                if (lng >= +lngSouthWest && lng <= +lngNorthEast && lat <= +latNorthEast && lat >= +latSouthWest) {
                    return true;
                } else {
                    return false;
                }
            }

            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const setVisibleVehiclesOnMap = vehiclesToShow => {
        if (!Array.isArray(vehiclesPosition) || vehiclesPosition?.length === 0 || mapRef.current == null) return;
        if (centerVehicles) {
            const [
                allVehiclesZoom,
                oneVehicleZoom,
            ] = [
                    9,
                    16,
                ];

            const coordinates = getRegion(vehiclesPosition);

            const hasRoute = !!route?.coordinates?.length

            if (coordinates && !hasRoute) {

                mapRef.current.panTo(coordinates)

                const currentZoom = mapRef.current.getZoom();

                const showOneVehicle = showIndividualVehicle && !showListVehicles;

                if (currentZoom < allVehiclesZoom && !showOneVehicle) mapRef.current.setZoom(allVehiclesZoom);
                if (currentZoom < oneVehicleZoom && showOneVehicle) mapRef.current.setZoom(oneVehicleZoom);
            }
        }
        setVehiclesMarkers(vehiclesPosition);
    }

    useEffect(() => {
        const vehiclesToShow = vehiclesPosition
            ?.filter(filterVehicleByLatLng)
            ?.filter(filterVehicleToShow);
        setVisibleVehiclesOnMap(vehiclesToShow);
        // eslint-disable-next-line
    }, [vehiclesPosition]);

    const markers = visiblesMarkers.map(
      (location) =>
        location.lat &&
        location.lng && (
          <VehicleMarker
            showIndividualVehicle={showIndividualVehicle}
            stateRoute={stateRoute}
            key={`${location?.vehicle?.id}:${location?.vehicle?.serial_number}`}
            location={location}
            clickable={true}
            showVehicleName={vehicleNamesVisibility}
            showVehicleIcon
            mapRef={mapRef}
            setStateMarker={setStateMarker}
          />
        )
    );
    return markers
}
