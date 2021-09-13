import React from "react";
import { MarkerClusterer } from "@react-google-maps/api";
import { VehicleMarker } from "components";
import cluster from "assets/cluster.svg";

export default function GroupsOfVehiclesMarkers({
  stateRoute,
  vehiclesPosition,
  clickable = true,
  setStateMarker,
  mapRef,
  ...options
}) {
  return (
    <MarkerClusterer
    averageCenter
    enableRetinaIcons
    styles={[
      {
        url: cluster,
        height: 53,
        lineHeight: 53,
        width: 53,
        anchorText: [-6, -6],
        textColor: "white",
      },
    ]}
    gridSize={60}
    >
      {(clusterer) =>
        vehiclesPosition.map(
          (location) => {
            return location.lat &&
            location.lng && (
            <VehicleMarker
                key={`${location?.vehicle?.id}:${location?.vehicle?.serial_number}`}
                location={location}
                stateRoute={stateRoute}
                clusterer={clusterer}
                {...options}
                setStateMarker={setStateMarker}
              />
            )
          }
        )
      }
    </MarkerClusterer>
  );
}
