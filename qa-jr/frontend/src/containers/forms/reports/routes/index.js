import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Col,
    Card,
    DateInput,
    ReportCard,
    CardForm,
    ButtonWithIcon,
    Button,
    PerPageSelector,
    Select,
    FilterInput,
    Text,
    Icon,
    Modal,
    XLSXExport,
    PDFExportDownloadLink,
    DropdownView
} from 'components'
import { useDispatch, useSelector } from 'react-redux';
import { Row, Nav, NavItem } from "reactstrap";
import { loadVehicles, getTaggingByFilters } from 'store/modules'
import { localizedStrings } from 'constants/localizedStrings'
import { PER_PAGE_LENGTHS as listLengths, MAX_LIMIT_FOR_SELECTORS } from "constants/environment"
import { getUrlParam, setUrlParam } from "utils/params";
import { MAP_ROUTES_PATH } from 'constants/paths';
import ExportXLSX from '../../../../exports/xlsx/xlsx-report.export-routes';
import PDFPrint from '../../../../exports/pdf/pdf-report-route';
import getRouteReport from "utils/requests/reports/getRouteReport"
import userIsManager from 'helpers/userIsManager';
import { StyledButton, StyledNavItem, TooltipText } from './styles';

const getPerPageFromUrl = perPage => listLengths.includes(perPage) ? perPage : listLengths[0];

export default function ReportsRoutesForm ({
    onSubmit,
    inputsConfig,
    formId,
    setCurrentPage,
    maxLengthOfList = getPerPageFromUrl(getUrlParam("perPage")),
    setMaxLengthOfList,
    onVehicleSelect,
    page,
    perPage,
    history,
    filterText,
    setFilterText,
    disabled = false,
    organizationId,
    filters,
    vehicle,
}) {
    const dispatch = useDispatch();

    const [statusSuccess, setStatusSuccess] = useState({ notFound: false, success: false });
    const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({ notFound: false, success: false });
    const [docXlsx, setDocXlsx] = useState([]);
    const [openPDFModal, setOpenPDFModal] = useState(false);
    const [openXLSXModal, setOpenXLSXModal] = useState(false);
    const [visibleVehicles, setVisibleVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState({ value: null, label: localizedStrings.selectAVehicle });
    const [vehicleIndexed, setVehicleIndexed] = useState({});
    const [oneVehicleSelected, setOneVehicleSelected] = useState(false);
    const [vehicleDropdown, setVehicleDropdown] = useState({});
	const [hasOnlyRouteOnGoing, setHasOnlyRouteOnGoing] = useState(false);

    const {
        total,
        summary,
        routes
    } = useSelector(state => state.routesReports);

    const {
        vehicles,
        loadLoading,
        loadFail,
        vehicleTypes
    } = useSelector(state => state.vehicles);
    
    const {
        user: {
            organization_id,
            user_settings,
            company_name,
            name: user_name,
            vehicles: userVehicles,
		}
    } = useSelector(state => state.auth);

    const {
        searchedGroup
    } = useSelector(state => state.groups);

    const handleDate = (fields, data) => {
        const hasPeriod = data.startDate && data.endDate;
        if (hasPeriod) {
			inputsConfig.searchReportsByPeriod({
            	startDate: data.startDate,
            	endDate: data.endDate
    	    });
			setUrlParam("startDate", data.startDate);
			setUrlParam("endDate", data.endDate);
		}
    }

	const isManager = userIsManager();

    const loadOrganizationVehicles = (searchParam) => {
		dispatch(loadVehicles({
			organization_id,
			limit: MAX_LIMIT_FOR_SELECTORS,
			...(!isManager && {vehicle_id: userVehicles})
		}))
    }

    const getVehicleGroup = () => {
        dispatch(getTaggingByFilters({
            urn: "v0:cgv:vehicle:" + organization_id + ":*"
        }));
    }

    const perPageSelect = (page, resetPage = 1) => {
        setUrlParam("page", resetPage);
        setCurrentPage(resetPage);
        if (listLengths.includes(page)) {
            setMaxLengthOfList(page);
            setUrlParam("perPage", page);
            return;
        }
        setUrlParam("perPage", listLengths[0]);
    };

	useEffect(() => {
		const hasOnlyOneRoute = Array.isArray(routes) && routes.length === 1;
		const hasOnlyOneRouteAndIsOnGoing = hasOnlyOneRoute && !!routes[0].onGoing;
		setHasOnlyRouteOnGoing(hasOnlyOneRouteAndIsOnGoing);
	}, [routes])

    useEffect(() => {
        loadOrganizationVehicles();
        getVehicleGroup();
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (vehicles?.length > 0) {
            const indexed = vehicles.reduce((acc,elem) => {
                acc[elem.id] = {...elem};
                return acc;
            },{});
            setVehicleIndexed(indexed);
            setVisibleVehicles(vehicles);
        };
    }, [vehicles]);

    useEffect(() => {
        const vehicleUrlParam = +getUrlParam("vehicle_id");
        const vehicleSelected = vehicleIndexed?.[vehicleUrlParam] || false;
        if(!vehicleSelected) return;
        vehicleSelected && setSelectedVehicle({
            label: vehicleSelected?.name,
            value: vehicleSelected?.id,
        });
        vehicleSelected && onVehicleSelect(vehicleSelected);
    // eslint-disable-next-line
    },[vehicleIndexed,+getUrlParam("vehicle_id")]);

    const tableData = () => {
        const orderedData = routes.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
        return orderedData;
    }

    const showAllRoutesOnMap = () => {
		if (hasOnlyRouteOnGoing) return;

        const vehicleUrlParam = +getUrlParam("vehicle_id");
        const vehicleSelected = vehicleIndexed?.[vehicleUrlParam];

        history.push(MAP_ROUTES_PATH, { routes: tableData(), showAllDayRoutes: true, vehicle_id: vehicleSelected?.id  });
    }
    const inputTimeout = useRef(null);
    const searchTerm = term => {
        setUrlParam("search", term);
        setFilterText(term);
    };

    const onFilterInputChange = (nameToFilter = false, isUrlParam = false) => {
        nameToFilter = nameToFilter ? nameToFilter.toLowerCase() : "";
        inputTimeout?.current && clearTimeout(inputTimeout.current);
        inputTimeout.current = setTimeout(() => {
            if (nameToFilter === filterText) return;
            searchTerm(nameToFilter || "");
        }, 1000);
    }

    const PDFexportJSX = () => {
        filters.limit = -1;
        const selectedVehicle = vehicles.find(
            (vehicleInfo) => vehicleInfo.id === vehicle?.id
            );
        if (!selectedVehicle) return
        const vehicleType = vehicleTypes.find(vehicleType => vehicleType.value === selectedVehicle?.type_vehicle_id);
        selectedVehicle.vehicleType = vehicleType?.label;
        filters.selectedVehicle = selectedVehicle;
        filters.organization_id = organizationId;
        filters.user_settings = user_settings;
        filters.total = total;

        return (
            <PDFExportDownloadLink
                setOpenPDFModal={setOpenPDFModal}
                getReportFn={getRouteReport}
                PDFPrint={PDFPrint}
                setStatusSuccess={setStatusSuccess}
                fileName={`relatorio-rotas-${filters?.start_date}-${filters?.end_date}.pdf`}
                successStatus={statusSuccess.success}
                filters={filters}
                reportName="routes"
                company_name={company_name}
                user_name={user_name}
                reportNameLocalizedString={localizedStrings.routesReport}
            />
        )
    };

    const XLSXexportJSX = () => {
        return (
            <XLSXExport
                document={docXlsx}
                fileName={`relatorio-rotas-${filters?.start_date}`}
                successStatus={statusSuccessXLSX.success} />
        )
    };

    const exportReport = (type) => {
		if (hasOnlyRouteOnGoing) return;
        filters.total = total
        const typeExport = {
            pdf: () => setOpenPDFModal(openPDFModal => openPDFModal = true),
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
        const onlyOneVehicle = (
            selectedVehicle?.value !== 0 &&
            selectedVehicle?.value !== null
        )
        setOneVehicleSelected(onlyOneVehicle);

        const vehicleInfo = vehicles?.find(vehicle => vehicle?.id === selectedVehicle?.value) || {};

        setVehicleDropdown(vehicleData(vehicleInfo));
    };

    useEffect(() => {
        updateSelectedVehicles();
        // eslint-disable-next-line
    }, [selectedVehicle, searchedGroup]);

	const filtersDate = useMemo(() => {
		const startDate = new Date(filters?.start_date);
		const endDate = new Date(filters?.end_date);

		const isValidStartDate = !isNaN(startDate);
		const isValidEndDate = !isNaN(endDate);

		if (!isValidStartDate || !isValidEndDate) return null;

		const correctStartDate = startDate.setDate(startDate.getDate() + 1);
		const correctEndDate = endDate.setDate(endDate.getDate() + 1);

		return [correctStartDate, correctEndDate];
	}, []);

    return (
        <>
            <Card display={"flex"} flexDirection={"column"}>
                <CardForm id={formId} onSubmit={onSubmit}>
                    <Row>
                        <Col xl="3" xxl="3" style={{ padding: "0px" }}>
                            <Select
                                style={{
                                    minWidth: "200px",
                                    marginRight: "10px"
                                }}
                                required={true}
                                error={loadFail}
                                placeholder={localizedStrings.selectAVehicle}
                                loading={loadLoading}
                                title={localizedStrings.selectAVehicle}
                                value={selectedVehicle}
                                options={visibleVehicles?.map(vehicle => {
                                    return {
                                        label: vehicle.name,
                                        value: vehicle.id,
                                    }
                                }) || []}
                                onChange={(vehicle) => {
                                    setSelectedVehicle(vehicle)
                                    onVehicleSelect(vehicle)
                                }}
                                emptyStateText={localizedStrings.noVehicleCreated}
                            />

                        </Col>
                        <Col xl="4" xxl="4">
                            <DateInput
                                type={'dateRangePicker'}
                                register={inputsConfig.register}
                                isMulti={true}
                                label={localizedStrings.selectPeriod}
                                onChange={handleDate}
                                monthDefault={!filtersDate}
                                required={true}
                                name={"period"}
                                id={"period"}
                                placeholder={"dd/mm/aaaa"}
                                value={filtersDate}
								hasDefaultValue={!filtersDate}
                            />
                        </Col>
                        <Col xl="5" xxl="5" style={{
                            display: "flex",
                            justifyContent: 'flex-end',
                            alignItems: "center",
                        }}>
                            <ButtonWithIcon
                                icon={"list"}
                                title={localizedStrings.generateReport}
                                onClick={onSubmit}
                                disabled={disabled}
                            />
                        </Col>
                    </Row>

                </CardForm>
            </Card>
            {
                total > 0 && (
                    <Card>
                        <Modal
                            open={openXLSXModal}
                            setOpen={setOpenXLSXModal}
                            header={XLSXexportJSX()} />
                        <Modal
                            setStatusSuccess={setStatusSuccess}
                            open={openPDFModal}
                            setOpen={setOpenPDFModal}
                            header={PDFexportJSX()} />
                        <div style={{ padding: "16px" }}>
                            <Row style={{ minHeight: "36px" }}>
                                <Col xl="3" xxl="3" style={{ marginBottom: 0 }}>
                                    <FilterInput
                                        width={'100%'}
                                        height={'36px'}
                                        marginLeft={"0px"}
                                        defaultValue={getUrlParam("search")}
                                        placeholder={localizedStrings.searchByKey}
                                        onChange={onFilterInputChange}
                                    />
                                </Col>
                                <Col xl="3" xxl="2" style={{ marginBottom: 0 }}>
                                    {oneVehicleSelected &&
                                        <DropdownView
                                            title={localizedStrings.vehicleDetails}
                                            data={vehicleDropdown}
                                        />
                                    }
                                </Col>
                                <Col>
                                    <Nav style={{ float: "right" }}>
                                        <StyledNavItem>
											{hasOnlyRouteOnGoing &&
												<TooltipText>{localizedStrings.theseOptionsDependAtLeastOneRouteCompletedToBeEnabled}</TooltipText>
											}
                                            <StyledButton
												isDisabled={hasOnlyRouteOnGoing}
                                                onClick={() => showAllRoutesOnMap()}
                                            >
                                                <Icon icon={"location"} width={'16px'} height={'16px'} color='#fff' divProps={{ margin: "0px 5px" }} />
                                                <Text color={"#fff"} fontSize={"14px"} >
                                                    {localizedStrings.showAllRoutesOnMap}
                                                </Text>
                                            </StyledButton>
                                        </StyledNavItem>
                                        <StyledNavItem>
											{hasOnlyRouteOnGoing &&
												<TooltipText>{localizedStrings.theseOptionsDependAtLeastOneRouteCompletedToBeEnabled}</TooltipText>
											}
                                            <Button
												className={hasOnlyRouteOnGoing ? "cursorNotAllowed" : ""}
                                                hasIcon={true}
                                                onClick={() => exportReport('pdf')}
                                                iconConfig={{
                                                    icon: "acrobat",
                                                    width: "15px",
                                                    color: hasOnlyRouteOnGoing ? "#fff" : "#192379",
                                                }}
                                                style={{
                                                    backgroundColor: hasOnlyRouteOnGoing ? "#C2C7CA" : "#fff",
                                                    border: "1px solid #E5E5E5",
                                                    width: "41px",
                                                    height: "37px",
                                                    minWidth: "41px",
                                                    padding: "0",
                                                    marginLeft: "5px"
                                                }}
                                                as={"a"}
                                            >
                                            </Button>
                                        </StyledNavItem>
                                        <StyledNavItem>
											{hasOnlyRouteOnGoing &&
												<TooltipText>{localizedStrings.theseOptionsDependAtLeastOneRouteCompletedToBeEnabled}</TooltipText>
											}
                                            <Button
												className={hasOnlyRouteOnGoing ? "cursorNotAllowed" : ""}
                                                hasIcon={true}
                                                onClick={() => exportReport('xlsx')}
                                                iconConfig={{
                                                    icon: "xlsx",
                                                    width: "15px",
                                                    color: hasOnlyRouteOnGoing ? "#fff" : "#192379",
                                                }}
                                                style={{
                                                    backgroundColor: hasOnlyRouteOnGoing ? "#C2C7CA" : "#fff",
                                                    border: "1px solid #E5E5E5",
                                                    width: "41px",
                                                    height: "37px",
                                                    minWidth: "41px",
                                                    padding: "0",
                                                    marginLeft: "5px"
                                                }}
                                                as={"a"}
                                            >
                                            </Button>
                                        </StyledNavItem>
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
                )
            }
            {
                total > 0 &&
                <div style={{ padding: "0 25px" }}>
                    <Nav style={{ margin: "25px 0" }}>
                        <NavItem style={{ marginRight: "2%", width: "18.5%" }}>
                            <ReportCard
                                title={localizedStrings.totalTimeOn}
                                value={summary.total_time || '-'}
                                icon={"clock"}
                                type={summary.total_time ? "duration" : "text"}
                            />
                        </NavItem>
                        <NavItem style={{ marginRight: "2%", width: "18.5%" }}>
                            <ReportCard
                                title={localizedStrings.travelledDistance}
                                value={summary.total_distance || '-'}
                                icon={"road"}
                                type={summary.total_distance ? "distance" : "text"}
                            />
                        </NavItem>
                        <NavItem style={{ marginRight: "2%", width: "18.5%" }}>
                            <ReportCard
                                title={localizedStrings.estimatedCost}
                                value={summary.total_cost || '-'}
                                icon={"money"}
                                type={summary.total_cost ? "cost" : "text"}
                                tooltip={{
                                    text: localizedStrings.tooltipHelpTexts.estimatedCost.text,
                                    href: localizedStrings.tooltipHelpTexts.estimatedCost.link,
                                    learnMore: localizedStrings.learnMore,
                                }}
                            />
                        </NavItem>
                        <NavItem style={{ marginRight: "2%", width: "18.5%" }}>
                            <ReportCard
                                title={localizedStrings.averageSpeed}
                                value={(summary.average_speed) || '-'}
                                icon={"tachometer"}
                                type={(summary.average_speed) ? "velocity" : "text"}
                            />
                        </NavItem>
                        <NavItem style={{ width: "18%" }}>
                            <ReportCard
                                title={localizedStrings.maxSpeed}
                                value={summary.max_speed || '-'}
                                icon={"tachometer"}
                                type={summary.max_speed ? "velocity" : "text"}
                            />
                        </NavItem>

                    </Nav>
                </div>
            }
        </>

    );
}
