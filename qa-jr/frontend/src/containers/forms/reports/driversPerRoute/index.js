import React, { useState, useEffect } from 'react';
import {
    Card,
    CardForm,
    Col,
    Checkbox,
    PerPageSelector,
    Button,
    ButtonWithIcon,
    DateInput,
    ReportCard,
    Select,
    Modal,
    XLSXExport,
    Icon,
    Text,
    FilterInput,
    DropdownView
} from 'components';
import { Row, Nav, NavItem } from "reactstrap";
import { localizedStrings } from 'constants/localizedStrings';
import { useSelector } from 'react-redux';
import { MAP_ROUTES_PATH } from 'constants/paths';
import ExportXLSX from '../../../../exports/xlsx/xlsx-report.export-drive-per-route';
import { setUrlParam , getUrlParam } from "utils/params";

const vehicleRouteOnMapButtonStyle = {
    width: "auto",
    display: "flex",
    background: "#192379",
    flexDirection: "row",
    cursor: "pointer",
    alignItems: "center",
    border: "1px solid #1A237A",
    borderRadius: "4px",
    minWidth: "130px",
    backgroundColor: "#192379",
    justifyContent: "flex-end",
    padding: "10px",
}
export default function ReportsDriversPerRouteForm({
    filterText,
    setFilterText,
    history,
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
    page,
    perPage,
    organizationId
}) {
    const {
        user: { user_settings }
    } = useSelector(state => state.auth);

    const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({ notFound: false, success: false });
    const [docXlsx, setDocXlsx] = useState([]);
    const [openXLSXModal, setOpenXLSXModal] = useState(false);
    const [driverDropdown, setDriverDropdown] = useState({});
    const [oneDriverSelected, setOneDriverSelected] = useState(false);
    const [selectedDriverInfo, setSelectedDriverInfo] = useState({});

    const handleDate = (fields, data) => {
        filters.period.start_date = data.startDate;
        filters.period.end_date = data.endDate;
        inputsConfig.setFilters({ ...filters });
    }

    const handleShowAddress = () => {
        if (filters.showAddress.isChecked === false) {
            filters.showAddress.isChecked = true;
        } else {
            filters.showAddress.isChecked = false;
        }

        inputsConfig.setFilters({ ...filters });
    }

    const handleDriver = (fields, data) => {
        if (!data.option) return setSelectedDrivers([]);
        setSelectedDrivers([data.option]);
    }

    const {
        driversPerRoute
    } = useSelector(state => state.driversPerRouteReports);

    const getRegistersByOffSet = (orderedData) => {
        const data = [],
            totalRegisters = orderedData.length,
            offset = totalRegisters - (totalRegisters - ((page - 1) * perPage));

        for (let i = offset; i < (offset + perPage); i++) {
            let hasRegister = orderedData[i] && orderedData?.[i]?.file_route_id;
            if (hasRegister) {
                data.push(orderedData[i]);
            }
            else {
                break;
            }
        }

        return data;
    }

    let registers = [];

    const tableData = () => {
        const orderedData = driversPerRoute.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
        registers = getRegistersByOffSet(orderedData);

        return registers;
    }

    const handleShowDriversPerRoute = () => history.push(MAP_ROUTES_PATH, { routes: tableData() })

    const XLSXexportJSX = () => {
        return (
            <XLSXExport
                document={docXlsx}
                fileName={`relatorio-motoristas-por-rota-${filters.period?.start_date}`}
                successStatus={statusSuccessXLSX.success} />
        )
    };

    const exportReport = (type) => {
        const typeExport = {
            xlsx: () => {
                setOpenXLSXModal(openXLSXModal => openXLSXModal = true)
                setStatusSuccessXLSX({ success: false });
                ExportXLSX({
                    user_settings,
                    setStatusSuccessXLSX,
                    setDocXlsx,
                    organizationId,
                    filters
                });
            }
        }
        return typeExport[type]();
    };

    const inputTimeout = React.useRef(null);
    const searchTerm = term => {
        setUrlParam("search", term);
        setFilterText(term);
    };

    const onFilterInputChange = (nameToFilter = false, isUrlParam = false) => {
        nameToFilter = nameToFilter ? nameToFilter.toLowerCase() : "";
        inputTimeout?.current && clearTimeout(inputTimeout.current);
        inputTimeout.current = setTimeout(() => {
            searchTerm(nameToFilter || "");
        }, 1000);
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
                <Modal
                    open={openXLSXModal}
                    setOpen={setOpenXLSXModal}
                    header={XLSXexportJSX()} />
                <CardForm id={formId} style={{ padding: "0px", paddingTop: "12px" }}>
                    <Row>
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
                                name={"registerDate"}
                                id={"registerDate"}
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
                                            setUrlParam('sortBy', "start_date");
                                            setUrlParam('sortDirection', "DESC");
                                            onSubmit({sort: "start_date:desc"});
                                        }}
                                    />
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>
                </CardForm>
            </Card>
            {totalRegisters > 0 && (
                <>
                    <Card>
                        <div style={{ padding: "16px" }}>
                            <Row style={{ height: "36px" }}>
                                <Col xl="7" xxl="7" style={{ marginBottom: 0, display: 'flex' }}>
                                    <Col xl="5" xxl="5">
                                        <FilterInput
                                            width={'100%'}
                                            height={'36px'}
                                            marginLeft={"0px"}
                                            defaultValue={getUrlParam("search")}
                                            placeholder={localizedStrings.searchByKey}
                                            onChange={onFilterInputChange} />
                                    </Col>
                                    <Col xl="3" xxl="3">
                                        <Checkbox
                                            divOptions={{ marginTop: '5px' }}
                                            checked={filters.showAddress.isChecked}
                                            title={localizedStrings.showAddresses}
                                            register={inputsConfig.register}
                                            onChange={handleShowAddress}
                                        >
                                        </Checkbox>
                                    </Col>
                                    <Col xl="4" xxl="4">
                                        {oneDriverSelected &&
                                            <DropdownView
                                                style={{minWidth: '180px'}}
                                                title={localizedStrings.driverDetails}
                                                data={driverDropdown}
                                            />
                                        }
                                    </Col>
                                </Col>
                                <Col xl="5" xxl="5">
                                    <Nav style={{ float: "right" }}>
                                        <NavItem>
                                            <button
                                                style={vehicleRouteOnMapButtonStyle}
                                                onClick={() => handleShowDriversPerRoute()}
                                            >
                                                <Icon icon={"location"} width={'16px'} height={'16px'} color='#fff' divProps={{ margin: "0px 5px" }} />
                                                <Text color={"#fff"} fontSize={"14px"} >
                                                    {localizedStrings.showAllRoutesOnMap}
                                                </Text>
                                            </button>
                                        </NavItem>
                                        <NavItem>
                                            <Button
                                                hasIcon={true}
                                                onClick={() => exportReport('xlsx')}
                                                iconConfig={{
                                                    icon: "xlsx",
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
                                            />
                                        </NavItem>
                                    </Nav>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Nav style={{ margin: "25px" }}>
                        <NavItem style={{ marginRight: "2%", width: "32%" }}>
                            <ReportCard
                                title={localizedStrings.totalTimeOn}
                                value={summary.total_time}
                                icon={"clock"}
                                type={"hours"}
                            />
                        </NavItem>
                        <NavItem style={{ marginRight: "2%", width: "32%" }}>
                            <ReportCard
                                title={localizedStrings.travelledDistance}
                                value={summary.total_distance}
                                icon={"road"}
                                type={"distance"}
                            />
                        </NavItem>
                        <NavItem style={{ width: "32%" }}>
                            <ReportCard
                                title={localizedStrings.maxSpeed}
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
                </>
            )}
        </>
    );
}

