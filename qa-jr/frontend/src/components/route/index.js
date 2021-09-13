import React, { useMemo, useState } from 'react'
import { getRandomColor } from 'utils/getRandomColor';
import { Polyline } from '@react-google-maps/api';
import { FlagRouteImage } from 'components';

export default function RoutePolyline({
    coordinates = [],
    showRoute = true,
    polylineColor = getRandomColor(),
    hideEndLocation = false,
    hideStartLocation = false,
}) {
    const [routeColor] = useState(polylineColor);

    const end_location = useMemo(() => {
        const lastPosition = coordinates.slice().pop();

        const {
            lat = 0,
            lng = 0
        } = lastPosition || {};

        return {
            lat,
            lng
        }
    }, [coordinates.length]);

    const start_location = useMemo(() => {
        const startPosition = coordinates.slice().shift();
        const {
            lat = 0,
            lng = 0
        } = startPosition || {};
        return {
            lat,
            lng
        }
    }, [coordinates.length])

    return (
        end_location?.lat && start_location?.lat && showRoute && (
            <>
                {
                    !hideStartLocation && <FlagRouteImage location={start_location} name={"start_flag"} />
                }
                <Polyline
                    path={coordinates}
                    options={{
                        strokeColor: routeColor,
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                    }}
                />
                {
                    !hideEndLocation && <FlagRouteImage location={end_location} name={"end_flag"} />
                }
            </>
        )

    )
}
