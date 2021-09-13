import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Card, FilterInput, Button, PerPageSelector, Col, Text, Modal, XLSXExport, Link, PDFExportDownloadLink, HelpIconWithTooltip, ErrorBoundary } from 'components'
import { TableHeader, VirtualizedTable, EmptyStateContainer, FailStateContainer, BottomPagination, InitStateContainer } from 'containers'
import { localizedStrings } from 'constants/localizedStrings'
import { DEFAULT_NULL_VALUE, PER_PAGE_LENGTHS as listLengths,
            vehiclesStatusTypes,
            noSignal,
            noSignal24,
         noUse,
  noModule,
  noCommunication} from "constants/environment";
import { getUrlParam, setUrlParam } from "utils/params";
import ExportXLSX from '../../../exports/xlsx/xlsx-report.export-km';
import PDFPrint from '../../../exports/pdf/pdf-report-km';
import getKmReports from 'utils/requests/reports/getKmReports';
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { convertUserMaskToDateFns } from 'utils/convert';
import { formatDistanceToCard } from 'helpers/ReportCardsCalc';

const SwalModal = withReactContent(Swal)
export default function KmReportsTable({
    setCurrentPage,
    maxLengthOfList,
    setMaxLengthOfList,
    filterText,
    setFilterText,
    selectedDate,
    selectedTime,
    organizationId,
    perPage,
    currentPage,
    initReport,
    selectedVehicleType,
    selectedVehicleGroup,
    vehicleModelSearchTerm,
    selectedVehicleYearManufacturer,
    selectedVehicleFuelType,
}) {

    const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({notFound:false,success:false});
    const [docXlsx, setDocXlsx] = useState([]);
    const [openXLSXModal, setOpenXLSXModal] = useState(false);
    const inputTimeout = useRef(null);
    const [registersTable, setRegistersTable] = useState([]);
    const [searchTable, setSearchTable] = useState([]);

    const {
        user: {
            organization_id,
            company_name,
            name: user_name,
            vehicles: vehicles_filter,
            user_settings:{
                thousand_separator: thousandSeparator,
                decimal_separator: decimalSeparator,
                currency,
                distance_unit,
                short_date_format,
                short_time_format,
            }
        },
    } = useSelector(state => state.auth);

    const [statusSuccess, setStatusSuccess] = useState({ notFound: false, success: false });
    const [openPDFModal, setOpenPDFModal] = useState(false);

    const {
        loadLoading,
        loadFail,
        kmReports,
        total,
    } = useSelector(state => state.kmReports);

    const {
        searchedGroup,
    } = useSelector(state => state.groups);

    const {
        vehicles,
    } = useSelector(state => state.vehicles);

    const hasZeroLength = total === 0 && !loadLoading && !loadFail;

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

    const searchTerm = (term) => {
        setUrlParam("search", term);
        setFilterText(term)
    }

	const tableColumns = [
		{
			active: true,
			key: "vehicle_name",
			label: localizedStrings.vehicle,
			type: "text",
			showSort: true,
			showTooltipInCell: (register) => {
				const show = true
				const iconsArray = []

				const tooltipTexts = {
					[noSignal]: {
						text: localizedStrings.kmReportToolTip.noSignal.text,
						link: localizedStrings.kmReportToolTip.noSignal.link,
					},
					[noSignal24]: {
						text: localizedStrings.kmReportToolTip.noSignal24.text,
						link: localizedStrings.kmReportToolTip.noSignal24.link,
					},
					[noCommunication]: {
						text: localizedStrings.kmReportToolTip.noCommunication.text,
						link: localizedStrings.kmReportToolTip.noCommunication.link,
					},
					[noUse]: {
						text: localizedStrings.kmReportToolTip.noUse.text,
						link: localizedStrings.kmReportToolTip.noUse.link,
					},
				}

				const shouldShowIcon = tooltipTexts[register.status_id];

				shouldShowIcon && iconsArray.push(
					<HelpIconWithTooltip
						text={[
							tooltipTexts[register.status_id].text,
							<Link href={tooltipTexts[register.status_id].link} target="_blank" >
								{" "}
								{localizedStrings.learnMore}
							</Link>
						]}
						style={{
							width: register.status_id === noCommunication ? "16px" :"10px",
							height: register.status_id === noCommunication ? "16px" :"10px",
							marginRight: "6px",
						}}
						icon={vehiclesStatusTypes[register.status_id].icon}
						color={vehiclesStatusTypes[register.status_id].color}
					/>
				)

				return {
					show,
					iconsArray,
				};
			}
		},
		{
            active: true,
            key: "vehicle_model",
            label: localizedStrings.model,
            type: "text",
            showSort: true,
        },
		{
			active: true,
			key: "plate_number",
			label: localizedStrings.plateNumber,
			type: "text",
            showSort: true,
		},
		{
            active: true,
            key: "group",
            label: localizedStrings.group,
            type: "text",
            showSort: true,
        },
		{
			active: true,
			key: "time_raw",
			label: localizedStrings.drivingTime,
			type: "duration",
            showSort: true,
			showTooltip: true,
			tooltipMessage: [
				localizedStrings.tooltipHelpTexts.drivingTime.text,
			],
		},
		{
			active: true,
			key: "distance",
			label: localizedStrings.totalDistance,
			type: "distance",
            showSort: true,
			showTooltipInCell: (register) => {
				const hadOdometerCommmandExecuted = !!register.had_odometer_command_executed;

				const distanceLesserThan1000m = register.distance > 0 && register.distance < 1000;

				const show = hadOdometerCommmandExecuted || distanceLesserThan1000m;

				const iconsArray = [];

				if (hadOdometerCommmandExecuted) {
					const lineStyle = {
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						border: "1px solid #eee",
						borderRadius: "5px",
						padding: "16px 32px",
						marginTop: "5px",
						marginBottom: "5px",
					}
					Array.isArray(register.odometers) && iconsArray.push(
						<HelpIconWithTooltip
							onClick={() => {
								SwalModal.fire({
									titleText: localizedStrings.odometerAdjustment,
									showConfirmButton: true,
									showCancelButton: false,
									confirmButtonText: localizedStrings.close,
									confirmButtonColor: "#1a2565",
									html:
									<ErrorBoundary>
										{register.odometers
												 .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
												 .map(odometer => {
													 const typeCommandIdForTM20 = 8
													 const {
														 value: rawValue,
														 last_value: rawLastValue,
														 created
													 } = odometer;

													 const valuePerTypeCommandId = {
														 [odometer.type_command_id]: () => rawValue * 1000,
														 [typeCommandIdForTM20]: () => rawValue, // tm20 already multiply by 1000
													 }

													 const value = valuePerTypeCommandId[odometer.type_command_id]()
													 const last_value = rawLastValue * 1000

													 return (
														 <div style={lineStyle}>
															 <Text
																 fontSize="16px"
																 marginLeft="5px"
															 >
																 <Text
																	 as="span"
																	 fontWeight="bold"
																	 display="inline-flex"
																	 fontSize="16px"
																	 marginRight="5px"
																 >
																	 {localizedStrings.odometerAdjustmentPerformed}
																 </Text>
																 <ErrorBoundary>
																	 {localizedStrings.odometerAdjustmentPerformedIn + " "}
																	 {
																		 format(
																			 new Date(created),
																			 convertUserMaskToDateFns({ mask: short_date_format, timeMask: short_time_format })
																		 )
																	 }
																 </ErrorBoundary>
															 </Text>
															 <div>
																 {
																	 (last_value <= 0 || isNaN(last_value)) ? null :
																		 <Text
																			 fontSize="12px"
																			 marginLeft="5px"
																			 as="s"
																			 textAlign="right"
																		 >
																			 {
																				 last_value < 1000
																					 ? "< 1" + distance_unit
																					 : formatDistanceToCard(
																						 last_value,
																						 0,
																						 distance_unit
																					 )
																			 }
																		 </Text>
																 }
																 <Text
																	 fontSize="16px"
																	 marginLeft="5px"
																	 fontWeight="bold"
																	 textAlign="right"
																 >
																	 {
																		 value < 1000
																			 ? "< 1" + distance_unit
																			 : formatDistanceToCard(
																				 value,
																				 0,
																				 distance_unit
																			 )
																	 }
																 </Text>
															 </div>
														 </div>
													 )
												 })}
									</ErrorBoundary>,
									customClass: {
										popup: 'modal-comment-container',
										header: 'modal-comment-header',
										title: 'modal-comment-title',
										content: 'modal-comment-content',
									}
								})
							}}
							text={localizedStrings.tooltipHelpTexts.hasOdometerCommandInKmReport.text}
							icon={"warning"}
							color={'#F87700'}
						/>
                    );
                };
                if (distanceLesserThan1000m) {
                    iconsArray.push(
                        <HelpIconWithTooltip
                            text={`${localizedStrings.distanceTraveledLessThan1}${distance_unit}`}
                        />
                    );
                };

                return {
                    show,
                    iconsArray,
                };
            }
        },
        {
            active: true,
            key: "cost",
            label: localizedStrings.cost,
            type: "cost",
            showTooltip: true,
            showSort: true,
            tooltipMessage: [
                localizedStrings.tooltipHelpTexts.cost.text,
                <Link
                    href={localizedStrings.tooltipHelpTexts.cost.link}
                    target="_blank"
                >
                    {" "}
                    {localizedStrings.tooltipHelpTexts.cost.linkText}
                </Link>,
            ],
        },
        {
            active: false,
            key: "start_odometer",
            label: localizedStrings.startOdometer,
            type: "distance",
            showSort: true,
        },
        {active: false,
         key: "end_odometer",
         label: localizedStrings.endOdometer,
         type: "distance",
            showSort: true,
        },
        {
            active: false,
            key: "manufacturer",
            label: localizedStrings.manufacturer,
            type: "text",
            showSort: true,
        }
    ].filter(Boolean);

    const onFilterInputChange = (event) => {
        const value = event.target.value.toLowerCase() || null;
        inputTimeout != null &&
            inputTimeout.current &&
            clearTimeout(inputTimeout.current);
        inputTimeout.current = setTimeout(() => {
            if (value === filterText || value === "") return;
            searchTerm(value || "");
        }, 1000);
    };

    const onLoadFail = () => {
        return (
            <FailStateContainer
                title={localizedStrings.noKmFound}
                titleError={localizedStrings.noKmRegisterFound}
                subtitleError={
                    <Text>
                        {localizedStrings.reviewTheFiltersAndTryAgain}
                    </Text>
                }
            />
        );
    };

    const getRegistersByOffSet = () => {
        const start = Number(getUrlParam("page")) || 1;
        const end = +start * +maxLengthOfList;

        const newDataByOffset = searchTable.slice(start, end)

        setRegistersTable(newDataByOffset);
    }

    useEffect(() => {
        setSearchTable(kmReports)
        setRegistersTable(kmReports)
    }, [kmReports]);

    useEffect(() => {
        getRegistersByOffSet();
        // eslint-disable-next-line
    }, [maxLengthOfList, currentPage]);


    const XLSXexportJSX = () => {
        return (
            <XLSXExport
                document={docXlsx}
                fileName={`${localizedStrings.reportsExport.reportKMFileName}-${selectedDate?.startDate}`}
                successStatus={statusSuccessXLSX.success} />
        )
    };

    const exportReport = (type) => {
        const typeExport = {
            pdf: () => setOpenPDFModal(openPDFModal => openPDFModal = true),
            xlsx: () => {
            setOpenXLSXModal(openXLSXModal => openXLSXModal = true)
			setStatusSuccessXLSX({ success: false });

               ExportXLSX({
                    distance_unit,
                   thousand_separator: thousandSeparator,
                   decimal_separator: decimalSeparator,
                   currency,
                    setStatusSuccessXLSX: setStatusSuccessXLSX,
                    setDocXlsx: setDocXlsx,
                    selectedDate: selectedDate,
                    selectedTime: selectedTime,
                    organizationId: organizationId,
                    vehicle: { vehicles },
                   groups: { searchedGroup },
                    vehicle_type_id: selectedVehicleType?.value,
                    vehicle_group_name: selectedVehicleGroup?.value,
                    vehicle_model_search_term: vehicleModelSearchTerm,
                    vehicle_year_manufacturer: selectedVehicleYearManufacturer?.value,
                    vehicle_fuel_type_id: selectedVehicleFuelType?.value,
                });
            }
        }
        return typeExport[type]();
    };

    const PDFexportJSX = () => {

        const start_date = new Date(`${selectedDate?.startDate} ${selectedTime.startTime}`).toISOString();

        const end_date = new Date(`${selectedDate?.endDate} ${selectedTime.endTime}`).toISOString();

        const filters = {
            start_date: start_date,
            end_date: end_date,
            offset: 0,
            limit: -1,
            group: "vehicle",
            organization_id,
            vehicle_id: vehicles?.map(vehicle => vehicle.id)?.join(',') || [],
            vehicles,
            searchedGroup,
            vehicle_type_id: selectedVehicleType?.value,
            vehicle_group_name: selectedVehicleGroup?.value,
            vehicle_model_search_term: vehicleModelSearchTerm,
            vehicle_year_manufacturer: selectedVehicleYearManufacturer?.value,
            vehicle_fuel_type_id: selectedVehicleFuelType?.value,
            thousandSeparator,
            decimalSeparator,
            currency,
            distance_unit,
        };

        return (
            <PDFExportDownloadLink
                setOpenPDFModal={setOpenPDFModal}
                getReportFn={getKmReports}
                PDFPrint={PDFPrint}
                setStatusSuccess={setStatusSuccess}
                fileName={`relatorio-km-${format(new Date(start_date), 'dd/MM/yyyy')}-${format(new Date(end_date), 'dd/MM/yyyy')}.pdf`}
                successStatus={statusSuccess.success}
                filters={filters}
                reportName="km"
                company_name={company_name}
                user_name={user_name}
                reportNameLocalizedString={localizedStrings.reportKm}
            />
        )
    };

    return (
        <>
            <Card display={"flex"} flexDirection={"column"} loading={loadLoading} fail={loadFail} onFail={onLoadFail}>
                <Modal
                    open={openXLSXModal}
                    setOpen={setOpenXLSXModal}
                    header={XLSXexportJSX()}/>
                <Modal
                    setStatusSuccess={setStatusSuccess}
                    open={openPDFModal}
                    setOpen={setOpenPDFModal}
                    header={PDFexportJSX()} />
                {
                    total !== 0 && !loadLoading && initReport && (
                    <TableHeader
                        container={{ display: 'flex', justifyContent: 'space-between' }}
                    >

                        <Col style={{ padding: '0px', display: 'flex' }} md="4" className="md-4">
                            <FilterInput
                                marginLeft={"0px"}
                                    defaultValue={filterText}
                                placeholder={localizedStrings.searchByKey}
                                onKeyUp={onFilterInputChange} />
                        </Col>
                        {
                            !hasZeroLength &&  total !== 0 &&
                            <>
                                <Col style={{ padding: '0px', display: 'flex', justifyContent: 'flex-end' }} md="8" className="md-8">
                                <Button
                                        hasIcon={true}
                                        onClick={() => exportReport('pdf')}
                                        iconConfig={{
                                            icon: "acrobat",
                                            width: "15px",
                                            color: "#192379"
                                        }}
                                        backgroundColor="#fff"
                                        border="1px solid #E5E5E5"
                                        width="41px"
                                        minWidth="41px"
                                        padding="0"
                                        marginLeft="5px"
                                        marginRight="5px"
                                        hover={{
                                            backgroundColor: "#F5F5FF"
                                        }}
                                    >
                                    </Button>
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
                                        minWidth="41px"
                                        padding="0"
                                        marginLeft="5px"
                                        marginRight="5px"
                                        hover={{
                                            backgroundColor: "#F5F5FF"
                                        }}
                                    >
                                    </Button>
                                    <PerPageSelector
                                        maxLengthOfList={maxLengthOfList}
                                            listLengths={listLengths}
                                            onClose={(index) => maxLengthOfList !== listLengths[index] && perPageSelect(listLengths[index])}
                                    />

                                </Col>
                            </>
                        }

                    </TableHeader>
                  )
                }
                <div>
                    {
                        hasZeroLength && !initReport && (
                            <InitStateContainer
                                title={localizedStrings.initReportsStateTitle}
                                subtitle={localizedStrings.initReportStateSubtitle}
                            />
                        )
                    }
                    <div>
                        {!hasZeroLength && registersTable?.length !== 0 && !loadLoading && !loadFail && (
                            <VirtualizedTable
                                name={'km'}
                                data={registersTable}
                                columns={tableColumns}
                                filterLocally
                                filterText={filterText}
                            />
                        )}
                    </div>
                    {hasZeroLength && !loadLoading && !loadFail && initReport && (
                        <EmptyStateContainer
                        title={localizedStrings.emptyStateTitle}
                        subtitle={localizedStrings.emptyStateSubtitle}
                    />
                    )}
                </div>

            </Card>
            {
                !loadLoading && !loadFail && total <= 1 &&
                (
                    <BottomPagination
                        list={searchTable}
                        page={currentPage}
                        action={getRegistersByOffSet}
                        setPage={setCurrentPage}
                        perPage={perPage}
                        total={searchTable.length}
                    />
                )
            }
        </>
    )
}
