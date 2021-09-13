// eslint-disable-next-line
import React, { useEffect } from "react";
// eslint-disable-next-line
import { useDispatch } from 'react-redux';
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import {  Col, Button, Text, DateInput, Select, Icon } from "components";
// eslint-disable-next-line
import { loadAllServiceLogistics } from "store/modules";
import { ExportLogisticsConfirmation } from './style';

export default function ExportLogisticsForm({ onCancel, onConfirm, setExportDate, exportDate, setSelectedExportLogistic, selectedExportLogistic, select_export_all_logistics,loadLoadingLSExportForm }) {
    // eslint-disable-next-line
    // const dispatch = useDispatch();

    // useEffect(() => {
      // dispatch(loadAllServiceLogistics());
      // eslint-disable-next-line
    // }, []);
  // eslint-disable-next-line
    // useEffect(() => {
    //     const has_select_export_all_logistics = Array.isArray(select_export_all_logistics) && select_export_all_logistics?.length > 0;
    //     if(has_select_export_all_logistics) {
          // eslint-disable-next-line
            // const [first_item ={}] = select_export_all_logistics;
            // setSelectedExportLogistic(first_item);
        // }
        // eslint-disable-next-line
    // }, [select_export_all_logistics]);

    const handleDate = (fields, data) => {
        const hasPeriod = data?.startDate && data?.endDate;
        if (hasPeriod) setExportDate([data?.startDate, data?.endDate]);
    }

    return (
      <ExportLogisticsConfirmation>
        <Row style={{ marginLeft: "0px", marginBottom: "24px" }}>
        <Col xl="12" xxl="12" style={{ display: "flex" }}>
          <Text
            fontFamily={"Roboto"}
            fontSize={"22px"}
            lineHeight={"26px"}
            color={"#222222"}
            fontWeight={"bold"}
          >
            {localizedStrings.logisticService.exportLogisticService}
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
      <Row>
          <Col xl="12" xxl="12">
          <DateInput
                type={'dateRangePicker'}
                isMulti={true}
                label={localizedStrings.selectPeriod}
                onChange={handleDate}
                name={"logisticDate"}
                id={"logisticDate"}
                monthDefault={true}
                placeholder={"dd/mm/aaaa"}
                value={exportDate}
                divStyles={{width: "20rem"}}
            />
          </Col>
      </Row>
      <Row>
          <Col xl="12" xxl="12">
            <Select 
                title={localizedStrings.logisticService.selectOneLogisticService}
                required={true}
                loading={loadLoadingLSExportForm}
                options={select_export_all_logistics}
                onChange={(item) => {
                    setSelectedExportLogistic(item);
                }}
                value={selectedExportLogistic || {}}
            />
          </Col>
      </Row>
      <Row>
          <Col xl="12" md="12" style={{paddingRight: "66px"}}>
                <Button 
                    title={localizedStrings.logisticService.exportLogisticService}
                    onClick={onConfirm}
                />
          </Col>
      </Row>
      </ExportLogisticsConfirmation>
  );
}