import React, { useRef, useEffect, useState } from 'react';
import { Card, CardTitle, MapContainer, Icon, Fences, FenceTooltip, ButtonWithIcon, Input } from 'components'
import { MapControlsStyle, MapSearchInput, MapSearchIcon, } from "./style";
import { Polygon, Marker, Autocomplete } from '@react-google-maps/api'
import { useForm } from 'react-hook-form';
import { localizedStrings } from 'constants/localizedStrings';
import { setUrlParam } from 'utils/params';
import { useDispatch, useSelector } from 'react-redux';
import { searchAddressToRoute } from 'store/modules';

const height = window.outerHeight;

export default function FormWithMap({ fence = [], setFenceCoordinates, title }) {
    const clicksRef = useRef(null);
    const fenceTooltip = useRef(null);
    const mapRef = useRef(null);
    const [showFenceTooltip, setShowFenceTooltip] = useState(false);
    const dispatch = useDispatch();

    const {
        route
    } = useSelector(state => state.map);

    // eslint-disable-next-line
    const { register, setValue, getValues } = useForm();

    let mouseUpEvent = false;

    const onMapClicked = ({ latLng }) => {

        const coordinates = {
            lat: latLng.lat(),
            lng: latLng.lng(),
        }

        setFenceCoordinates([...fence, coordinates])
    }

    const onRightClick = ({ vertex: vertexIndex }) => {

        clicksRef.current(
            setFenceCoordinates,
            fence.filter((path, index) => index !== vertexIndex)
        )();

    }


    const setEdittedPaths = ({ latLng, vertex: vertexIndex }) => {

        const edittedFence = [...fence];

        edittedFence.splice(vertexIndex, 1, {
            lat: latLng.lat(),
            lng: latLng.lng(),
        });

        mouseUpEvent = clicksRef.current(setFenceCoordinates, edittedFence)
    }

    const registerEvent = () => {
        clicksRef.current = (func, params) => () => func(params);
    }

    const executeEvent = () => {
        if (typeof mouseUpEvent === "function") mouseUpEvent()
    }

    const onFilterInputChange = (field, value) => {     
        if(!field?.suggestion) {
            setUrlParam('address', field)
            dispatch(searchAddressToRoute({
                text: field,
                showRoute: false,
                route: {}
            }));
        }

       if(field?.suggestion) {
        setUrlParam('address', field.suggestion.value)
        dispatch(searchAddressToRoute({
            text: field.suggestion.value,
            showRoute: false,
            route: {}
        }));
       }
    };

    const fitBoundsOnMap = latLngArray => {
        try {
            const latlngbound = new window.google.maps.LatLngBounds();

            latLngArray
                .map(coord => ({
                    ...coord,
                    lat: coord?.latitude || coord?.lat,
                    lng: coord?.longitude || coord?.lng,
                }))
                .forEach(coord => latlngbound.extend(new window.google.maps.LatLng(coord.lat, coord.lng)));

            if (!latlngbound) return;

            mapRef.current.fitBounds(latlngbound);
            mapRef.current.setZoom(14);
        } catch (error) {
            console.log(error);
        }
    }

    const zoomToLocation = location => {
        if (!mapRef.current) return;
        try {
            
            location = location
                .filter(coord => coord);

            if (location?.length === 0) throw new Error("None addresses");
                
            fitBoundsOnMap(location)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        zoomToLocation(route?.addresses);
        // eslint-disable-next-line
    }, [route?.addresses]);

    const  [autocomplete, setautocomplete] = useState();

    const onLoad = (initialAutoComplete) => {        
        setautocomplete(initialAutoComplete)
    };

    const onPlaceChanged = () => {
        try {
            if (autocomplete) {
                if (autocomplete.getPlace()) {
                    const lat = autocomplete.getPlace().geometry.location.lat();
                    const lng = autocomplete.getPlace().geometry.location.lng();
                    dispatch(searchAddressToRoute({ latLng: { lat, lng } }));
                }
            } 
        } catch(error) {
            console.log(error)
        }
    };

    return (
        <Card >
            <CardTitle color={"#333"} fontWeight={"bold"} fontSize={"14px"} >
                {title}
            </CardTitle>
            <MapContainer
                mapElementStyle={{ minHeight: height - 220 + "px" }}
                onMapLoad={({ map }) => {
                    mapRef.current = map;

                    zoomToLocation(fence);

                    const brazilCoords = {
                        lat: -14.760824585367107,
                        lng: -54.98130527770911
                    }
                    const defaultMapConfig = {
                        zoom: 4,
                        center: brazilCoords
                    }
                    map.setZoom(defaultMapConfig.zoom);
                    map.setCenter(defaultMapConfig.center)
                }}
                onClick={onMapClicked} >
                <MapControlsStyle >
                    <MapSearchInput>
                        <Autocomplete restrictions={{country: "br"}} onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                            <Input
                                style={{
                                    minHeight: "43px", minWidth: "327px",
                                    borderTopRightRadius: "0px",
                                    borderBottomRightRadius: "0px",
                                }}
                                placeholder={localizedStrings.mapPlaceSearchPlaceholder}
                            />
                        </Autocomplete>
                        <MapSearchIcon>
                            <Icon icon={"search"} width={'16px'} height={'16px'} color={"#868E96"} />
                        </MapSearchIcon>
                    </MapSearchInput>
                    <ButtonWithIcon
                        title={localizedStrings.clear}
                        icon={'trash'}
                        onClick={() => setFenceCoordinates([])}
                        width="auto"
                        customBackgrounddivor={"#fff"}
                        customTextColor={"#1D1B84;"}
                        customIconColor={"#1D1B84;"}
                        background={"#fff ! important"}
                        border={"1px solid #1D1B84;"}
                        maxHeight="40px"
                        style={{ display: 'flex', marginLeft: "18px", justifyContent: 'space-between', }}
                        position={"relative"}
                        iconOptions={{
                            divProps: {
                                color: '#1D1B84',
                                width: '18px'
                            }
                        }}
                        textOptions={{
                            whiteSpace: "none",
                            fontSize: "16px",
                        }}
                    />
                </MapControlsStyle>

                {
                    route?.addresses?.map(address => (
                        <Marker
                            draggable={false}
                            clickable={false}
                            position={{ lat: address?.latitude, lng: address?.longitude }}
                        />
                    ))
                }

                <Polygon
                    onRightClick={onRightClick}
                    onMouseOut={executeEvent}
                    onMouseUp={setEdittedPaths}
                    onMouseDown={registerEvent}
                    paths={fence}
                    editable={true}
                    draggable={false}
                    options={{
                        fillColor: "#0000FF",
                        strokeColor: "#0000FF",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillOpacity: 0.35,
                        zIndex: 99,
                    }}
                />
                <Fences
                    fenceTooltip={fenceTooltip}
                    setShowFenceTooltip={setShowFenceTooltip}
                />
                {
                    showFenceTooltip &&
                    <FenceTooltip
                        name={showFenceTooltip?.name}
                        positionX={showFenceTooltip?.positionX}
                        positionY={showFenceTooltip?.positionY}
                    />
                }
            </MapContainer>
        </Card>
    );
}
