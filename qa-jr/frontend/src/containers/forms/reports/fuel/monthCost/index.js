import React, { useRef,useState } from 'react';
import {
    Card,
    CardForm,
    Col,
    PerPageSelector,
    Button,
    Select,
    ButtonWithIcon,
    DateInput,
    Modal,
    XLSXExport
} from 'components';
import { FilterInput } from 'components/inputs';
import { useSelector } from "react-redux";
import { Row } from "reactstrap";
import { localizedStrings } from 'constants/localizedStrings';
import GetWindowDimensions from '../../../../../hooks/getWindowDimensions';
import ExportXLSX from '../../../../../exports/xlsx/xlsx-report.export-fuel-month-cost';
import { setUrlParam, getUrlParam } from 'utils/params';

const adjustElementsScreen = () => {
    const { width } = GetWindowDimensions();
    const sizeScreen = (width <= 1280 && 'first_monitor') || (width >= 1280 && 'second_monitor')
    const cssAdjusting = {
        'first_monitor': {
            divButtonWithIcon: {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end'
            },
            inputPicker: {
                marginBottom: '25px',
            }
        },
        'second_monitor': {
            divButtonWithIcon: {
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '13px 0px 0px 0px',
                alignItems: 'center'
            },
            inputPicker: {
                marginBottom: '25px',
                width: '380px'
            }
        }
    }

    return cssAdjusting[sizeScreen];
};

export default function MonthCostForm ({
    reduxVehicles,
    onSubmit,
    formId,
    filters,
    inputsConfig,
    filterText,
    maxLengthOfList,
    perPageSelect,
    listLengths,
    setCurrentPage,
    total = 0,
    loadLoading = false,
    loadFail = false,
    organizationId
}) {
    const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({ notFound: false, success: false });
    const [docXlsx, setDocXlsx] = useState([]);
    const [openXLSXModal, setOpenXLSXModal] = useState(false);
    const inputTimeout = useRef(null);
    const {
        user: { user_settings }
      } = useSelector(state => state.auth)

    const searchTerm = term => {
        setUrlParam("search", term);
        inputsConfig.setFilterText(term);
    };

    const onFilterInputChange = (nameToFilter = false, isUrlParam = false) => {
        nameToFilter = nameToFilter ? nameToFilter.toLowerCase() : "";
        inputTimeout != null &&
            inputTimeout.current &&
            clearTimeout(inputTimeout.current);
        inputTimeout.current = setTimeout(() => {
            if (nameToFilter === filterText) return;
            searchTerm(nameToFilter || "");
        }, 1000);
    }

    const handleDate = (fields, data) => {
        filters.period.start_date = data.startDate;
        filters.period.end_date = data.endDate;
        inputsConfig.setFilters({ ...filters });
    }

    const XLSXexportJSX = () => {
        return (
            <XLSXExport
                document={docXlsx}
                fileName={`relatorio-custo-por-mes-${filters.period?.start_date}`}
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

    const handleVehicle = (list, vehicle) => {
        if(vehicle?.action === 'clear') return reduxVehicles.setSelectedVehicles([]);
        if(vehicle?.option?.value === 0 || (reduxVehicles.selectedVehicles?.[0]?.value === 0 && reduxVehicles.selectedVehicles.length > 0)) {
            return reduxVehicles.setSelectedVehicles([vehicle.option]);
        }
        if(vehicle?.action === "remove-value") {
            const {selectedVehicles} = reduxVehicles;
            const index = selectedVehicles.findIndex(selectedVehicle => selectedVehicle.value === vehicle.removedValue.value);
            if (index !== -1) {
                selectedVehicles.splice(index, 1);
                return reduxVehicles.setSelectedVehicles([...selectedVehicles]);
            }
        }
        const vehicles = reduxVehicles.selectedVehicles
        vehicles.push(vehicle.option);
        reduxVehicles.setSelectedVehicles(vehicles);
    }

    return (
        <>
            <Card>
            <Modal
                open={openXLSXModal}
                setOpen={setOpenXLSXModal}
                header={XLSXexportJSX()} />
                <CardForm id={formId} onSubmit={onSubmit} style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                    <Row>
                        <Col xl="4" xxl="3" style={{ paddingLeft: '0px' }}>
                            <Select
                                isMulti={true}
                                error={reduxVehicles.loadFail}
                                loading={reduxVehicles.loadLoading}
                                title={localizedStrings.selectAVehicle}
                                value={reduxVehicles.selectedVehicles}
                                placeholder={localizedStrings.selectAVehicle}
                                options={reduxVehicles.vehicles?.map(vehicle => {
                                    return {
                                        label: vehicle.name,
                                        value: vehicle.id
                                    }
                                })}
                                onChange={(list, selected) => handleVehicle(list, selected)}
                            />
                        </Col>
                        <Col xl="4" xxl="3" style={{ paddingLeft: '0px' }}>
                            <DateInput
                                type={'monthRangePicker'}
                                register={inputsConfig.register}
                                isMulti={true}
                                label={localizedStrings.selectPeriod}
                                onChange={handleDate}
                                name={"registerDate"}
                                id={"registerDate"}
                                width="50%"
                                placeholder={"dd/mm/aaaa"}
                                value={filters.period.start_date || filters.period.end_date}
                            />
                        </Col>
                        <Col xl="4" xxl="6" style={adjustElementsScreen().divButtonWithIcon}>
                            <ButtonWithIcon
                                icon={"list"}
								disabled={reduxVehicles.loadLoading}
                                title={localizedStrings.generateReport}
                                onClick={e => {
                                    onSubmit();
                                }}
                            />
                        </Col>
                    </Row>
                </CardForm>
            </Card>
            <Card style={{ display: total !== 0 && !loadLoading && !loadFail ? 'block' : 'none' }}>
                <CardForm>
                    <Row>
                        <Col xl="12" xxl="12" style={{ display: 'flex', height: '36px', padding: '0px', justifyContent: 'space-between' }}>
                        <Col xl="4" xxl="3" style={{ paddingLeft: '0px', display: 'flex' }}>
                                {
                                  total > 0 && !loadLoading && (
                                      <FilterInput
                                          defaultValue={getUrlParam("search")}
                                          placeholder={localizedStrings.searchByKey}
                                          onChange={onFilterInputChange} />
                                  )
                                }
                            </Col>
                            <div style={{ display: 'flex' }}>
                                <Button
                                    as={"a"}
                                    id="btn-export-xlsx"
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
                                >
                                </Button>
                                <PerPageSelector
                                    styleDiv={{ height: "100%", marginLeft: "5px" }}
                                    maxLengthOfList={maxLengthOfList}
                                    listLengths={listLengths}
                                    onClose={index =>
                                        maxLengthOfList !== listLengths[index] &&
                                        perPageSelect(listLengths[index])
                                    }
                                />
                            </div>
                        </Col>
                    </Row>
                </CardForm>
            </Card>
        </>
    );
}
