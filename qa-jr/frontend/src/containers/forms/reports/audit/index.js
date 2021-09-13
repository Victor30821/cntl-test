import React, { useState } from 'react';
import {
    Card,
    CardForm,
    Col,
    Checkbox,
    ButtonWithIcon,
    DateInput,
    Icon,
    Select,
    Text,
    Modal
} from 'components'
import { Row } from "reactstrap";
import { localizedStrings } from 'constants/localizedStrings'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SendEmailForm } from "containers/forms";

export default function ReportsAuditForm({ onSubmit, inputsConfig, filters, formId, reduxVehicles, reportAlready, createXLSX, sendEmail }) {

    const [openSendEmailForm, setopenSendEmailForm] = useState(false);

    const handleDate = (fields, data) => {
        if (!data.startDate || !data.endDate) return toast.error(localizedStrings.selectPeriodStartEnd);
        filters.period.start_date = data.startDate + " 00:00:00";
        filters.period.end_date = data.endDate + " 23:59:00";
        inputsConfig.setFilters({...filters});
    }

    const handleShowAddress = () => {
        filters.showAddress.isChecked = !filters.showAddress.isChecked;

        inputsConfig.setFilters({ ...filters })
    }

    const handleVehicle = (data) => {
        inputsConfig.setSelectedVehicles([data]);
    }

    const openModalSendEmail = () => setopenSendEmailForm(true)

    const onCancelSendEmailForm = () => setopenSendEmailForm(false)

    return (
        <>
            <Card >
                <Modal
                    width={"580px"}
                    height={"auto"}
                    open={openSendEmailForm}
                    setOpen={setopenSendEmailForm}
                    header={SendEmailForm({
                      onClick: sendEmail,
                      onCancel: onCancelSendEmailForm,
                      document: reportAlready?.document,
                      fileName: reportAlready?.fileName,
                      tabName:  reportAlready?.tabName
                    })}
                />
                <CardForm id={formId} style={{ padding: "0px", paddingTop: "12px" }}>
                    <Row>
                        <Col md="4" className="md-4">

                        <Select
                            isMulti={false}
                            error={reduxVehicles.loadFail}
                            loading={reduxVehicles.loadLoading}
                            title={localizedStrings.selectAVehicle}
                            value={reduxVehicles?.selectedVehicles}
                            placeholder={localizedStrings.selectAVehicle}
                            options={reduxVehicles?.vehicles?.map(vehicle => {
                                return {
                                    label: vehicle.name,
                                    value: vehicle.id
                                }
                            })}
                            onChange={(vehicle) => handleVehicle(vehicle)}
                            emptyStateText={localizedStrings.noVehicleCreated}
                        />

                    </Col>
                    <Col md="4" className="md-4">
                        <DateInput
                            register={inputsConfig.register}
                            isMulti={true}
                            type={"dateRangePicker"}
                            label={localizedStrings.selectPeriod}
                            onChange={handleDate}
                            name={"auditDate"}
                            id={"auditDate"}
                            width="50%"
                            placeholder={"dd/mm/aaaa"}
                            value={new Date()}
                        />
                    </Col>
                    <Col md="2" className="md-2">
                        <Checkbox
                            divOptions={{ marginTop: "30px" }}
                            checked={filters.showAddress.isChecked}
                            title={localizedStrings.includeAddresses}
                            register={inputsConfig.register}
                            onChange={handleShowAddress}
                        >
                        </Checkbox>
                    </Col>
                </Row>
            </CardForm>
        </Card>
        <ButtonWithIcon
            icon={"list"}
            title={localizedStrings.generateReport}
            onClick={onSubmit}
            marginRight={"5px"}
            marginLeft={"23px"}
        />
        <Row style={
            {
                width: "100%",
                height: "50%",
            }}
        >
            <div
                style={{
                    margin: "0 auto",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    transition: "opacity 0.5s",
                    opacity: reportAlready.already? 1 : 0
                }}
            >
                <Row>
                    <Col xl="12" xxl="12">
                        <Text
                            fontFamily={"Roboto"}
                            fontStyle={"normal"}
                            fontWeight={"bold"}
                            fontSize={"24px"}
                            lineHeight={"29px"}
                            textAlign={"center"}
                            letterSpacing={"0.1px"}
                            color={"#1DC9B7"}
                        >
                            <Icon icon={"check"} style={{ width: "10px", marginRight: "10px", verticalAlign: "3px" }}></Icon>{localizedStrings.yourReportIsReady}
                        </Text>
                    </Col>
                    <Col xl="12" xxl="12">
                        <Text
                            margin={"0 auto"}
                            fontFamily={"Roboto"}
                            fontStyle={"normal"}
                            fontWeight={"normal"}
                            fontSize={"18px"}
                            lineHeight={"150%"}
                            textAlign={"center"}
                            letterSpacing={"0.1px"}
                            color={"#838383"}
                        >
                            {localizedStrings.yourDownloadInitiateAutomaticate}
                            <Link
                                onClick={() => createXLSX({ 
                                    document: reportAlready?.document, 
                                    fileName: reportAlready?.fileName, 
                                    tabName:  reportAlready?.tabName 
                                })}
                                href={"#"}
                                style={{ color: "#192379" }}
                            >
                                {localizedStrings.clickHere.toLowerCase() + "."}
                            </Link>
                        </Text>
                    </Col>
                    <Col xl="12" xxl="12" style={{ display: "flex" }}>
                        <Link
                                onClick={() => openModalSendEmail()}
                                href={"#"}
                                style={{ color: "#192379",display: "block",
                                        fontFamily: "Roboto",
                                        margin: "0 auto",
                                        fontSize: "18px",
                                        lineHeight: "150%",
                                        fontWeight: "normal",
                                        marginRight: "2px", }}
                            >
                                {localizedStrings.clickHere.toLowerCase() + ", "}
                        </Link>
                        <Text
                            margin={"0 auto"}
                            marginLeft={"0px"}
                            fontFamily={"Roboto"}
                            fontStyle={"normal"}
                            fontWeight={"normal"}
                            fontSize={"18px"}
                            lineHeight={"150%"}
                            textAlign={"center"}
                            letterSpacing={"0.1px"}
                            color={"#838383"}
                        >
                            {localizedStrings.clickHereToSenByEmail}
                        </Text>
                    </Col>
                </Row>
            </div>
        </Row>
    </>
    );
}

