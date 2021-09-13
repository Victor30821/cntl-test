import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Card,
    CardForm,
    Col,
    FilterInput,
    PerPageSelector,
    Button,
    ButtonWithIcon,
    DateInput,
    Select,
    Modal,
    Switch,
    XLSXExport,
    DropdownView
} from 'components';
import { Row, Nav, NavItem } from 'reactstrap';
import { endOfDay, startOfDay, parseISO } from 'date-fns';

import { localizedStrings } from 'constants/localizedStrings';
import ExportXLSX from '../../../../exports/xlsx/xlsx-report.export-events';

export default function ReportsEventsForm({
    onSubmit,
    inputsConfig,
    formId,
    filters,
    reduxVehicles,
    setSelectedVehicles,
    selectedVehicles,
    maxLengthOfList,
    listLengths,
    perPageSelect,
    filterText,
    totalRegisters,
    setSelectedEvent,
    selectedEvent,
    typeEvents,
    organizationId
    }) {
    const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({ notFound: false, success: false });
    const [docXlsx, setDocXlsx] = useState([]);
    const [openXLSXModal, setOpenXLSXModal] = useState(false);
    const [refreshAutomatic, setRefreshAutomatic] = useState({ isChecked: false });
    const [oneVehicleSelected, setOneVehicleSelected] = useState(false);
    const [vehicleDropdown, setVehicleDropdown] = useState({});
    const inputTimeout = useRef(null);
    const refreshInterval = useRef(null);

    const {
        events,
    } = useSelector(state => state.eventsReports);

    const {
		vehicleTypes,
    } = useSelector((state) => state.vehicles)

    useEffect(() => {
        clearInterval(refreshInterval.current);
        if(events && events.length){
            refresh();
        }
        // eslint-disable-next-line
     }, [events])

    const {
        searchedGroup
    } = useSelector(state => state.groups);

    const {
        user: {
            user_settings,
        }
    } = useSelector(state => state.auth);

    const onFilterInputChange = (nameToFilter = false, isUrlParam = false) => {
        nameToFilter = nameToFilter ? nameToFilter.toLowerCase() : "";
        getFilteredRegisters(nameToFilter);
    }

    const handleDate = (fields, data) => {

        const start_date = startOfDay(parseISO(data.startDate));
        const end_date = endOfDay(parseISO(data.endDate));
 
        filters.period.start_date = start_date;
        filters.period.end_date = end_date;
        inputsConfig.setFilters({...filters});
    }

    const handleVehicle = (data) => {
        setSelectedVehicles([data]);
        refresh();
    }

    const handleTypeEvent = (data) => {
        setSelectedEvent([data]);
        refresh();
    }

    const getFilteredRegisters = (filter) => {
        inputTimeout != null &&
        inputTimeout.current &&
        clearTimeout(inputTimeout.current);
        inputTimeout.current = setTimeout(() => {
            inputsConfig.setFilterText(filter);
        }, 1000);
    }

    const refresh = () => {
        if(refreshAutomatic.isChecked){
            clearInterval(refreshInterval.current);
            refreshInterval.current = setInterval(e => onSubmit(), 15000);
        }
    }

    const handleRefreshAutomatic = () => {
        if(refreshAutomatic.isChecked === false) {
            refreshAutomatic.isChecked = true;
            refresh();
        } else {
            refreshAutomatic.isChecked = false;
            refreshInterval.current && clearInterval(refreshInterval.current);
        }

        setRefreshAutomatic({ ...refreshAutomatic });
    }

    const XLSXexportJSX = () => {
        return (
            <XLSXExport
                document={docXlsx}
                fileName={`relatorio-eventos-${filters.period?.start_date}`}
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
                    searchedGroup,
                    user_settings,
                });
            }
        }
        return typeExport[type]();
    };

    const vehicleData = (vehicleInfo) => {
        const vehicleType = vehicleTypes.find(vehicleType => vehicleType?.value === vehicleInfo?.type_vehicle_id);

        const vehicleGroups = searchedGroup.filter(group => {
            const [, , , , groupVehicleId] = group.urn.split(":");
            return +vehicleInfo?.vehicle_id === +groupVehicleId;
        }).map(group => group.tagName);

        const vehicle = {
            [localizedStrings.yearManufacturer]: {
                type: 'text',
                value: vehicleInfo?.year_manufacturer
            },
            [localizedStrings.vehicleType]: {
                type: 'text',
                value: vehicleType?.label
            },
            [localizedStrings.plateNumber]: {
                type: 'text',
                value: vehicleInfo?.plate_number
            },
            [localizedStrings.vehicleModel]: {
                type: 'text',
                value: vehicleInfo?.model
            },
            [localizedStrings.groups]: {
                type: 'group',
                value: vehicleGroups
            },
        };
        return(vehicle);
    };

    const updateSelectedVehicles = () => {
        const [ selectedVehicle ] = selectedVehicles;

        const onlyOneVehicle = (
            Array.isArray(selectedVehicles) &&
            selectedVehicles.length > 0 &&
            selectedVehicles.length <= 1 &&
            selectedVehicle?.value !== 0
        )
        setOneVehicleSelected(onlyOneVehicle);

        const vehicleInfo = reduxVehicles?.vehicles?.find(vehicle => vehicle?.id === selectedVehicle?.value) || {};

        setVehicleDropdown(vehicleData(vehicleInfo));
    };

    useEffect(() => {
        updateSelectedVehicles();
        // eslint-disable-next-line
    }, [selectedVehicles]);

    return (
        <>
        <Card >
            <CardForm id={formId} onSubmit={onSubmit} style={{ padding: "0px", paddingTop: "12px" }}>
                <Row>
                <Modal
                    open={openXLSXModal}
                    setOpen={setOpenXLSXModal}
                    header={XLSXexportJSX()} />
                        <Col xl="4" xxl="2">
                        <Select
                            isMulti={false}
                            loading={reduxVehicles.loadLoading}
                            title={localizedStrings.selectAVehicle}
                            placeholder={localizedStrings.selectAVehicle}
                            value={selectedVehicles}
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
                        <Col xl="4" xxl="3">
                        <DateInput
                            type={'dateRangePicker'}
                            error={filters.period.isDateRequired}
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
                        <Col xl="4" xxl="2">
                        <Select
                            isMulti={false}
                            error={filters.type_event_id === "required"}
                            loading={reduxVehicles.loadLoading}
                            title={localizedStrings.selectAEvent}
                            placeholder={localizedStrings.selectAEvent}
                            value={selectedEvent}
                            options={typeEvents.sort((a, b) => a.order < b.order ? -1 : 0).map(event => {
                                return {
                                    label: localizedStrings.typeEvents[event.name],
                                    value: event.id
                                }
                            })}
                            onChange={(event) => handleTypeEvent(event)}
                        />
                    </Col>
                        <Col xl="10" xxl="3">
                            <Switch
                                checked={refreshAutomatic.isChecked}
                                onChange={handleRefreshAutomatic}
                                text={localizedStrings.refreshAutomatic}
                                optionsSwitchDiv={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}
                                textOptions={{ style: { fontWeight: "bold", color: "#666666" } }}
                            />
                        </Col>
                        <Col xl="2" xxl="2">
                        <Nav style={{ float: "right", marginTop: "18px" }}>
                            <NavItem>
                                <ButtonWithIcon
                                    icon={"list"}
                                    title={localizedStrings.generateReport}
									disabled={reduxVehicles.loadLoading}
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
            {
                totalRegisters > 0 && (
                    <Card>
                        <div style={{ padding: "16px" }}>
                            <Row style={{ height: "36px" }}>
                                <Col xl="4" xxl="3" style={{ display: 'flex' }}>
                                    <FilterInput
                                        width="100%"
                                        height='100%'
                                        maxHeight="32px"
                                        marginLeft="0px"
                                        defaultValue={filterText}
                                        onChange={onFilterInputChange}>
                                    </FilterInput>
                                </Col>
                                <Col xl="3" xxl="2">
                                    {oneVehicleSelected &&
                                        <DropdownView
                                            title={localizedStrings.vehicleDetails}
                                            data={vehicleDropdown}
                                        />
                                    }
                                </Col>
                                <>


                                    <Col>
                                        <Nav style={{ float: "right" }}>
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
                                </>

                            </Row>
                        </div>
                    </Card>
                )
            }
    </>
    );
}
