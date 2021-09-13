import React from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { API_KEY_MAP } from 'constants/environment.js'
import { MapDiv } from './style.js'

const libraries = ["places"];

export default function MapContainer({ customStyles, children, onMapLoad = () => { }, ...options }) {
    const { loadError, isLoaded } = useLoadScript({
        googleMapsApiKey: API_KEY_MAP,
        libraries,
    })
    const [, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
        onMapLoad({ map })
        // eslint-disable-next-line
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return (
        <MapDiv style={{ height: "100%", width: "100%", ...options.divStyle }} >
            {
                isLoaded && !loadError &&
                <GoogleMap
                    mapContainerStyle={{ ...options.mapElementStyle }}
                    onLoad={onLoad}
                    clickableIcons={false}
                    onUnmount={onUnmount}
                    options={{
                        styles: customStyles,
                        zoomControlOptions: {
                            position: window?.google?.maps?.ControlPosition?.RIGHT_CENTER,
                        },
                        streetViewControlOptions: {
                            position: window?.google?.maps?.ControlPosition?.RIGHT_CENTER,
                        },
                        fullscreenControl: false,
                        mapTypeControlOptions: {
                            position: window?.google?.maps?.ControlPosition?.BOTTOM_CENTER,
                        },
                    }}
                    {...options}
                >
                    {children}
                </GoogleMap>
            }
        </MapDiv >
    )
}
