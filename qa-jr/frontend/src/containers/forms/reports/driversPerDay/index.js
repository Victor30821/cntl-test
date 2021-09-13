import React, { useState, useEffect } from 'react';
import { Card,
    CardForm,
    Col,
    PerPageSelector,
    Button,
    ButtonWithIcon,
    DateInput,
    ReportCard,
    Select,
    Modal,
    XLSXExport,
    Input,
    Text,
    DropdownView
} from 'components'
import { Row,  Nav, NavItem } from "reactstrap";
import { localizedStrings } from '../../../../constants/localizedStrings';
import { useSelector } from "react-redux";

import ExportXLSX from '../../../../exports/xlsx/xlsx-report.export-drive-per-day';

export default function ReportsDriversPerDayForm({
    onSubmit,
    inputsConfig,
    summary,
    formId,
    filters,
    reduxDrivers,
    setSelectedDrivers,
    selectedDrivers,
    maxLengthOfList,
    listLengths,
    perPageSelect,
    totalRegisters,
    organizationId,
    inicialNightPeriod,
    setInicialNightPeriod,
    endNightPeriod,
    setEndNightPeriod,
}) {
    const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({ notFound: false, success: false });
    const [docXlsx, setDocXlsx] = useState([]);
    const [openXLSXModal, setOpenXLSXModal] = useState(false);
    const [driverDropdown, setDriverDropdown] = useState({});
    const [oneDriverSelected, setOneDriverSelected] = useState(false);
    const [selectedDriverInfo, setSelectedDriverInfo] = useState({});

    const {
      user: {
        user_settings: { distance_unit },
      },
    } = useSelector((state) => state.auth);

    const handleDate = (fields, data) => {
        filters.period.start_date = data.startDate;
        filters.period.end_date = data.endDate;
        inputsConfig.setFilters({...filters});
    }

    const handleDriver = (fields, data) => {
        if(!data.option) return setSelectedDrivers([]);
        setSelectedDrivers([data.option]);
    };

    const XLSXexportJSX = () => {
        return (
            <XLSXExport
                document={docXlsx}
                fileName={`motoristas-por-dia-${filters.period?.start_date}`}
                successStatus={statusSuccessXLSX.success} 
            />
        )
    };

    const exportReport = (type) => {
        const typeExport = {
            xlsx: () => {
                setOpenXLSXModal(openXLSXModal => openXLSXModal = true)
                setStatusSuccessXLSX({ success: false });
                ExportXLSX({
                    setStatusSuccessXLSX,
                    setDocXlsx,
                    organizationId,
                    filters,
                    distance_unit
                });
            }
        }
        return typeExport[type]();
    };

    useEffect(() => {
        const onlyOneDriver = (
            Array.isArray(selectedDrivers) && 
            selectedDrivers?.length > 0 && 
            selectedDrivers?.length <= 1
        );
        setOneDriverSelected(onlyOneDriver);

        const driverInfo = reduxDrivers?.drivers?.find(driver => driver.id === selectedDrivers?.[0]?.value) || {};
        setSelectedDriverInfo(driverInfo);
        // eslint-disable-next-line
    }, [selectedDrivers]);

    useEffect(() => {
        const driverData = {
            [localizedStrings.nameOfDriver]: {
                type: 'text',
                value: selectedDriverInfo?.nickname || selectedDriverInfo?.name
            },
            [localizedStrings.reportsExport.CNH]: {
                type: 'text',
                value: selectedDriverInfo?.driver_license,
            },
            [localizedStrings.reportsExport.CNHExpirationDate]: {
                type: 'date',
                value: selectedDriverInfo?.expire_driver_license,
            },
            [localizedStrings.phone]: {
                type: 'link',
                value: selectedDriverInfo?.phone,
                link: "https://api.whatsapp.com/send?phone=" + selectedDriverInfo?.phone
            },
            [localizedStrings.codeId]: {
                type: 'text',
                value: selectedDriverInfo?.code,
            },
        };
        setDriverDropdown(driverData);
    }, [selectedDriverInfo]);

    return (
        <>
        <Card >
            <CardForm id={formId} onSubmit={onSubmit} style={{ padding: "0px", paddingTop: "12px" }}>
                <Row>
                <Modal
                    open={openXLSXModal}
                    setOpen={setOpenXLSXModal}
                    header={XLSXexportJSX()} />
                    <Col md="4" className="md-4">
                        <Select
                            isMulti={true}
                            error={reduxDrivers.loadFail}
                            loading={reduxDrivers.loadLoading}
                            title={localizedStrings.selectADriver}
                            value={selectedDrivers}
                            placeholder={localizedStrings.selectADriver}
                            options={reduxDrivers.drivers?.map(driver => {
                                return {
                                    label: driver.name,
                                    value: driver.id
                                }
                            })}
                            onChange={handleDriver}
                        />
                    </Col>
                    <Col md="4" className="md-4">
                        <DateInput
                            type={'dateRangePicker'}
                            register={inputsConfig.register}
                            isMulti={true}
                            label={localizedStrings.selectPeriod}
                            onChange={handleDate}
                            name={"driverPerDayDate"}
                            id={"driverPerDayDate"}
                            width="50%"
                            placeholder={"dd/mm/aaaa"}
                            value={new Date()}
                        />
                    </Col>
                    <Col md="4" className="md-4">
                        <Nav style={{ float: "right", marginTop: "18px" }}>
                            <NavItem>
                                <ButtonWithIcon
                                    icon={"list"}
                                    title={localizedStrings.generateReport}
                                    onClick={e => {
                                        onSubmit();
                                    }}
                                />
                            </NavItem>
                        </Nav>
                    </Col>
                </Row>
            </CardForm>
        </Card>
        {totalRegisters > 0 && (<>
            <Card>
                <div style={{ padding: "16px" }}>
                    <Row>
                        <Col xl="3" xxl="2">
                            <Text
                                marginTop={"12px"}
                            >
                                {localizedStrings.startNightTime}
                            </Text>
                            <Input
                                marginTop="5px"
                                defaultValue={inicialNightPeriod}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                type={"time"}
                                onChange={event => setInicialNightPeriod(event.target.value)}
                            />
                        </Col>
                        <Col xl="3" xxl="2">
                            <Text
                                marginTop={"12px"}
                            >
                                {localizedStrings.endNightTime}
                            </Text>
                            <Input
                                marginTop="5px"
                                defaultValue={endNightPeriod}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                type={"time"}
                                onChange={event => setEndNightPeriod(event.target.value)}
                            />
                        </Col>
                        <Col xl="3" xxl="2">
                            {oneDriverSelected &&
                                <DropdownView
                                    style={{ marginTop: '35px' }}
                                    title={localizedStrings.driverDetails}
                                    data={driverDropdown}
                                />
                            }
                        </Col>
                        <Col xl="3" xxl="6">
                            <Nav style={{ float: "right", marginTop: "35px" }}>
                                <NavItem>
                                    <Button
                                        hasIcon={true}
                                        onClick={() => exportReport('xlsx')}
                                        iconConfig={{
                                            icon : "xlsx",
                                            width: "15px",
                                            color: "#192379"
                                        }}
                                        backgroundColor="#fff"
                                        border="1px solid #E5E5E5"
                                        width="41px"
                                        height="37px"
                                        minWidth="41px"
                                        padding="0"
                                        marginLeft="5px"
                                        hover={{
                                            backgroundColor: "#F5F5FF"
                                        }}
                                        as={"a"}
                                    >
                                    </Button>
                                </NavItem>
                                <NavItem>
                                    <PerPageSelector
                                        styleDiv={{ height: "100%", marginLeft: "5px" }}
                                        maxLengthOfList={maxLengthOfList}
                                            listLengths={listLengths}
                                        onClose={index =>
                                            maxLengthOfList !== listLengths[index] &&
                                            perPageSelect(listLengths[index])
                                        }
                                        hover={{
                                            backgroundColor: "#F5F5FF"
                                        }}
                                    />
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>
                </div>
            </Card>
                <Nav style={{ margin: "25px" }}>
                    <NavItem style={{ marginRight: "2%", width: "18.5%" }}>
                        <ReportCard
                            title={localizedStrings.totalConductionHours}
                            value={summary.total_time}
                            icon={"clock"}
                            type={"duration"}
                        />
                    </NavItem>
                    <NavItem style={{ marginRight: "2%", width: "18.5%" }}>
                        <ReportCard
                            title={localizedStrings.totalDistance}
                            value={summary.total_distance}
                            icon={"road"}
                            type={"distance"}
                        />
                    </NavItem>
                    <NavItem style={{ marginRight: "2%", width: "18.5%" }}>
                        <ReportCard
                            title={localizedStrings.totalNightHours}
                            value={summary.total_night_hours}
                            icon={"clock"}
                            type={"hours"}
                        />
                    </NavItem>
                    <NavItem style={{ marginRight: "2%", width: "18.5%" }}>
                        <ReportCard
                            title={localizedStrings.greaterContinuousDriving}
                            value={summary.longest_driving_route_time}
                            icon={"clock"}
                            type={"hours"}
                        />
                    </NavItem>
                    <NavItem style={{ width: "18%" }}>
                        <ReportCard
                            title={localizedStrings.maxSpeedShort}
                            value={
                                summary.max_speed === 0
                                    ? 0
                                    : summary.max_speed
                            }
                            icon={"tachometer"}
                            type={"velocity"}
                        />
                    </NavItem>
                </Nav>
            </>)}
    </>
    );
}
