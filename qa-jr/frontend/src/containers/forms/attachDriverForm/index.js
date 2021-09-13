
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { loadDrivers, attachDriverToRoute } from "store/modules";
import { Select, Col, Text, Icon, Link, Button } from "components";
import { AttachDriverCreation } from "./style";
import { MAX_LIMIT_FOR_SELECTORS } from "constants/environment";
import { DRIVERS_CREATE_PATH } from "constants/paths.js";
import { format } from "date-fns";
import { convertUserMaskToDateFns } from "utils/convert";

const host = window.location.host;
const protocol = window.location.protocol;

export const btnAttachDriver = {
  display: "flex",
  background: "#192379",
  flexDirection: "row",
  cursor: "pointer",
  alignItems: "center",
  border: "1px solid #1A237A",
  borderRadius: "4px",
  minWidth: "109px",
  backgroundColor: "#192379",
  justifyContent: "flex-end",
  padding: "10px",
  width: "129px",
  height: "36px",
  marginTop: "23px",
  marginLeft: "14px",
};

export default function AttachDriverForm({ history, onCancel, routeSelected }) {
  const dispatch = useDispatch();

  const [list_drivers, setList_drivers] = useState([]);
  const [attach_drivers_selected, setAttach_drivers_selected] = useState([]);

  const { loadLoading, drivers } = useSelector((state) => state.drivers);
  const { attachLoading, attachSuccess } = useSelector(
    (state) => state.routesReports
  );

  const {
    user: {
      user_settings
    }
  } = useSelector(state => state.auth);

  const {
    short_date_format: dateFormat,
    short_time_format: timeFormat
  } = user_settings;

  const dateMaskFromConfiguration = convertUserMaskToDateFns({ mask: `${dateFormat}`, timeMask: `${timeFormat}` });

  useEffect(() => {
    dispatch(
      loadDrivers({ limit: MAX_LIMIT_FOR_SELECTORS, offset: 0, status: 1 })
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const has_drivers = Array.isArray(drivers) && drivers.length > 0;

    if (has_drivers) {
      const drivers_select = drivers.map((driver) => ({
        value: driver.id,
        label: driver.name,
        driver,
      }));
      setList_drivers(drivers_select);
    }
  }, [drivers]);

  useEffect(() => {
    if(attachSuccess) {
      onCancel();
    }
    // eslint-disable-next-line
  }, [attachSuccess]);

  const has_drivers_selected =
    Array.isArray(attach_drivers_selected) &&
    attach_drivers_selected?.length > 0;

  return (
    <AttachDriverCreation>
      <Row style={{ marginLeft: "0px", marginBottom: "24px" }}>
        <Col xl="12" xxl="12" style={{ display: "flex" }}>
          <Text
            fontFamily={"Roboto"}
            fontSize={"22px"}
            lineHeight={"26px"}
            color={"#222222"}
            fontWeight={"bold"}
          >
            {localizedStrings.attach_driver.attachDriverToRoute}
          </Text>
          <button
            onClick={onCancel}
            style={{ marginLeft: "auto", marginRight: "28px" }}
          >
            {
              <Icon
                icon={"plus"}
                width={"20px"}
                height={"15px"}
                color={"#1D1B84"}
                float={"right"}
                cursor="pointer"
                style={{
                  marginLeft: "13px",
                  display: "flex",
                  flexDirection: "row",
                  transform: "rotate(45deg)",
                }}
              />
            }
          </button>
        </Col>
      </Row>
      <hr style={{ width: "577px" }}></hr>
      <Row style={{ marginLeft: "0px" }}>
        <Col xxl="12" xl="12" style={{ display: "contents" }}>
          <div style={{ margin: "16px" }}>
            <Text
              style={{
                fontFamily: "Roboto",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: "15px",
                lineHeight: "18px",
                letterSpacing: "0.1px",
                color: "#444444",
              }}
            >
              {localizedStrings.attach_driver.date}
            </Text>
            <Text>
              {routeSelected?.date
                ? format(new Date(routeSelected?.date), dateMaskFromConfiguration)
                : ""}
            </Text>
          </div>
          <div
            style={{
              margin: "16px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "140px",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: "15px",
                lineHeight: "18px",
                letterSpacing: "0.1px",
                color: "#444444",
              }}
            >
              {localizedStrings.attach_driver.inicialAddress}
            </Text>
            <Text>{routeSelected?.address_start || ""}</Text>
          </div>
          <div
            style={{
              margin: "16px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "140px",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: "15px",
                lineHeight: "18px",
                letterSpacing: "0.1px",
                color: "#444444",
              }}
            >
              {localizedStrings.attach_driver.endAddress}
            </Text>
            <Text>{routeSelected?.address_end || ""}</Text>
          </div>
        </Col>
      </Row>
      <hr></hr>
      <Row style={{ marginLeft: "14px" }}>
        <Col xxl="12" xl="12" style={{ display: "contents" }}>
          <Select
            style={{maxWidth: "400px", maxHeight: "100px"}}
            title={localizedStrings.attach_driver.searchByDriver}
            options={list_drivers}
            placeholder={localizedStrings.attach_driver.addDriver}
            loading={loadLoading}
            onChange={(item) => {
              setAttach_drivers_selected(item);
            }}
            isMulti={true}
            value={attach_drivers_selected || []}
          />
          <Button
            style={{
              display: "flex",
              background:
                has_drivers_selected && !attachLoading
                  ? "#192379"
                  : "#B3B5C7",
              flexDirection: "row",
              cursor:
                has_drivers_selected && !attachLoading
                  ? "pointer"
                  : "not-allowed",
              alignItems: "center",
              border:
                has_drivers_selected && !attachLoading
                  ? "1px solid #1A237A"
                  : "1px solid #B3B5C7",
              borderRadius: "4px",
              minWidth: "109px",
              backgroundColor:
                has_drivers_selected && !attachLoading
                  ? "#192379"
                  : "#B3B5C7",
              justifyContent: "flex-end",
              padding: "10px",
              width: "129px",
              height: "36px",
              marginTop: "23px",
              marginLeft: "14px",
            }}
            title={localizedStrings.attach_driver.attachDriver}
            onClick={() =>
              has_drivers_selected &&
              !attachLoading &&
              dispatch(
                attachDriverToRoute({
                  driver_ids: attach_drivers_selected.map(
                    (attach) => attach.value
                  ),
                  route: routeSelected,
                })
              )
            }
            loading={attachLoading}
            type={"button"}
            hasIcon={false}
          />
        </Col>
      </Row>
      <Row style={{ marginLeft: "14px", marginTop: "24px" }}>
        <Col xxl="12" xl="12" style={{ display: "contents" }}>
          <Text
            style={{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "13px",
              lineHeight: "15px",
              letterSpacing: "0.1px",
              color: "#666666",
            }}
          >
            {localizedStrings.attach_driver.dontFindDriver}
          </Text>
          <Link
            style={{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "13px",
              lineHeight: "15px",
              letterSpacing: "0.1px",
              marginRight: "4px",
              marginLeft: "4px",
            }}
            target="_blank"
            href={`${protocol}//${host}${DRIVERS_CREATE_PATH}`}
          >
            {localizedStrings.attach_driver.clickHere}
          </Link>
          <Text
            style={{
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "13px",
              lineHeight: "15px",
              letterSpacing: "0.1px",
              color: "#666666",
            }}
          >
            {localizedStrings.attach_driver.toCreate}
          </Text>
        </Col>
      </Row>
    </AttachDriverCreation>
  );
}
