import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Icon, Text } from 'components';
import { VirtualizedTable, EmptyStateContainer, InitStateContainer } from 'containers';
import { localizedStrings } from 'constants/localizedStrings';
import { faCommentAlt, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import redirectToMap from 'utils/map/redirectToMap';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import loadQuestions from 'utils/requests/getChecklistQuestions';
const MySwal = withReactContent(Swal)

export default function ChecklistReportsTable({
    history,
    loading,
    fail,
    visibleRegisters,
    setVisibleRegisters,
    onLoadFail,
    initReport,
    filterText,
    vehiclesInfo,
    loadChecklistBySort
}) {
    const {
        loadLoading,
        loadFail,
        checklist,
        total
    } = useSelector(state => state.checklistReports);

		const [questions, setQuestions] = useState([]);

		const showItemModal = (checklist = {}) => {
			const hasObservation = !!checklist.checklist_item
			if (!hasObservation) return;

			const contentModalStyle = {
				alignItems: "center",
				display: "flex",
			}
			const modalOptions = {
				titleText: checklist.vehicle_name
			}
			if (checklist.driver_name) {
				modalOptions.titleText = modalOptions.titleText + " - " + checklist.driver_name;
			}

			MySwal.fire({
				titleText: modalOptions.titleText,
				showConfirmButton: false,
				showCancelButton: false,
				html: <div style={contentModalStyle}>
					<Icon
						useFontAwesome
						icon={faCommentAlt}
						width={'20px'}
						height={'20px'}
						color='#1D1B84'
					/>
					<Text
						textAlign="left"
						fontSize="18px"
						padding="10px"
						overflow="auto"
					>
						{checklist.checklist_item}
					</Text>
				</div>,
				customClass: {
					popup: 'modal-comment-container',
					header: 'modal-comment-header',
					title: 'modal-comment-title',
					content: 'modal-comment-content',
				}
			})
		}

		useEffect(() => {
			const load = async () => {
				setQuestions(await loadQuestions());
			};

			load();
		}, []);

    const tableColumns = [
			{
				active: true,
				label: localizedStrings.place,
				type: "buttons",
				buttons: [
					{
						name: faCrosshairs,
						useFontAwesome: true,
						width: "30px",
						onClick: (reg) =>
							reg?.coords?.lat !== null &&
							reg?.coords?.lng !== null &&
							onMapView(reg),
						style: (reg) => ({
							cursor:
								reg?.coords?.lat !== null && reg?.coords?.lng !== null
									? "pointer"
									: "default",
							color:
								reg?.coords?.lat === null &&
								reg?.coords?.lng === null &&
								"#868E96",
						}),
					},
				],
				showSort: false,
			},
			{
				active: false,
				key: "checklist_hour",
				label: localizedStrings.reportsExport.fullHour,
				type: "time",
				showSort: false,
			},
			{
				active: false,
				key: "year_manufacturer",
				label: localizedStrings.reportsExport.year_manufacturer,
				type: "text",
				showSort: true,
			},
			{
				active: false,
				key: "vehicle_type",
				label: localizedStrings.reportsExport.vehicle_type,
				type: "text",
				showSort: true,
				tableSort: true,
			},
			{
				active: false,
				key: "vehicle_groups",
				label: localizedStrings.reportsExport.groups,
				type: "text",
				showSort: true,
				tableSort: true,
			},
			{
				active: false,
				key: "plate_number",
				label: localizedStrings.reportsExport.vehicle_plate,
				type: "text",
				showSort: true,
			},
			{
				active: false,
				key: "vehicle_model",
				label: localizedStrings.reportsExport.model_of_vehicle,
				type: "text",
				showSort: true,
			},
			{
				active: true,
				key: "vehicle_name",
				label: localizedStrings.vehicle,
				type: "text",
				showSort: true,
			},
			{
				active: true,
				key: "driver_name",
				label: localizedStrings.driver,
				type: "text",
				showSort: true,
			},
			{
				active: true,
				key: "driver_license_suspended",
				label: localizedStrings.CNHExpired,
				type: "boolean",
				onTrue: localizedStrings.yes,
				onFalse: localizedStrings.no,
				showSort: true,
				tableSort: true,
			},
			{
				active: true,
				label: localizedStrings.checklistItens,
                key: "checklist_quantity",
				type: "buttons",
				showSort: true,
				tableSort: true,
				buttons: [
					{
						customElement: data => (
							data.checklist_quantity !== localizedStrings.noOccurrences
							? <div><img style={{display: "inline-block", paddingLeft: 18}} src={require("assets/checklist_occurrences_icon.svg")}/><Button
								style={{
									backgroundColor: "transparent",
									display: "inline-block",
									paddingLeft: 3,
									width: '100%',
									border: 0,
									outline: 'none'
								}}
								textConfig={{
									fontWeight: 'bold',
									color: "#F64848"
								}}
								title={data.checklist_quantity}
								onClick={event => {
									showItemModal(data, event);
									event.preventDefault();
									event.stopPropagation();
									return false;
								}}
							/></div>
							: <Button
								style={{
									backgroundColor: "transparent",
									display: "flex",
									width: '100%',
									border: 0,
									outline: 'none'
								}}
								textConfig={{
									fontWeight: 'normal',
									color: "#000"
								}}
								title={data.checklist_quantity}
							/>
						)
					}
				],
			},
			{
				active: true,
				key: "date",
				label: localizedStrings.date,
				type: "date",
				dateFormat: "yyyy-MM-dd",
				showSort: true,
			},
		];

    const onMapView = rowData => {
        const viewData = {
          date: rowData?.checklist_date,
          hour: rowData?.checklist_hour,
          hideGroups: true,
          ...rowData
        }
        redirectToMap(viewData, history);
      }

    const tableData = useMemo(() => (
        visibleRegisters.map(obj => {
            // eslint-disable-next-line
						const checklistValues = obj.reports_items_checklist.checklist.map((checklist) => {

							const question = questions?.find(q => q?.id === checklist.checklist_question_id);

							return {
								quantity: question?.name ? 1 : 0,
								item: question?.name,
								observation: checklist.note?.trim(),
							}
            });

            const createdHour = new Date(obj.created);
            createdHour.setHours(createdHour.getHours());

            const vehicleInformation = vehiclesInfo?.find(vehicle => vehicle?.vehicle_id === obj?.vehicle_id) || {};

			const occurrencesNumber = checklistValues?.reduce((acc, current_checklist) => acc + current_checklist.quantity, 0)

            const date = new Date(obj.date);
            date.setHours(date.getHours() + 6);

						return {
							coords: {
								lat: obj.lat,
								lng: obj.lng,
							},
							id: obj.vehicle_id,
							plate_number: obj.plate_number,
							year_manufacturer: obj.year_manufacturer,
							vehicle_type: vehicleInformation?.vehicle_type,
							vehicle_model: obj.vehicle_model,
							vehicle_groups: vehicleInformation?.vehicle_groups,
							checklist_hour: createdHour.toISOString(),
							vehicle_name: obj.vehicle_name,
							driver_name: obj.driver_name,
							driver_license_suspended: obj.driver_license_suspended,
							checklist_quantity: occurrencesNumber === 0
								?  localizedStrings.noOccurrences
								: `${occurrencesNumber} ${localizedStrings.occurrences}`,
							checklist_item: checklistValues?.map(checklist => checklist.item)?.filter(item => item).join(', '),
							checklist_observation: checklistValues?.map(checklist  => checklist.observation)?.filter(observation => observation).join(', '),
							date: date.toISOString(),
						}
        })
    ), [visibleRegisters]);

    // eslint-disable-next-line
    useEffect(() => setVisibleRegisters(checklist), [checklist]);

    return (
        <Card loading={loading} onFail={onLoadFail}>
            <div style={{ display: "flex", flexDirection: "column" }}>

                <div>
                    <div>
                    {total === 0 && !initReport && (
                        <InitStateContainer
                            title={localizedStrings.initReportsStateTitle}
                            subtitle={localizedStrings.initReportStateSubtitle}
                        />
                    )}
                    {total !== 0 && !loadLoading && !loadFail && (
                        <VirtualizedTable
                            name={'checklist'}
                            data={tableData}
                            columns={tableColumns}
                            filterLocally
                            filterText={filterText}
                            onClickSortColumns={loadChecklistBySort}
                        />
                    )}
                    </div>
                    {total === 0 && initReport && !loadLoading && (
                        <EmptyStateContainer
                            title={localizedStrings.emptyStateTitle}
                            subtitle={localizedStrings.emptyStateSubtitle}
                        />
                    )}
                </div>

            </div>
        </Card>
    )
}
