import React, { useState, useEffect } from "react";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {  Col,Text, } from "components";
import { DEFAULT_NULL_VALUE } from "constants/environment";

export default function Detail() {

  const {
    driver_day,
    selected,
    places,
  } = useSelector(state => state.logisticsServices);

  const {
    overview_selected: {
      hour_going_selected,
      type_selected
    }
  } = selected;
  
  return (
    <>
      <Row>
        <Col xl="4" xxl="4">
          <Text style={{font: "normal normal medium 12px/16px Roboto", color: "#767676", letterSpacing: "0.1px", whiteSpace: "normal"}}>{localizedStrings.logisticService.driver}</Text>
          <Text style={{ font: "normal normal normal 14px/19px Roboto", color: "#1A237A", letterSpacing: "0.11px", whiteSpace: "normal" }}>{driver_day?.name || DEFAULT_NULL_VALUE}</Text>
        </Col>
        { type_selected &&
          <Col xl="4" xxl="4">
            <Text style={{font: "normal normal medium 12px/16px Roboto", color: "#767676", letterSpacing: "0.1px", whiteSpace: "normal"}}>{localizedStrings.logisticService.expectedOutward}</Text>
          <Text style={{ font: "normal normal normal 14px/19px Roboto", color: "#444444", letterSpacing: "0.11px", whiteSpace: "normal" }}>{hour_going_selected?.value ? hour_going_selected?.value + 'h' : DEFAULT_NULL_VALUE}</Text>
          </Col>
        }
        {
          !type_selected &&
          <Col xl="4" xxl="4">
            <Text style={{font: "normal normal medium 12px/16px Roboto", color: "#767676", letterSpacing: "0.1px", whiteSpace: "normal"}}>{localizedStrings.logisticService.expectedTurn}</Text>
            <Text style={{ font: "normal normal normal 14px/19px Roboto", color: "#444444", letterSpacing: "0.11px", whiteSpace: "normal" }}>{hour_going_selected?.value ? hour_going_selected?.value + 'h' : DEFAULT_NULL_VALUE}</Text>
          </Col>
        }
     </Row>
     <hr></hr>
     {
      places?.length > 0 &&
      places.map(place => {
        return(
          <>
          <Row>
        <Col xl="4" xxl="4">
          <Text style={{font: "normal normal medium 12px/16px Roboto", color: "#767676", letterSpacing: "0.1px", whiteSpace: "normal"}}>{localizedStrings.logisticService.name}</Text>
                <Text style={{ font: "normal normal normal 14px/19px Roboto", color: "#444444", letterSpacing: "0.11px", whiteSpace: "normal" }}>{place?.name ? place?.name : DEFAULT_NULL_VALUE}</Text>
        </Col>
        <Col xl="8" xxl="8">
          <Text style={{font: "normal normal medium 12px/16px Roboto", color: "#767676", letterSpacing: "0.1px", whiteSpace: "normal"}}>{localizedStrings.logisticService.status}</Text>
          <Text style={{font: "normal normal normal 14px/19px Roboto", color: "#444444", letterSpacing: "0.11px", whiteSpace: "normal"}}>Não embarcou</Text>
        </Col>
        </Row>
        <Row>
            { type_selected &&
            <Col xl="4" xxl="4">
              <Text style={{font: "normal normal medium 12px/16px Roboto", color: "#767676", letterSpacing: "0.1px", whiteSpace: "normal"}}>{localizedStrings.logisticService.hour_departure}</Text>
                <Text style={{ font: "normal normal normal 14px/19px Roboto", color: "#444444", letterSpacing: "0.11px", whiteSpace: "normal" }}>{place?.duration_between_points || DEFAULT_NULL_VALUE}</Text>
            </Col>
            }            
            { !type_selected &&
            <Col xl="8" xxl="8">
              <Text style={{font: "normal normal medium 12px/16px Roboto", color: "#767676", letterSpacing: "0.1px", whiteSpace: "normal"}}>{localizedStrings.logisticService.hour_return}</Text>
                <Text style={{ font: "normal normal normal 14px/19px Roboto", color: "#444444", letterSpacing: "0.11px", whiteSpace: "normal" }}>{place?.duration_between_points || DEFAULT_NULL_VALUE}</Text>
            </Col>
            }
        </Row>
        <hr></hr>
          </>
        )
      })
     }
     {
        places?.length === 0 &&
        <Text style={{textAlign: "center"}}>{localizedStrings.logisticService.noStopsConfigured}</Text>
     }
    </>
  );
}