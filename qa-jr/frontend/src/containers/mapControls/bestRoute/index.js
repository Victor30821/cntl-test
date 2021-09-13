import React, { useState, useEffect } from "react";
import { MapControlsStyle, MapSearchInput, BestRouteAddressContainer } from "../style";
import { IconsRow, RouteAddressInputs, Text, Col, ReportCard } from 'components';
import $ from 'jquery';
import { useSelector, useDispatch } from "react-redux";
import { changeMapConfiguration, setRoute } from 'store/modules'
import { localizedStrings } from "constants/localizedStrings";
import { setUrlParam } from "utils/params";
import { useGoogleMap } from "@react-google-maps/api";
import { Row } from "reactstrap";
import { useForm } from "react-hook-form";

export default function MapBestRouteControls({
    setStartRouteControl,
    mapControlsVisible,
    setMapControlsVisible,
    ...options
}) {
    const dispatch = useDispatch();
    const map = useGoogleMap();
    const [share, setShare] = useState(false)

    const {
        route,
    } = useSelector(state => state.map);

    const { setValue, register, getValues, watch } = useForm();

    const centerRouteOnMap = () => {
        if (!route?.coordinates?.length) return;

        try {

            const latlngbound = new window.google.maps.LatLngBounds();

            route.coordinates.forEach(coord => latlngbound.extend(new window.google.maps.LatLng(coord.lat, coord.lng)));

            latlngbound && map.fitBounds(latlngbound);

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {

        centerRouteOnMap();
    // eslint-disable-next-line
    }, [route]);

    return (
        <>
            <MapControlsStyle >
                <MapSearchInput
                    padding="10px"
                    borderRadius="4px"
                    backgroundColor="#1A237A"
                >
                    <Text color={"#fff"}>{localizedStrings.bestRoutePlanning}</Text>
                </MapSearchInput>
                <BestRouteAddressContainer
                    onMouseEnter={() => setMapControlsVisible(true)}
                    show={mapControlsVisible} >
                    <div

                        style={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "column",
                            maxHeight: "400px",
                            overflow: "scroll",
                        }}>

                        <RouteAddressInputs
                            setValue={setValue}
                            register={register}
                            watch={watch}
                            getValues={getValues}
                            share={share}
                            setShare={setShare}
                        />
                        <Row style={{ margin: "0", }}>
                            <Col>
                                <ReportCard
                                    title={localizedStrings.distance}
                                    value={route?.distance}
                                    icon={"road"}
                                    type={"distance"}
                                />
                            </Col>
                            <Col>
                                <ReportCard
                                    title={localizedStrings.estimatedTime}
                                    value={route?.duration}
                                    icon={"clock"}
                                    type={"duration"}
                                />
                            </Col>
                        </Row>
                    </div>

                </BestRouteAddressContainer>
                {
                    <IconsRow
                        show={mapControlsVisible}
                        onMouseEnter={() => setMapControlsVisible(true)}
                        size={20}
                        icons={[
                            {
                                icon: "arrow-left",
                                tooltip: localizedStrings.return,
                                onClick: () => {
                                    dispatch(changeMapConfiguration({
                                        showListVehicles: true
                                    }));
                                    dispatch(setRoute({}));
                                    setStartRouteControl(false)
                                    $("#address").val("");
                                    setUrlParam("address");
                                }
                            },
                            {
                                icon: "share",
                                tooltip: localizedStrings.shareRoute,
                                onClick: () => setShare(true)
                            },
                        ]} />
                }
            </MapControlsStyle>
        </>
    );
}
