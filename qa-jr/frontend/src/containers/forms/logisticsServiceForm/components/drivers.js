import React, { useState, useEffect } from "react";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {  Select, Col, Modal, Text, Icon } from "components";
import { VirtualizedTable, EmptyStateContainer, DeleteConfirmationForm } from 'containers';
import { loadDrivers, logisticsChangeSelected, fetchLoadSuccess, driverLoadSuccess, fetchRemoveItemFromServiceDrivers, fetchAddDriver, setDriverDay } from "store/modules";
import { DEFAULT_NULL_VALUE, MAX_LIMIT_FOR_SELECTORS } from "constants/environment";

const days_of_the_week_translated = {
  sun: localizedStrings.logisticService.sunday,
  mon: localizedStrings.logisticService.monday,
  tue: localizedStrings.logisticService.tuesday,
  wed: localizedStrings.logisticService.wednesday,
  thu: localizedStrings.logisticService.thursday,
  fri: localizedStrings.logisticService.friday,
  sat: localizedStrings.logisticService.saturday,
};

const vehicleRouteOnMapButtonStyle = {
  width: "auto",
  display: "flex",
  background: "#192379",
  flexDirection: "row",
  cursor: "pointer",
  alignItems: "center",
  border: "1px solid #1A237A",
  borderRadius: "4px",
  minWidth: "155px",
  backgroundColor: "#192379",
  justifyContent: "flex-end",
  padding: "10px",
};

export default function Drivers({ inputsConfig, logisticsService, onChanges, errors, setErrors }) {

  const dispatch = useDispatch();

  const [tableColumns, setTableColumns] = useState([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [valueDriver, setValueDriver] = useState({})

  const {
    drivers,
    all_drivers,
    loadLoading: loadSelectDrivers
  } = useSelector(state => state.drivers);

  const {
    selectors,
    selected,
    services_drivers,
  } = useSelector(state => state.logisticsServices);

  const {
    organization_id
  } = useSelector(state => state.auth)

  const {
    overview_selectors: {
      selector_days_of_weeks_driver,
      selector_period_driver,
    }
  } = selectors;

  const {
    overview_selected: {
      days_of_weeks_driver_selected,
      service_driver_selected,
      period_driver_selected,
    },
  } = selected;

  useEffect(() => {
    dispatch(loadDrivers({
      limit: MAX_LIMIT_FOR_SELECTORS,
      offset: 0,
      search_term: "",
      organization_id
    }));
  // eslint-disable-next-line
  }, []);

  const onClickDeleteServiceDrivers = () => {
    dispatch(fetchAddDriver(all_drivers, valueDriver));
    dispatch(fetchRemoveItemFromServiceDrivers({ driver: valueDriver }));
    setOpenDeleteModal(false);
  }

  useEffect(() => {
    const columns = [
      {
        active: true,
        key: "name",
        label: localizedStrings.logisticService.driver,
        type: "text"
      },
      {
        active: true,
        key: "period",
        label: localizedStrings.periodOfUse,
        type: "text",
      }
    ];

    const days_selected = selector_days_of_weeks_driver?.map((selector_days) => ({
        active: true,
        key: selector_days.value,
        label: days_of_the_week_translated[selector_days.value],
        type: "text"
    })) || [];
    const actions = [{
      active: true,
      label: localizedStrings.logisticService.actions, type: "buttons",
       buttons:[{
           name: "trash",
           color: "#FD3995",
           onClick: deleteModal,
       }]
   }];
    setTableColumns([columns, days_selected, actions].flat());
  }, [selector_days_of_weeks_driver]);


  const cleanErrors = () => {
    const errorsToClear = [
      errors.drivers.days_of_weeks_driver_selected_error,
      errors.drivers.period_driver_selected_error,
      errors.drivers.service_driver_selected_error,
    ];
    const errorMessages = [
      errors.drivers.days_of_weeks_driver_selected_error,
      errors.drivers.period_driver_selected_error,
      errors.drivers.service_driver_selected_error,
    ];

    errorsToClear.forEach(e => e.error = false);

    errorMessages.forEach(e => e.message = "");

    setErrors({...errors});
  }

  const onClickRegisterDriver = () => {
    cleanErrors();

    const fields = ["driver", "days", "period"];

    const errorVerification = {
      driver: () => !service_driver_selected?.value,
      days: () => +!!days_of_weeks_driver_selected?.length === 0,
      period: () => +!!period_driver_selected?.length === 0,
    }

    const setErrorOnFields = {
      driver: () => {
        errors.drivers.service_driver_selected_error.error = true;
        errors.drivers.service_driver_selected_error.message = localizedStrings.fieldRequired;
      },
      days: () => {
        errors.drivers.days_of_weeks_driver_selected_error.error = true;
        errors.drivers.days_of_weeks_driver_selected_error.message = localizedStrings.fieldRequired;
      },
      period: () => {
        errors.drivers.period_driver_selected_error.error = true;
        errors.drivers.period_driver_selected_error.message = localizedStrings.fieldRequired;
      }
    }
    const hasErrors = fields
      .map(field => {

        const hasError = errorVerification[field]?.();

        if (hasError) setErrorOnFields[field]();

        return hasError;
      })
      .some(Boolean)

    if (hasErrors) return setErrors({ ...errors });

    cleanErrors();

    const list_drivers = {
      name: service_driver_selected.label,
      period: period_driver_selected?.map?.(p => p.label)?.join?.(", "),
      sun: localizedStrings.logisticService.no,
      mon: localizedStrings.logisticService.no,
      tue: localizedStrings.logisticService.no,
      wed: localizedStrings.logisticService.no,
      thu: localizedStrings.logisticService.no,
      fri: localizedStrings.logisticService.no,
      sat: localizedStrings.logisticService.no,
      driver: {
        driver_id: Number(service_driver_selected.value),
        days_of_week: days_of_weeks_driver_selected?.map?.(days => days?.value)?.join?.(','),
        period: period_driver_selected?.map?.(period => period?.value)
      },  
    }

    days_of_weeks_driver_selected.forEach(day => list_drivers[day.value] = localizedStrings.logisticService.yes);
    
    dispatch(driverLoadSuccess(drivers.filter(driver => Number(driver.id) !== Number(service_driver_selected.value)), drivers.length, all_drivers));
    
    dispatch(fetchLoadSuccess({ services_drivers: [services_drivers, list_drivers].flat() }));
    
    dispatch(logisticsChangeSelected({
      selected: {
        overview_selected: {
          ...selected.overview_selected,
          service_driver_selected: {},
          days_of_weeks_driver_selected: [],
          period_driver_selected: [],
        }
      }
    }));
  }


  useEffect(() => {

    const days = {
      0: 'sun',
      1: 'mon',
      2: 'tue',
      3: 'wed',
      4: 'thu',
      5: 'fri',
      6: 'sat',
    };

    const day_selected = new Date().getDay();

    const day_convert = days[day_selected];

    const has_drivers = Array.isArray(services_drivers) && services_drivers?.length > 0;
    if(has_drivers) {

      const drivers = services_drivers?.filter(service_driver => service_driver[day_convert] === localizedStrings.logisticService.yes);

      const found_driver = Array.isArray(drivers) &&  drivers.length > 0;

      if(found_driver) {

        const [driver={}] = drivers;

        const total_drivers = drivers.length - 1;

        const driver_name = driver.name;

        dispatch(setDriverDay({ driver_day: {name: total_drivers > 0 ? driver_name + " +" + total_drivers : driver.name}}));

      }

      if (found_driver === false) dispatch(setDriverDay({ driver_day: [{ name: DEFAULT_NULL_VALUE }] }));

    }
  // eslint-disable-next-line
  }, [services_drivers]);

  const deleteModal = (value) => {
    setOpenDeleteModal(true);
    setValueDriver(value);
  }

  const onCancelDelete = () => setOpenDeleteModal(false);

  const hasServicesDrivers = Array.isArray(services_drivers) &&  services_drivers.length > 0;

  return (
    <>
      <Row>
      <Modal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        header={DeleteConfirmationForm({ onCancel: onCancelDelete, onConfirm: onClickDeleteServiceDrivers, })} />
        <Col xl="3" md="3">
          <Select
          title={localizedStrings.logisticService.driver_name}
          loading={loadSelectDrivers}
          error={errors.drivers.service_driver_selected_error.error}
          errorText={errors.drivers.service_driver_selected_error.message}
          options={drivers?.map?.(driver => ({ label: driver.name, value: driver.id }))}
          placeholder={localizedStrings.logisticService.driverNamePlaceHolder}
          onChange={(item) => {
            dispatch(logisticsChangeSelected({
              selected: { overview_selected: { ...selected.overview_selected, service_driver_selected: item } }
            }))
          }}
          value={service_driver_selected || {}} />
        </Col>
        <Col xl="3" md="3">
          <Select
          title={localizedStrings.logisticService.daysOfTheWeek}
          options={selector_days_of_weeks_driver}
          error={errors.drivers.days_of_weeks_driver_selected_error.error}
            errorText={errors.drivers.days_of_weeks_driver_selected_error.message}
          placeholder={localizedStrings.logisticService.daysOfTheWeekPlaceholder}
          onChange={(item) => {
            dispatch(logisticsChangeSelected({
              selected: { overview_selected: { ...selected.overview_selected, days_of_weeks_driver_selected: item } }
            }))
          }}
          isMulti={true}
          value={days_of_weeks_driver_selected || []} />
        </Col>
        <Col xl="3" md="3">
          <Select
            isMulti
            title={localizedStrings.logisticService.drivingPeriod}
            options={selector_period_driver}
            error={errors.drivers.period_driver_selected_error.error}
            errorText={errors.drivers.period_driver_selected_error.message}
            placeholder={localizedStrings.logisticService.periodPlaceholder}
            onChange={(item) => {
              dispatch(logisticsChangeSelected({
                selected: { overview_selected: { ...selected.overview_selected, period_driver_selected: item } }
              }))
            }}
            value={period_driver_selected || []} />
        </Col>
        <Col xl="3" md="3" style={{ marginTop: "21px" }}>
          <button
            style={vehicleRouteOnMapButtonStyle}
            onClick={() => onClickRegisterDriver()} >
            <Icon icon={"plus"} width={'15px'} height={'16px'} color='#fff' divProps={{ margin: "0px 5px" }} />
              <Text color={"#fff"} fontSize={"14px"} >
                  {localizedStrings.logisticService.addDriver}
              </Text>
          </button>
        </Col>
      </Row>
      <div>
          <hr></hr>
          <div>
              {
                hasServicesDrivers &&
                  <VirtualizedTable
                      name={'LogistcServiceDrivers'}
                      style={{ marginTop: "14px" }}
                      data={services_drivers}
                      columns={tableColumns}
                  />
              }
          </div>
          {
              (!hasServicesDrivers) &&
              <EmptyStateContainer
                  title={localizedStrings.logisticService.noServiceDriversFound}
              />
          }
      </div>
    </>
  );
}
