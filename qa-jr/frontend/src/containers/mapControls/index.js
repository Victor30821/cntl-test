import React, { useState, useEffect, useRef } from "react";
import { MapControlsStyle, MapSearchInput, MapSearchIcon } from "./style";
import { CardInput, Icon, IconsRow, ColorfulList, MapVehicleList, Input } from 'components';
import $ from 'jquery';
import { vehiclesStatusTypes, noModule } from 'constants/environment';
import { useSelector, useDispatch } from "react-redux";
import { setVehicle, changeMapConfiguration, setRoute } from 'store/modules'
import { localizedStrings } from "constants/localizedStrings";
import { getUrlParam, setUrlParam } from "utils/params";
import { toast } from "react-toastify";
import { useGoogleMap, Autocomplete } from "@react-google-maps/api";
import { REPORT_ROUTES_PATH } from "constants/paths";

const defaultListItems = Object.values(vehiclesStatusTypes).map((status, index) => ({ color: status.color, text: "0 " + status.textPlural }));
const VISUALIZER_ROLE_ID = 4;

export default function MapControls({
    history,
    loadVehiclesOnMap,
    register,
    setValue,
    getValues,
    mapControlsVisible,
    setMapControlsVisible,
    vehicles,
    onSearchAddress,
    vehicleNamesVisibility,
    setVehicleNamesVisibility,
    onVehicleClick,
    onStatusClick,
    setSelectedGroups,
    setCenterVehicles,
    centerVehicles,
    setRestartTimer,
    ...options
}) {

    const inputTimeout = useRef(null);

    const map = useGoogleMap();

    const dispatch = useDispatch()

    const {
        showTraffic,
        showGroups,
        showListVehicles,
        vehicleToShow,
        showIndividualVehicle, route, filters
    } = useSelector(states => states.map);

    const {
        statusSummary, lastPoints
    } = useSelector(states => states.vehicles);

    const {
        loadLoading: groupLoading
    } = useSelector(states => states.groups);

    const {
        user: {
            role_id,
        }
    } = useSelector((state) => state.auth);

    const [showOneVehicle, setShowOneVehicle] = useState(showIndividualVehicle && !showListVehicles);

    const [listItems, setListItems] = useState(defaultListItems);

    const setVehiclesStatus = () => {

        setListItems(
            Object.values(vehiclesStatusTypes)
                .map((status, index) => {
                    const count = statusSummary[index];

                    const text = count === 1 ? status.text : status.textPlural;

                    if (!count && index === noModule) return false;

                    return {
                      status: index,
                      quantity: count,
                      color: status.color,
                      text: (
                          <span style={{ display: "flex" }}>
                              <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                                  {count}
                              </span>{text}
                          </span>
                      ),
                    };
                })
                .filter(status => status !== false)
        )
    }

    const onFilterInputChange = (field, value) => {

        inputTimeout != null && inputTimeout.current && clearTimeout(inputTimeout.current);

        inputTimeout.current = setTimeout(() => {

            setUrlParam(field, value)

            setValue(field, value)

            if (showOneVehicle || showListVehicles) return onSearchAddress({ text: value })

            dispatch(changeMapConfiguration({
                filters: {
                    ...filters,
                    text: value,
                }
            }))

        }, 1000);
    };

    const  [autocomplete, setautocomplete] = useState();

    const onLoad = (initialAutoComplete) => {
        setautocomplete(initialAutoComplete)
    };

    const onPlaceChanged = () => {
        if (autocomplete) {
            if (autocomplete.getPlace()) {
                const lat = autocomplete.getPlace().geometry.location.lat();
                const lng = autocomplete.getPlace().geometry.location.lng();
                onSearchAddress({ latLng: { lat, lng } });
            }
        }
    };

    const setFilteredVehicle = vehicleId => {

        if (lastPoints.length === 0) return;

        const vehicle = lastPoints.find(location => location?.vehicle?.id === vehicleId);

        if (!vehicle) {

            setUrlParam("vehicle_id")

            return toast.error(localizedStrings.vehicleNotFound);

        }

        dispatch(changeMapConfiguration({
            showListVehicles: false,
            showIndividualVehicle: true,
        }));

        if (centerVehicles) {
            if (!vehicle?.lat || !vehicle?.lng) return;

            map.panTo({
                lat: vehicle?.lat,
                lng: vehicle?.lng,
            });

            const [
                allVehiclesZoom,
                oneVehicleZoom,
            ] = [
                    9,
                    16,
                ];

            const currentZoom = map.getZoom();

            if (currentZoom < allVehiclesZoom && !showOneVehicle) map.setZoom(allVehiclesZoom);
            if (currentZoom < oneVehicleZoom && showOneVehicle) map.setZoom(oneVehicleZoom);
        }
        dispatch(setVehicle({ vehicle }))
    }

    const resetFilters = () => {

        $("#vehicle_name").val("");
        $("#address").val("");

        setUrlParam("address");
        setUrlParam("vehicle_name");
        setUrlParam("vehicle_id");
        setUrlParam("status");
        setUrlParam("groups");

    };

    useEffect(() => {

        const showVehicle = showIndividualVehicle && !showListVehicles;

        setShowOneVehicle(showVehicle);

        if (showVehicle) {
            loadVehiclesOnMap();
        }
    // eslint-disable-next-line
    }, [showIndividualVehicle, showListVehicles]);

    useEffect(() => {

        if (statusSummary && !groupLoading) {

            setVehiclesStatus();

            const vehicleId = +getUrlParam("vehicle_id");

            if (!!vehicleId) setFilteredVehicle(vehicleId)

        }
    // eslint-disable-next-line
    }, [statusSummary, groupLoading]);

    return (
        <>
            <MapControlsStyle >
                <MapSearchInput>
                    {
                    (showOneVehicle || showListVehicles) ?
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
                    :
                    <CardInput
                        inputDivStyle={{margin:'0px important!'}}
                        onChange={onFilterInputChange}
                        register={register}
                        inputs={
                            {
                                name: showOneVehicle || showListVehicles ? "address" : "vehicle_name",
                                type: "text", noMask: true,
                                defaultValue: showOneVehicle || showListVehicles ? getValues()?.["address"] : getValues()?.["vehicle_name"],
                                placeholder: showOneVehicle || showListVehicles ? localizedStrings.mapPlaceSearchPlaceholder : localizedStrings.searchForAVehicles,
                                onMouseEnter: () => setMapControlsVisible(true),
                                style: {
                                    minHeight: "43px", minWidth: "327px",
                                    borderTopRightRadius: "0px",
                                    borderBottomRightRadius: "0px",
                                }
                            }
                        }
                    />
                    }
                    <MapSearchIcon>
                        <Icon icon={"search"} width={'16px'} height={'16px'} color={"#868E96"} />
                    </MapSearchIcon>
                </MapSearchInput>
                {
                    showListVehicles
                        ? <ColorfulList
                            items={listItems}
                            onStatusClick={onStatusClick}
                            onMouseEnter={() => setMapControlsVisible(true)}
                            show={mapControlsVisible}
                        />
                        : <MapVehicleList
                            vehicles={vehicles}
                            onVehicleClick={onVehicleClick}
                            onMouseEnter={() => setMapControlsVisible(true)}
                            show={mapControlsVisible}
                            setSelectedGroups={setSelectedGroups}
                        />
                }
                {
                    <IconsRow
                        show={mapControlsVisible}
                        onMouseEnter={() => setMapControlsVisible(true)}
                        size={20}
                        icons={[
                            showListVehicles && {
                                icon: "list",
                                tooltip: localizedStrings.listVehices,
                                onClick: () => {
                                    dispatch(changeMapConfiguration({
                                        showListVehicles: false,
                                        filters: {
                                            groups: false,
                                            status: false,
                                            text: false,
                                        }
                                    }));

                                    $("#address").val("");

                                    resetFilters();

                                    dispatch(setVehicle({}));

                                    dispatch(setRoute({
                                        ...route,
                                        addresses: [],
                                    }));
                                }
                            },
                            !showListVehicles && {
                                icon: "arrow-left",
                                tooltip: showOneVehicle ? localizedStrings.returnToListVehicles : localizedStrings.return,
                                onClick: () => {
                                    if (showOneVehicle) {
                                        loadVehiclesOnMap(false);
                                        dispatch(setVehicle({}));
                                        dispatch(changeMapConfiguration({
                                            showIndividualVehicle: false, filters: {
                                            text: false, groups: false, status: false,}
                                        }));
                                    }

                                    if (!showListVehicles) {
                                        dispatch(changeMapConfiguration({
                                            showListVehicles: true,
                                            showIndividualVehicle: false,
                                            filters: {
                                                groups: false,
                                                text: false,
                                                status: false,
                                            }
                                        }))
                                        return resetFilters();
                                    }
                                }
                            },
                            role_id !== VISUALIZER_ROLE_ID && {
                                icon: showTraffic ? "traffic-light" : "traffic-light-closed",
                                tooltip: showTraffic ? localizedStrings.hideTraffic : localizedStrings.showTraffic,
                                onClick: () => dispatch(changeMapConfiguration({ showTraffic: !showTraffic })),
                                size: showTraffic ? "20px" : "22px",
                                style: {
                                    divProps: {
                                        paddingLeft: showTraffic ? "5px" : "0px"
                                    }
                                }
                            },
                            !showOneVehicle && {
                                icon: showGroups ? "groups" : "groups-closed",
                                tooltip: showGroups ? localizedStrings.ungroupVehicles : localizedStrings.groupVehicles,
                                onClick: () => dispatch(changeMapConfiguration({ showGroups: !showGroups }))
                            },
                            showOneVehicle && role_id !== VISUALIZER_ROLE_ID && {
                                icon: "route",
                                tooltip: localizedStrings.showRoutes,
                                as: "a",
                                href: window.location.origin + REPORT_ROUTES_PATH + "?vehicle_id=" + vehicleToShow?.vehicle?.id,
                            },
                            showListVehicles && {
                                icon: vehicleNamesVisibility ? "eye" : "eye-closed",
                                tooltip: vehicleNamesVisibility ? localizedStrings.hideNames : localizedStrings.showNames,
                                onClick: () => setVehicleNamesVisibility(!vehicleNamesVisibility),
                                size: vehicleNamesVisibility ? "16px" : "21px",
                                style: {
                                    divProps: {
                                        paddingLeft: vehicleNamesVisibility ? "0px" : "2.5px",
                                        paddingTop: vehicleNamesVisibility ? "0px" : "0.75px",
                                    }
                                }
                            },
                        ]} />
                }
            </MapControlsStyle>
        </>
    );
}
