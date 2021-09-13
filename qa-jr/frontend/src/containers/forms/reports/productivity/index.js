import React,{ useState } from 'react';
import {
    Card,
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
    FilterInput
} from 'components';
import { Row,  Nav, NavItem } from 'reactstrap';
import { localizedStrings } from 'constants/localizedStrings';
import { getUrlParam, setUrlParam } from "utils/params";
import ExportXLSX from '../../../../exports/xlsx/xlsx-report.export-productivity';
import { useSelector } from 'react-redux';

export default function ReportsProductivityForm({
    setFilterText,
    filterText,
    onSubmit,
    reduxVehicles,
    inputsConfig,
    summary,
    formId,
    filters,
    maxLengthOfList,
    listLengths,
    perPageSelect,
    totalRegisters,
    organizationId
    }) {

    const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({ notFound: false, success: false });
    const [docXlsx, setDocXlsx] = useState([]);
    const [openXLSXModal, setOpenXLSXModal] = useState(false);

	const {
        user: {
            user_settings
        }
    } = useSelector(state => state.auth);

    const handleDate = (fields, data) => {
        filters.period.start_date = data.startDate;
        filters.period.end_date = data.endDate;
        inputsConfig.setFilters({...filters});
    }

    const handleVehicle = (data) => {
        reduxVehicles.setSelectedVehicles([data]);
    }

    const XLSXexportJSX = () => {
        return (
            <XLSXExport
                document={docXlsx}
                fileName={`relatorio-produtividade-${filters.period?.start_date}`}
                successStatus={statusSuccessXLSX.success} />
        )
    };

    const exportReport = (type) => {
        const typeExport = {
            pdf: () => {},
            xlsx: () => {
                setOpenXLSXModal(openXLSXModal => openXLSXModal = true)
                setStatusSuccessXLSX({ success: false });
                ExportXLSX({
                    setStatusSuccessXLSX,
                    setDocXlsx,
                    organizationId,
                    filters,
					timezone: user_settings?.timezone
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

    return (
        <>
        <Card >
            <Modal
                open={openXLSXModal}
                setOpen={setOpenXLSXModal}
                header={XLSXexportJSX()} />
            <CardForm id={formId} onSubmit={onSubmit} style={{ padding: "0px", paddingTop: "12px" }}>
                <Row>
                    <Col md="4" className="md-4">
                        <Select
                            isMulti={false}
                            error={reduxVehicles.loadFail}
                            placeholder={localizedStrings.selectAVehicle}
                            loading={reduxVehicles.loadLoading}
                            title={localizedStrings.selectAVehicle}
                            value={reduxVehicles.selectedVehicles}
                            options={reduxVehicles.vehicles?.map(vehicle => {
                                return {
                                    label: vehicle.name,
                                    value: vehicle.id
                                }
                            })}
                            emptyStateText={localizedStrings.noVehicleCreated}
                            onChange={(vehicle) => handleVehicle(vehicle)}
                        />
                    </Col>
                    <Col md="4" className="md-4">
                        <DateInput
                            type={'dateRangePicker'}
                            register={inputsConfig.register}
                            isMulti={true}
                            label={localizedStrings.selectPeriod}
                            onChange={handleDate}
                            name={"fuelDate"}
                            id={"fuelDate"}
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
        {totalRegisters > 0 && (
        <>
            <Card>
                <div style={{ padding: "16px" }}>
                    <Row>
                        <Col md="12" className="md-12" style={{display:'flex',marginBottom: 0, justifyContent: 'space-between'}}>
                        <Col xl="3" xxl="3" style={{marginBottom:0}}>
                            <FilterInput
                                width={'100%'}
                                height={'36px'}
                                marginLeft={"0px"}
                                defaultValue={getUrlParam("search")}
                                placeholder={localizedStrings.searchByKey}
                                onChange={onFilterInputChange} />
                        </Col>
                            <Nav style={{ display:'flex', float: "right" }}>
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
                                    />
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>
                </div>
            </Card>
            <Nav style={{ margin: "25px" }}>
                <NavItem style={{ marginRight: "2%", width: "23.5%" }}>
                    <ReportCard
                        title={localizedStrings.totalTimeOffInRoutes}
                        value={summary?.total_time_off || 0}
                        icon={"clock"}
                        type={"duration"}
                    />
                </NavItem>
                <NavItem style={{ marginRight: "2%", width: "23.5%" }}>
                    <ReportCard
                        title={localizedStrings.averageTotalTimeOnStops}
                        value={summary?.time_off_average || 0}
                        icon={"clock"}
                        type={"duration"}
                    />
                </NavItem>
            </Nav>
        </>
        )}
    </>
    );
}
