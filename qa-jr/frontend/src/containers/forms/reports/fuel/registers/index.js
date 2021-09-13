import React, { useRef, useState, useEffect } from 'react';
import {
    Card,
    CardTitle,
    CardForm,
    Col,
    PerPageSelector,
    ButtonWithIcon,
    Button,
    Select,
    Modal,
    XLSXExport,
    DropdownView
} from 'components';
import { Row } from "reactstrap";
import { getTaggingByFilters } from 'store/modules'
import { useDispatch, useSelector } from "react-redux";
import { DateInput, FilterInput } from 'components/inputs';
import { localizedStrings } from 'constants/localizedStrings';
import GetWindowDimensions from '../../../../../hooks/getWindowDimensions';
import ExportXLSX from '../../../../../exports/xlsx/xlsx-report.export-fuel-register';
import { getUrlParam, setUrlParam } from "utils/params";

const adjustElementsScreen = () => {
    const { width } = GetWindowDimensions();
    const sizeScreen = (width <= 1280 && 'first_monitor') || (width >= 1280 && 'second_monitor')
    const cssAdjusting = {
        'first_monitor': {
            divButtonWithIcon: {
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 10
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

export default function RegistersForm ({
    title,
    onSubmit,
    inputsConfig,
    formId = 'fuel-resgister',
    filters,
    reduxVehicles,
    reduxDrivers,
    maxLengthOfList,
    listLengths,
    perPageSelect,
    filterText,
    organizationId,
    date
}) {
    const dispatch = useDispatch();

    const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({ notFound: false, success: false });
    const [docXlsx, setDocXlsx] = useState([]);
    const [openXLSXModal, setOpenXLSXModal] = useState(false);
    const [driverDropdown, setDriverDropdown] = useState({});
    const [oneDriverSelected, setOneDriverSelected] = useState(false);
    const [driverInfo, setDriverInfo] = useState({});
    const [vehicleDropdown, setVehicleDropdown] = useState({});
    const [oneVehicleSelected, setOneVehicleSelected] = useState(false);
    const [vehicleInfo, setVehicleInfo] = useState({});

    const {
        loadLoading,
        loadFail,
        total
    } = useSelector(state => state.fuelRegistersReports);

    const {
        user: {
          user_settings,
          organization_id
        },
      } = useSelector((state) => state.auth);

    const {
		vehicleTypes,
    } = useSelector((state) => state.vehicles)

    const {
        searchedGroup
    } = useSelector((state) => state.groups);

    const getVehicleGroup = () => {
        dispatch(getTaggingByFilters({
            urn: "v0:cgv:vehicle:" + organization_id + ":*"
        }));
    }

    const inputTimeout = useRef(null);

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
                fileName={`relatorio-registro-abastecimento-${filters.period?.start_date}`}
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
                    drivers: reduxDrivers.drivers,
                    vehicles: reduxVehicles.vehicles,
                    selectedDrivers: reduxDrivers.selectedDrivers,
                    selectedVehicles: reduxVehicles.selectedVehicles,
                    setStatusSuccessXLSX,
                    setDocXlsx,
                    organizationId,
                    filters,
                    user_settings,
                });
            }
        }
        return typeExport[type]();
    };

    const handleVehicle = (list, vehicle) => {
        if(vehicle?.action === 'clear') return reduxVehicles.setSelectedVehicles([]);
        if(vehicle?.option?.value === 0 || (reduxVehicles.selectedVehicles?.[0]?.value === 0 && reduxVehicles.selectedVehicles.length > 0)) {
            const vehicleOption = vehicle?.option ? [vehicle?.option] : [];
            updateSelectedVehicles(vehicleOption);
            return reduxVehicles.setSelectedVehicles(vehicleOption);
        }
        if(vehicle?.action === "remove-value") {
            const {selectedVehicles} = reduxVehicles;
            const index = selectedVehicles.findIndex(selectedVehicle => selectedVehicle?.value === vehicle?.removedValue?.value);
            if (index !== -1) {
                selectedVehicles.splice(index, 1);
                updateSelectedVehicles([...selectedVehicles]);
                return reduxVehicles.setSelectedVehicles([...selectedVehicles]);
            }
        }
        const vehicles = reduxVehicles.selectedVehicles
        vehicles.push(vehicle.option);
        updateSelectedVehicles(vehicles);
        reduxVehicles.setSelectedVehicles(vehicles);
    }

    const handleDriver = async (list, driver) => {
        if(driver?.action === 'clear') return reduxDrivers.setSelectedDrivers([]);
        if(driver.option?.value === 0 || (reduxDrivers.selectedDrivers?.[0]?.value === 0 && reduxDrivers.selectedDrivers.length > 0)) {
            const driverOption = driver?.option ? [driver?.option] : [];
            updateSelectedDrivers(driverOption);
            return reduxDrivers.setSelectedDrivers(driverOption);
        }
        if(driver?.action === "remove-value") {
            const {selectedDrivers} = reduxDrivers;
            const index = selectedDrivers.findIndex(selectedDriver => selectedDriver?.value === driver?.removedValue?.value);
            if (index !== -1) {
                selectedDrivers.splice(index, 1);
                updateSelectedDrivers([...selectedDrivers]);
                return reduxDrivers.setSelectedDrivers([...selectedDrivers]);
            }
        }
        const drivers = reduxDrivers.selectedDrivers;
        drivers.push(driver.option);
        updateSelectedDrivers(drivers);
        return reduxDrivers.setSelectedDrivers(drivers);
    }

    const updateSelectedDrivers = ( drivers ) => {
        const [ hasAllDrivers ] = drivers;

        setOneDriverSelected(
            Array.isArray(drivers) &&
            drivers?.length > 0 &&
            drivers?.length <= 1 &&
            hasAllDrivers &&
            hasAllDrivers?.value !== 0
        );

        const driver = reduxDrivers?.drivers?.find(driver => driver.id === reduxDrivers?.selectedDrivers?.[0]?.value) || {};
        setDriverInfo(driver);
    };

    const driverData = () => {
        const driver = {
            [localizedStrings.nameOfDriver]: {
                type: 'text',
                value: driverInfo?.nickname || driverInfo?.name
            },
            [localizedStrings.reportsExport.CNH]: {
                type: 'text',
                value: driverInfo?.driver_license,
            },
            [localizedStrings.reportsExport.CNHExpirationDate]: {
                type: 'date',
                value: driverInfo?.expire_driver_license,
            },
            [localizedStrings.phone]: {
                type: 'link',
                value: driverInfo?.phone,
                link: "https://api.whatsapp.com/send?phone=" + driverInfo?.phone
            },
            [localizedStrings.codeId]: {
                type: 'text',
                value: driverInfo?.code,
            },
        };
        return(driver);
    }

    const updateSelectedVehicles = ( vehiclesList ) => {
        const [hasAllVehicles] = vehiclesList;

        setOneVehicleSelected(
            Array.isArray(vehiclesList) &&
            vehiclesList?.length > 0 &&
            vehiclesList?.length <= 1 &&
            hasAllVehicles &&
            hasAllVehicles?.value !== 0
        );

        const vehicles = reduxVehicles?.vehicles?.find(vehicle => vehicle.id === reduxVehicles?.selectedVehicles?.[0]?.value) || {};
        setVehicleInfo(vehicles);
    };

    const vehicleData = () => {
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
    }

    useEffect(() => {
        getVehicleGroup();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        updateSelectedDrivers(reduxDrivers?.selectedDrivers);
        updateSelectedVehicles(reduxVehicles?.selectedVehicles);
        // eslint-disable-next-line
    }, [reduxDrivers, reduxVehicles]);

    useEffect(() => {
        setDriverDropdown(driverData());
        setVehicleDropdown(vehicleData());
        // eslint-disable-next-line
    }, [driverInfo, vehicleInfo, searchedGroup]);

    return (
        <>
            <Card >
                <Modal
                    open={openXLSXModal}
                    setOpen={setOpenXLSXModal}
                    header={XLSXexportJSX()} />
                <CardTitle color={"#333"} fontWeight={"bold"} fontSize={"14px"} >
                    {title}
                </CardTitle>
                <CardForm id={formId} onSubmit={onSubmit}>
                    <Row>
                        <Col style={{ paddingLeft: "0px" }} xl="4" xxl="3">
                            <Select
                                placeholder={localizedStrings.selectADriver}
                                isMulti={true}
                                error={reduxDrivers.loadFail}
                                loading={reduxDrivers.loadLoading}
                                title={localizedStrings.drivers}
                                value={reduxDrivers.selectedDrivers}
                                options={reduxDrivers.drivers.map(driver => {
                                    return {
                                        label: driver.name,
                                        value: driver.id
                                    }
                                })}
                                onChange={(listDrivers, selected) => handleDriver(listDrivers, selected)}
                                emptyStateText={localizedStrings.noDriverCreated}
                            />
                        </Col>
                        <Col xl="4" xxl="3">
                            <Select
                                placeholder={localizedStrings.selectAVehicle}
                                isMulti={true}
                                error={reduxVehicles.loadFail}
                                loading={reduxVehicles.loadLoading}
                                title={localizedStrings.vehicles}
                                value={reduxVehicles.selectedVehicles}
                                options={reduxVehicles?.vehicles?.map(vehicle => {
                                    return {
                                        label: vehicle.name,
                                        value: vehicle.id
                                    }
                                })}
                                onChange={(listVehicles, selected) => handleVehicle(listVehicles, selected)}
                                emptyStateText={localizedStrings.noVehicleCreated}
                            />
                        </Col>
                        <Col xl="4" xxl="3">
                            <DateInput
                                type={'dateRangePicker'}
                                register={inputsConfig.register}
                                isMulti={true}
                                label={localizedStrings.selectPeriod}
                                onChange={handleDate}
                                name={"fuelRegisterDate"}
                                id={"fuelRegisterDate"}
                                placeholder={"dd/mm/aaaa"}
                                value={new Date()}
                                monthDefault={true}
                            />
                        </Col>
                        <Col xl="12" xxl="3" style={adjustElementsScreen().divButtonWithIcon}>
                            <ButtonWithIcon
                                id="btn-submit"
								disabled={reduxVehicles.loadLoading}
                                icon={"list"}
                                title={localizedStrings.generateReport}
                                onClick={() => {
                                    onSubmit();
                                }}
                            />
                        </Col>
                    </Row>
                </CardForm>
            </Card>
            <Card style={{display: total !== 0 && !loadLoading && !loadFail ? 'block':'none'}}>
                <CardForm>
                    <Row>
                        <Col xl="12" xxl="12" style={{ display: 'flex', height: '36px', padding: '0px', justifyContent: 'space-between' }}>
                            <Col xl="10" xxl="10" style={{ marginLeft: '-10px', padding: '0', display: 'flex' }}>
                                <Col xl="4" xxl="4" style={{ padding: '0px', display: 'flex' }}>
                                    {
                                    total > 0 && !loadLoading && (
                                        <FilterInput
                                            defaultValue={getUrlParam("search")}
                                            placeholder={localizedStrings.searchByKey}
                                            onChange={onFilterInputChange} />
                                    )
                                    }
                                </Col>
                                <Col xl="6" xxl="6" style={{ marginLeft: '-10px', display: 'flex', justifyContent: 'space-between' }}>
                                    {oneDriverSelected &&
                                        <DropdownView
                                            style={{minWidth: '180px', width: '48%'}}
                                            title={localizedStrings.driverDetails}
                                            data={driverDropdown}
                                        />
                                    }
                                    {oneVehicleSelected &&
                                        <DropdownView
                                            style={{minWidth: '180px', width: '48%'}}
                                            title={localizedStrings.vehicleDetails}
                                            data={vehicleDropdown}
                                        />
                                    }
                                </Col>
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
