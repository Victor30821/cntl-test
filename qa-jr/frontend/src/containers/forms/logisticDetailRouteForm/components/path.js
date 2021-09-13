import React from "react";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { useSelector } from "react-redux";
import { Col, Text, Pin } from "components";
import { FlexColumn, FlexRow, SpaceBetweenItens, FlexColumnLast } from '../style';
import { DEFAULT_NULL_VALUE } from "constants/environment";


export default function Path({ setStatePeriod }) {

    const {
        selected,
        places,
        driver_day,
    } = useSelector(state => state.logisticsServices);

    const {
        overview_selected: {
            type_selected,
        }
    } = selected;

    return (
        <>
            <Row>
                <Col xl="6" xxl="6">
                    <Text color="#1A237A" >
                        {localizedStrings.logisticService.totalStops}{places?.length > 0 ? places?.length : DEFAULT_NULL_VALUE}
                    </Text>
                </Col>
                <Col xl="6" xxl="6">
                    <Text font="normal normal medium 12px/16px Roboto" color="#767676" letterSpacing="0.1px" whiteSpace="normal" >
                        {localizedStrings.logisticService.driver}
                    </Text>
                </Col>
            </Row>
            <Row>
                <Col xl="6" xxl="6">
                    <Text font="normal normal bold 13px/18px Roboto" color="#444444" letterSpacing="0.1px" >
                        {!type_selected ? localizedStrings.logisticService.pathBack + (selected?.overview_selected?.hour_going_selected?.label || DEFAULT_NULL_VALUE) : localizedStrings.logisticService.pathIniciate + (selected?.overview_selected?.hour_going_selected?.label || DEFAULT_NULL_VALUE)}
                    </Text>
                </Col>
                <Col xl="6" xxl="6">
                    <Text font="normal normal normal 14px/19px Roboto" color="#1A237A" letterSpacing="0.11px" whiteSpace="normal">
                        {driver_day?.name || DEFAULT_NULL_VALUE}
                    </Text>
                </Col>
            </Row>
            <hr></hr>
            {
                Array.isArray(places) &&
                places?.length > 0 &&
                places?.map((place, index) => {

                    const has_addresses = Array.isArray(place?.place?.addresses) && place?.place?.addresses?.length > 0;

                    let completeAdress = "";

                    if (has_addresses) {

                        const { place: { addresses = [] } } = place;

                        const [address = {}] = addresses;

                        completeAdress = address?.address1 + " " + address?.number;

                    }

                    return (
                        <>
                            <Row>
                                <Col xl="12" xxl="12" style={{ display: "flex", flexDirection: "row" }}>
                                    <FlexRow>
                                        <Text marginRight="4px" font="normal normal medium 12px/16px Roboto" letterSpacing="0.1px" color="#767676" whiteSpace="normal"  >
                                            {index + 1}º
                                            </Text>
                                        <Pin iconOptions={{ marginLeft: "6px", top: "3px" }} borderColor={place?.border_color !== undefined ? place.border_color : "#FAA628"} position={"relative"} icon={"female_solid"} width={"28px"} height="28px" optionsWrapper={{ marginBottom: "auto", marginRight: "12px" }} optionsIcons={{ width: "14px", height: "14px", }} cursor={"default"} />
                                    </FlexRow>
                                    <FlexColumn flex={"1"}>
                                        <FlexColumn>
                                            <Text font="normal normal medium 12px/16px Roboto" letterSpacing="0.1px" color="#767676" whiteSpace="normal" >
                                                {
                                                    place.type === 'in'
                                                        ? localizedStrings.logisticService.boarding
                                                        : localizedStrings.logisticService.landing
                                                }
                                            </Text>
                                            <Text font="normal normal medium 14px/19px Roboto" letterSpacing="0.11px" color="#444444" whiteSpace="normal" >
                                                {completeAdress || DEFAULT_NULL_VALUE}
                                            </Text>
                                        </FlexColumn>
                                        <FlexColumnLast>
                                            <Text font="normal normal medium 12px/16px Roboto" letterSpacing="0.1px" color="#767676" whiteSpace="normal" >
                                                {localizedStrings.logisticService.name}
                                            </Text>
                                            <Text font="normal normal medium 14px/19px Roboto" letterSpacing="0.11px" color="#444444" whiteSpace="normal" >
                                                {place?.name ? place?.name : DEFAULT_NULL_VALUE}
                                            </Text>
                                        </FlexColumnLast>
                                    </FlexColumn>
                                    <FlexRow flex={"1"}>
                                        <FlexColumn>
                                            <Text font="normal normal medium 12px/16px Roboto" letterSpacing="0.1px" color="#767676" whiteSpace="normal" >
                                                {
                                                    place.type === 'in'
                                                        ? localizedStrings.logisticService.hourBoarding
                                                        : localizedStrings.logisticService.hourLanding
                                                }
                                            </Text>
                                            <Text font="normal normal medium 14px/19px Roboto" letterSpacing="0.1px" color="#444444" whiteSpace="normal" >
                                                {place?.duration_between_points || DEFAULT_NULL_VALUE}
                                            </Text>
                                        </FlexColumn>
                                    </FlexRow>
                                </Col>
                            </Row>
                            <SpaceBetweenItens />
                        </>)
                })
            }
            {
                places?.length === 0 &&
                <Text textAlign="center" >{localizedStrings.logisticService.noStopsConfigured}</Text>
            }
        </>
    );
}