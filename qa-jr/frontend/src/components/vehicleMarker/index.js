import React, { memo, useMemo } from 'react';
import { ErrorBoundary, } from 'components';
import { useSelector } from 'react-redux';
import { Marker } from '@react-google-maps/api'
import { cordialDirections } from 'constants/environment';
import { getCompassDirection } from 'geolib';
import markersIcons from "./markers-svgs"

export default memo(({
    location,
    clickable = true,
    clusterer,
    stateRoute,
    setStateMarker,
  showVehicleName,
  showMarkerLabel,
}) => {
    const {
        vehicleToShow, showIndividualVehicle, showGroups
    } = useSelector(state => state.map)
  const {
    vehicles
  } = useSelector(state => state.vehicles)

  const vehicleInformation = useMemo(() => {
    const hasVehicles = Array.isArray(vehicles) && vehicles.length > 0;

    const hasLocation = !!location?.vehicle?.id;

    if (!hasLocation || !hasVehicles) return {};

    const vehiclesById = vehicles.reduce((vehicleObj = {}, current = {}) => {
      vehicleObj[current.id] = current;
      return vehicleObj;
    }, {});
    return vehiclesById[location.vehicle.id];
  }, [vehicles, location])

  const rotate = useMemo(() => {
        if (!location?.pointsfromDirection?.before?.lat && location?.pointsfromDirection?.after?.lat) return cordialDirections?.['N'];

            const initialPosition = {
                latitude: location?.pointsfromDirection?.before?.lat,
                longitude: location?.pointsfromDirection?.before?.lng
            }
            const finalPosition = {
                latitude: (showIndividualVehicle && stateRoute && stateRoute.latitude) || location?.pointsfromDirection?.after?.lat,
                longitude: (showIndividualVehicle && stateRoute && stateRoute.longitude) || location?.pointsfromDirection?.after?.lng
            }

            if(!initialPosition?.latitude || !initialPosition?.longitude || !finalPosition?.latitude || !finalPosition?.longitude) return cordialDirections?.['N'];

            const direction = getCompassDirection(initialPosition, finalPosition);

            return cordialDirections?.[direction] || cordialDirections?.['N']
// eslint-disable-next-line
    }, [location, stateRoute]);


    const vehiclePinStatusColor = {
        0: "#0F9D58",
        1: "#6C757D",
        2: "#FFC241",
        3: "#F87700"
    };

    const generateSVGMarker = (markerColor) => {
      const markerName = vehicleInformation?.icon || location?.vehicle?.icon;
      const markerBackgroundColor = vehicleInformation?.icon_color || location?.vehicle?.icon_color;

      const backgroundColorWithoutColorWhite = ["#fff", "#ffffff"].includes(markerBackgroundColor) ? undefined : markerBackgroundColor;

      if (!location?.vehicle) return;
      const svg =
        markersIcons[markerName]?.({ color: backgroundColorWithoutColorWhite, fill: markerColor, rotate }) ||
        markersIcons["carro"]({ color: backgroundColorWithoutColorWhite, fill: markerColor, rotate });
      const encode =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      return encode;
    };

    const generateSVGLabel = () => {
      const vehicleName = vehicleInformation?.name || location?.vehicle?.name;
      if (!location?.vehicle) return;
      const ellipsisVehicleName =
        vehicleName.length > 10
          ? `${vehicleName.substring(0, 10)}...`
          : vehicleName;
      const svg = markersIcons["label"]({ vehicleName: ellipsisVehicleName });
      const encode =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      return encode;
    };
    return (
      <ErrorBoundary>
        { (!showGroups || showMarkerLabel) &&
          <Marker
            title={location?.name}
            clickable={clickable}
            draggable={false}
            clusterer={clusterer}
            position={{ lat: location?.lat, lng: location?.lng }}
            icon={{
              url: generateSVGLabel(),
              anchor: new window.google.maps.Point(40, 40),
              size: new window.google.maps.Size(80, 80)
            }}
            opacity={showVehicleName ? 1 : 0}
          />
        }
        <Marker
          title={location?.name}
          clickable={clickable}
          draggable={false}
          clusterer={clusterer}
          position={{ lat: location?.lat, lng: location?.lng }}
          icon={{
            url: generateSVGMarker(
              vehiclePinStatusColor?.[location?.status] ||
                vehiclePinStatusColor?.[1]
            ),
            anchor: new window.google.maps.Point(32, 32),
            size: new window.google.maps.Size(64, 64)
          }}
          onClick={(event) => {
            const currentVehicleId = vehicleToShow?.vehicle?.id;
            const isSameVehicle = currentVehicleId === location?.vehicle?.id;
            if (!clickable || isSameVehicle) return;
            setStateMarker({ location });
          }}
        />
      </ErrorBoundary>
    );
})
