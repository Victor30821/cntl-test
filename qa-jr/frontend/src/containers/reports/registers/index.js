import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, Icon, ImageSlider, Link, Text } from 'components';
import { VirtualizedTable, EmptyStateContainer, InitStateContainer, BottomPagination } from 'containers';
import { localizedStrings } from 'constants/localizedStrings';
import redirectToMap from 'utils/map/redirectToMap';
import { faCrosshairs, faCommentAlt, faPhotoVideo } from '@fortawesome/free-solid-svg-icons';
import { conversionPerType } from 'components/VirtualizedTableItems';
import Swal from 'sweetalert2'
import './comment.css'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


export default function FuelRegistersReportsTable({
    history,
    loading,
    onFail,
    initReport,
    page,
    perPage,
    onSubmit,
    setPage,
    filterText,
    vehiclesInfo,
    loadFuelRegistersBySort
}) {

    const {
        loadLoading,
        loadFail,
        fuels,
        total
    } = useSelector(state => state.fuelRegistersReports);

    const {
      user: { user_settings }
    } = useSelector(state => state.auth)

    const onMapView = rowData => {
      const viewData = {
        ...rowData,
				id: rowData?.vehicle_id,
				vehicle_id: rowData?.vehicle_id,
				vehicle_name: rowData?.vehicle_name,
				driver_name: rowData?.driver_name,
        date: rowData?.fuel_date,
        hour: rowData?.fuel_date,
        hideGroups: true,
				coords: {
					lat: rowData?.lat,
					lng: rowData?.lng,
				}
      }
      redirectToMap(viewData, history);
    }


    const hasZeroLength = total === 0 && !loadLoading && !loadFail;

  const [imagesToShow, setImagesToShow] = useState({
    images: [],
    title: "",
    subtitle: ""
  })

  const searchTable = useMemo(() => {

    const hasFuel = Array.isArray(fuels) && fuels.length > 0;

    if (!hasFuel) return [];

    const vehicles = Array.from(vehiclesInfo || []);

    const vehicleInfoPerVehicleId = vehicles.reduce((allVehicles, vehicle) => {

      allVehicles[vehicle.vehicle_id] = vehicle;

      return allVehicles
    }, {})

    return fuels.map(fuel => {
      const vehicleInfo = vehicleInfoPerVehicleId[fuel.vehicle_id] || {};

      return {
        ...fuel,
		fuel_hour: fuel?.fuel_date,
		true_average: Number.isFinite(+fuel.true_average) ? +fuel.true_average : fuel.true_average,
        vehicle_type: vehicleInfo.vehicle_type,
        vehicle_groups: vehicleInfo.vehicle_groups,
        vehicle_model: vehicleInfo.vehicle_model,
        year_manufacturer: vehicleInfo.year_manufacturer,
      }
    })

  },
    [
      fuels,
      vehiclesInfo,
    ]
  )

  const showCommentModal = (fuel = {}) => {
    const hasObservation = !!fuel.fuel_observation?.length
    if (!hasObservation) return;

    const contentModalStyle = {
      alignItems: "center",
      display: "flex",
    }
    const modalOptions = {
      titleText: fuel.vehicle_name
    }
    if (fuel.driver_name) {
      modalOptions.titleText = modalOptions.titleText + " - " + fuel.driver_name;
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
          {fuel.fuel_observation}
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
              reg?.lat &&
              reg?.lng &&
              onMapView(reg),
            style: (reg) => ({
              cursor:
                reg?.lat && reg?.lng
                  ? "pointer"
                  : "default",
              color:
                reg?.lat && reg?.lng
								? "#1A237A"
                : "#868E96",
            }),
          },
        ],
        showSort: false,
      },
      {
        active: true,
        key: "fuel_date",
        label: localizedStrings.date,
        type: "date",
        showSort: true,
      },
      {
        active: false,
        key: "fuel_hour",
        label: localizedStrings.reportsExport.fullHour,
        type: "time",
      },
      {
        active: true,
        key: "fuel_images",
        label: localizedStrings.photo,
        type: "buttons",
        buttons: [
          {
            name: faPhotoVideo,
            useFontAwesome: true,
            width: "30px",
            onClick: (reg) => reg?.fuel_images?.length && setImagesToShow({
              images: reg.fuel_images,
              title: reg.vehicle_name,
              subtitle: conversionPerType.date({
                cellData: reg.fuel_date,
                user_settings,
              }).value
            }),
            style: (reg) => ({
              cursor:
                reg?.fuel_images?.length > 0
                  ? "pointer"
                  : "default",
              color:
                reg?.fuel_images?.length === 0 &&
                "#868E96",
            }),
          },
        ],
      },
      {
        active: true,
        label: localizedStrings.observation,
        type: "buttons",
        buttons: [
          {
            name: faCommentAlt,
            useFontAwesome: true,
            width: "30px",
            onClick: showCommentModal,
            style: (reg) => ({
              cursor:
                reg?.fuel_observation?.length > 0
                  ? "pointer"
                  : "default",
              color:
                !reg?.fuel_observation?.length &&
                "#868E96",
            }),
          },
        ],
      },
      {
        active: true,
        key: "vehicle_name",
        label: localizedStrings.vehicle,
        type: "text",
        showSort: true,
      },
      {
        active: false,
        key: "year_manufacturer",
        label: "Ano de fabricação",
        type: "text",
        showSort: true,
      },
      {
        active: false,
        key: "vehicle_type",
        label: "Tipo do veículo",
        type: "text",
        showSort: true,
		tableSort: true,
      },
      {
        active: false,
        key: "vehicle_groups",
        label: "Grupos",
        type: "text",
        showSort: true,
		tableSort: true,
      },
      {
        active: false,
        key: "plate_number",
        label: "Placa",
        type: "text",
        showSort: true,
      },
      {
        active: false,
        key: "vehicle_model",
        label: "Modelo do veículo",
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
        active: false,
        key: "type_fuel_name",
        label: localizedStrings.combustible,
        type: "text",
        showSort: true,
      },
      {
        active: true,
        key: "liters",
        label: localizedStrings.quantity,
        type: "liters",
        iconAfterText: true,
        icon: [
          localizedStrings.tooltipHelpTexts.cost.text,
          <Link
            href={localizedStrings.tooltipHelpTexts.cost.link}
            target="_blank"
          >
            {" "}
            {localizedStrings.tooltipHelpTexts.cost.linkText}
          </Link>,
        ],
        showSort: true,
      },
      {
        active: true,
        key: "total_value",
        label: localizedStrings.value,
        type: "cost",
        showSort: true,
      },
      {
        active: true,
        key: "liter_value",
        label: localizedStrings.literKMValue,
        type: "cost",
        showSort: true,
      },
      {
        showSort: true,
        active: true,
        key: "odometer",
        label: localizedStrings.odometer,
        type: "distance",
        distanceUnit: "km",
        iconAfterText: true,
        icon: [
          localizedStrings.tooltipHelpTexts.cost.text,
          <Link
            href={localizedStrings.tooltipHelpTexts.cost.link}
            target="_blank"
          >
            {" "}
            {localizedStrings.tooltipHelpTexts.cost.linkText}
          </Link>,
        ],
        showSort: true,
      },
      {
        active: true,
        key: "fully_filled",
        label: localizedStrings.tank,
        type: "boolean",
        onTrue: localizedStrings.complete,
        onFalse: localizedStrings.partial,
        iconAfterText: true,
        icon: [localizedStrings.tooltipHelpTexts.cost.text],
        showSort: true,
      },
      {
        active: true,
        key: "true_average",
        label: localizedStrings.realAverage,
        type: "distancePerLiter",
		showSort: true,
		tableSort: true,
        showTooltip: true,
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
    ];

    return (
        <>
            <Card loading={loading} fail={onFail}>
                <div style={{ display: "flex", flexDirection: "column" }}>

                    <div>
                        <div>
                        {hasZeroLength && !initReport && (
                            <InitStateContainer
                                title={localizedStrings.initReportsStateTitle}
                                subtitle={localizedStrings.initReportStateSubtitle}
                            />
                        )}
                        {total !== 0 && !loadLoading && !loadFail && (
                            <VirtualizedTable
                                name={'register'}
                                data={searchTable}
                                columns={tableColumns}
                                filterLocally
                                filterText={filterText}
                                onClickSortColumns={loadFuelRegistersBySort}
                            />
                        )}
                        </div>
                        {hasZeroLength && initReport && (
                            <EmptyStateContainer
                                title={localizedStrings.emptyStateTitle}
                                subtitle={localizedStrings.emptyStateSubtitle}
                            />
                        )}
                    </div>

                </div>
            </Card>
        {
          Array.isArray(imagesToShow?.images) && imagesToShow.images.length > 0 &&
          <ImageSlider
            imagesUrls={imagesToShow.images}
            title={imagesToShow.title}
            subtitle={imagesToShow.subtitle}
            onDismiss={() => setImagesToShow({
              images: [],
              title: "",
              subtitle: ""
            })}
          />
        }
        {total > 0 && !loadLoading && !loadFail && (
                <BottomPagination
                    list={searchTable}
                    page={page}
                    setPage={setPage}
                    perPage={perPage}
                    total={total}
                    action={onSubmit}
                />
            )}
        </>
    )
}
