import React, { useRef,useState } from 'react';
import { Card,
    CardForm,
    Col,
    FilterInput,
    PerPageSelector,
    Button,
    DateInput,
    Modal,
    XLSXExport,
	CardInput
} from 'components';
import { EmptyStateContainer } from 'containers'
import { useSelector } from 'react-redux';
import { Row,  Nav, NavItem } from "reactstrap";
import { localizedStrings } from 'constants/localizedStrings'
import ExportXLSX from '../../../../exports/xlsx/xlsx-report.export-all-drives';

export default function ReportsAllDriversForm({
    onSubmit,
    inputsConfig,
    formId,
    totalRegisters,
    filters,
    maxLengthOfList,
    listLengths,
    perPageSelect,
    organizationId,
    setFilterSerchText,
    inicialNightPeriod,
    setInicialNightPeriod,
    endNightPeriod,
    setEndNightPeriod,
    }) {

    const {
        allDrivers,
        loadLoading
    } = useSelector(state => state.allDriversReports);
    
    const {
        user: { user_settings }
    } = useSelector(state => state.auth);

    const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({ notFound: false, success: false });

    const [docXlsx, setDocXlsx] = useState([]);

    const [openXLSXModal, setOpenXLSXModal] = useState(false);

    const inputTimeout = useRef(null);
    const handleDate = (fields, data) => {
        filters.period.start_date = data.startDate;
        filters.period.end_date = data.endDate;
        inputsConfig.setFilters({...filters});
        inputTimeout != null &&
        inputTimeout.current &&
        clearTimeout(inputTimeout.current);
        inputTimeout.current = setTimeout(() => {
            onSubmit();
        }, 1000);
    }


    const getFilteredRegisters = (text) => {
        text = text ? text.toLowerCase() : "";
        inputTimeout?.current && clearTimeout(inputTimeout.current);
        inputTimeout.current = setTimeout(() => {
            setFilterSerchText(text || "");
        }, 1000);
    }

    const XLSXexportJSX = () => {
        return (
            <XLSXExport
                document={docXlsx}
                fileName={`relatorio-todos-os-motoristas-${filters.period?.start_date}`}
                successStatus={statusSuccessXLSX.success} />
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
                    user_settings
                });
            }
        }
        return typeExport[type]();
    };

    return (
        <>
        <Card >
            <Modal
                open={openXLSXModal}
                setOpen={setOpenXLSXModal}
                header={XLSXexportJSX()} />
            <CardForm id={formId} style={{ padding: "0px", paddingTop: "12px" }}>
                <Row>
                    <Col xl="5" xxl="4">
                        <DateInput
                            register={inputsConfig.register}
                            isMulti={true}
                            type={"dateRangePicker"}
                            label={localizedStrings.selectPeriod}
                            onChange={handleDate}
                            name={"fuelDate"}
                            id={"fuelDate"}
                            width="50%"
                            placeholder={"dd/mm/aaaa"}
                            value={new Date()}
                        />
                    </Col>
                </Row>
            </CardForm>
        </Card>
        {
            !loadLoading && Array.isArray(allDrivers) && allDrivers.length > 0 && (
            <>
            <Card>
                <div style={{ padding: "16px" }}>
                    <Row>
                        <Col xl="4" xxl="4">
                            <FilterInput
                                width="100%"
                                marginTop="32px"
                                marginLeft="0px"
                                height="32px"
                                defaultValue={''}
                                onChange={getFilteredRegisters}>
                            </FilterInput>
                        </Col>
                        <Col xl="3" xxl="3">
                            <CardInput
                                onChange={(_, value) => setInicialNightPeriod(value)}
                                inputs={[
                                    {
                                        label: localizedStrings.startNightTime,
                                        defaultValue: inicialNightPeriod,
                                        autoComplete: "off",
                                        autoCorrect: "off",
                                        autoCapitalize: "off",
                                        spellCheck: "false",
                                        type: "time",
                                    },
                                ]}
                            />
                        </Col>
                        <Col xl="3" xxl="3">
                            <CardInput
                                onChange={(_, value) => setEndNightPeriod(value)}
                                inputs={[
                                    {
                                        label: localizedStrings.endNightTime,
                                        defaultValue: endNightPeriod,
                                        autoComplete: "off",
                                        autoCorrect: "off",
                                        autoCapitalize: "off",
                                        spellCheck: "false",
                                        type: "time",
                                    },
                                ]}
                            />
                        </Col>
                        <Col xl="2" xxl="2">
                            <Nav style={{ float: "right", marginTop: "30px" }}>
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
            </>
            )
        }

        </>
    )
}
