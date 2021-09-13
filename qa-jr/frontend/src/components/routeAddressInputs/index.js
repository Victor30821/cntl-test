import React, { useState, useEffect } from 'react'
import { CardInput, Icon, Modal, ShareRouteModal, ShareRouteModalAppConfirmation } from 'components'
import { localizedStrings } from 'constants/localizedStrings'
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { AddressRow } from './style';
import {
    searchAddressToRoute, searchVehicleAddress,
} from 'store/modules'
export default function RouteAddressInputs({
    setValue,
    register,
    getValues,
    share,
    setShare,
    onShare,
}) {
    const [appConfirmationModal, setAppShareConfirmation] = useState(false)
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const {
        vehicleAddress,
        route,
        vehicleToShow,
    } = useSelector(states => states.map);

    const onWaypointChange = ({
        text
    }) => {

        inputRef?.current && clearTimeout(inputRef.current);

        inputRef.current = setTimeout(() => {
            dispatch(searchAddressToRoute({
                text, route,
                showRoute: true
            }));
        }, 1000)
    };

    const setStartWaypoint = () => {
        if (!vehicleAddress?.formattedAddress) return dispatch(searchVehicleAddress(vehicleToShow));
        setValue("waipointStart", vehicleAddress?.formattedAddress);
    };

    useEffect(() => {
        setStartWaypoint()
        // eslint-disable-next-line
    }, [vehicleAddress?.formattedAddress]);

    const setFormattedAddresses = () => {
        const [endAddress] = route.addresses

        let address = endAddress;

        if (typeof endAddress === 'object') address = endAddress?.formattedAddress;

        setValue("waypointEnd", address);

    };

    useEffect(() => {

        if (route?.addresses?.length) setFormattedAddresses()
        // eslint-disable-next-line
    }, [route?.addresses]);

    return (
        <div style={{
            padding: "12px 15px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
        }}>
            <Modal
                open={share}
                setOpen={setShare}
                header={
                    <ShareRouteModal
                        setShare={setShare}
                        onShare={onShare}
                        setAppShareConfirmation={setAppShareConfirmation}
                    />
                } />
            <Modal
                open={appConfirmationModal}
                setOpen={setAppShareConfirmation}
                header={
                    <ShareRouteModalAppConfirmation
                        onShare={onShare}
                        setAppShareConfirmation={setAppShareConfirmation}
                    />
                } />
            <CardInput
                onChange={(field, value) => {
                    setValue(field, value);
                    onWaypointChange({
                        text: value
                    })
                }}
                register={register}
                width="100%"
                margin={"10px 0px 10px 0px"}
                inputs={[
                    {
                        name: "waipointStart",
                        type: "text",
                        placeholder: localizedStrings.writeOdometer,
                        defaultValue: getValues()?.["waipointStart"],
                        style: {
                            flex: "1",
                        },
                        readOnly: true,
                    },
                ]}
            />
            <Icon
                icon={"arrow-down-slim"}
                color={"#6C757D"}
                width={"16px"}
                height={"30px"}
                divProps={{
                    position: "relative",
                    height: "27px",
                    "& > svg": {
                        position: "absolute",
                        left: "-4px",
                    }
                }}
            />
            <AddressRow >
                <CardInput
                    onChange={(field, value) => {
                        setValue(field, value);
                        onWaypointChange({
                            text: value
                        })
                    }}
                    register={register}
                    width="100%"
                    margin={"10px 0px 10px 0px"}
                    inputs={[
                        {
                            name: "waypointEnd",
                            type: "text",
                            defaultValue: getValues()?.waypointEnd,
                            style: {
                                flex: "1",
                            },
                        },
                    ]}
                />

                {/* <Icon
                    icon={"minus"}
                    color={"#1D1B84"}
                    width={"6px"}
                    height={"16px"}
                    divProps={{
                        padding: "5px 0px 0 0",
                        width: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        onClick: () => removeWaypoint(waypointIndex),
                    }}

                /> */}
            </AddressRow>
            {/* {
                waypointIndex !== waypoints?.length - 1 &&

                <Icon
                    icon={"arrow-up-and-down-slim"}
                    marginRight={"5px"}
                    color={"#1D1B84"}
                    width={"16px"}
                    height={"30px"}
                    onClick={() => changeAddressesOrder({ waypointIndex })}
                    divProps={{
                        position: "relative",
                        height: "27px",
                        cursor: "pointer",
                        "& > svg": {
                            position: "absolute",
                            left: "-4px",
                            cursor: "pointer",
                        }
                    }}
                />
            } */}
            {/* <Link
                display="flex"
                flexDirection="row"
                cursor="pointer"
                justifyContent="center"
                alignItems="center"
                padding="13px"
                marginTop="5px"
                onClick={addWaypoint}
                href={"#"}
                borderRadius={"4px"}
                textDecoration={"none"}
                hover={{
                    background: "#E2E3EF",
                    textDecoration: "none",
                }}
            >
                <Icon
                    icon={"plus"}
                    color={"#1D1B84"}
                    width={"9px"}
                    height={"9px"}
                    divProps={{
                        marginRight: "5px"
                    }}
                />
                <Text color={"#1D1B84"} fontSize={"14px"}>Adicionar</Text>
            </Link> */}
        </div>
    )
}
