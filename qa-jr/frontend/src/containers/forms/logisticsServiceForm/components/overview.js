import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { loadVehicles, logisticsChangeSelected, loadClients, loadTypeServices, loadDestiny, logisticsChangeSelectors, setChangeSelectorDaysOfWeeks } from "store/modules";
import {  Select, Col, DateInput, Switch, AsyncSelect, ButtonWithIcon, Modal, CardInput, HelpIconWithTooltip, Link } from "components";
import { TypeServiceForm } from "containers/forms";
import { MAX_LIMIT_FOR_SELECTORS } from "constants/environment";
import { differenceInDays } from "date-fns";
import { Title } from '../../../../components/title/style'

export default function Overview({ inputsConfig, onChanges, errors, pageEdit }) {
    
  const dispatch = useDispatch();

  const {
    selectors,
    selected,
    types_services,
    loading_destiny,
    loading_type_service,
  } = useSelector(state => state.logisticsServices);

  const {
    loadLoadingDestiny
  } = loading_destiny;

  const {
    loadLoadingTypeService
  } = loading_type_service;

  const {
    loadLoading: loadLoadingClients,
    clients
  } = useSelector(state => state.clients);

  // eslint-disable-next-line
  const [loadingDestiny, setLoadingDestiny] = useState({
    inicial: false,
    end: false, 
  });

  const [limitDaysOfWeek, setPermitedSelectDays] = useState(0)

  const [typeSwitchState, setTypeSwitch] = useState(true);

  const [hideHourReturn, setHideHourReturn] = useState(true);

  const [openCreateTypeService, setOpenCreateTypeService ] = useState(false);
  
  // eslint-disable-next-line
  const [modalErrors, setModalErrors] = useState({ errors_modal: {
    type_service_name: {
      has_error: false,
      message: "",
    },
    idle_time: {
      has_error: false,
      message: "",
    },
  } });

  const {
    overview_selectors: {
      selector_days_of_weeks,
      selector_hour_going,
      selector_inicial_destiny,
      selector_end_destiny,
      selector_days_of_weeks_driver
    }
  } = selectors;

  let {
    overview_selected: {
      status,
      type_service_selected,
      wating_time_selected,
      clients_selected,
      vehicles_selected,
      days_of_weeks_selected,
      hour_going_selected,
      inicial_destiny_selected,
      end_destiny_selected,
      type_selected,
      start_date_selected,
      end_date_selected
    },
  } = selected;
  
  useEffect(() => {
    const has_selector_inicial_destiny = selector_inicial_destiny !== undefined;
    if(has_selector_inicial_destiny) {
      setLoadingDestiny({ inicial: false });
    }
  }, [selector_inicial_destiny]);

  useEffect(() => {
    const has_selector_end_destiny = selector_end_destiny !== undefined;
    if(has_selector_end_destiny) {
      setLoadingDestiny({ end: false });
    }
  }, [selector_end_destiny]);

  const {
    user: {
      organization_id,
    }
  } = useSelector(state => state.auth)

  const {
    vehicles,
    loadLoading: loadSelectVehicles,
  } = useSelector(state => state.vehicles);

  const loadOrganizationVehicles = () => {
    dispatch(loadVehicles({
      limit: MAX_LIMIT_FOR_SELECTORS,
      offset: 0,
      search_term: "",
      organization_id,
      status: [1]
    }));
  }

  const loadOrganizationClients = () => {
    dispatch(loadClients({
      limit: MAX_LIMIT_FOR_SELECTORS,
      offset: 0,
      search_term: "",
      organization_id,
    }));
  }

  const loadOrganizationTypeServices = () => {
    dispatch(loadTypeServices({
      limit: MAX_LIMIT_FOR_SELECTORS,
      offset: 0,
      search_term: "",
      organization_id
    }));
  }

  const loadServiceDestiny = () => {
    dispatch(loadDestiny({
      limit: MAX_LIMIT_FOR_SELECTORS,
      offset: 0,
    }))
  }

  useEffect(() => {

    loadOrganizationTypeServices();

    loadOrganizationVehicles();

    loadOrganizationClients();

    loadServiceDestiny();
    // eslint-disable-next-line
  }, []);

  const handleDate = (fields, data) => {
    const hasPeriod = data.startDate && data.endDate;
    if (hasPeriod) {
      dispatch(logisticsChangeSelected({ selected: { overview_selected: { ...selected.overview_selected, start_date_selected: data.startDate, end_date_selected: data.endDate, } } }));
    }
  }



  const DatePickerStartEnd = () => {
    try {
    
    let start_date = "";

    const has_selected_new_start_date = start_date_selected.length === 10;
    const has_selected_new_end_date = end_date_selected.length === 10;

    if(has_selected_new_start_date) {
        start_date = new Date(start_date_selected + "T06:00:00");
    }

    if(has_selected_new_end_date) {
        end_date_selected = end_date_selected + "T06:00:00";
    }
    
    if(has_selected_new_start_date === false) {
        const [start_date_without_time, ] = start_date_selected.toISOString().split("T");
        start_date = new Date(start_date_without_time + "T06:00:00");
    }
    
    return(
    
    <DateInput
      type={'dateRangePicker'}
      label={localizedStrings.logisticService.selectPeriodStartEnd}
      error={errors.overview.start_date_selected_error.error}
      errorText={errors.overview.start_date_selected_error.message}
      onChange={handleDate}
      name={"period"}
      id={"period"}
        divStyles={{
          "& *": {
            zIndex: "5"
          }
        }}
      placeholder={"dd/mm/aaaa"}
      value={[start_date_selected, end_date_selected]}
      hasDefaultValue={false}
      buttonsSelections={false}
      calendar={{
        minDate: start_date,
      }}
      icon={<HelpIconWithTooltip
        text={[
            localizedStrings.logisticService.timeInicialFinalDestinyInfo,
            <Link
              href={
                localizedStrings.logisticService.timeInicialFinalDestinyInfoLink  
              }
              target={"_blank"}
            >
              {" "}
              {localizedStrings.learnMore}
            </Link>
        ]} />}
    />
  );
    } catch (error) {
      console.log(error);
    }
  }

  const onCancel = () => setOpenCreateTypeService(false);

  useEffect(() => {

    const has_selected_new_start_date = start_date_selected.length === 10;
    const has_selected_new_end_date = end_date_selected.length === 10;

    const start = {
      start_year: "",
      start_month: "",
      start_day: "",
    }

    const end = {
      end_year: "",
      end_month: "",
      end_day: "",
    }

    if(has_selected_new_start_date) {
      const [start_year, start_month, start_day] = start_date_selected.split("-");
      start.start_year = start_year;
      start.start_month = start_month;
      start.start_day = start_day;
    }

    if(has_selected_new_start_date === false) {
      const [date , ] = new Date(start_date_selected).toISOString().split("T");
      const [start_year, start_month, start_day] = date.split("-");
      start.start_year = start_year;
      start.start_month = start_month;
      start.start_day = start_day;
    }

    if(has_selected_new_end_date) {
      const [end_year, end_month, end_day] = end_date_selected.split("-");
      end.end_year = end_year;
      end.end_month = end_month;
      end.end_day = end_day;
    }

    if(has_selected_new_end_date === false) {
      const [date , ] = new Date(end_date_selected).toISOString().split("T");
      const [end_year, end_month, end_day] = date.split("-");
      end.end_year = end_year;
      end.end_month = end_month;
      end.end_day = end_day;
    }

    const permited = differenceInDays(
      new Date(end.end_year, end.end_month, end.end_day, 0, 0, 0),
      new Date(start.start_year, start.start_month, start.start_day, 0, 0 ,0)
    );

    const permited_to_select_days = permited + 1;

    setPermitedSelectDays(permited_to_select_days);

    const remove_days = days_of_weeks_selected?.length - permited_to_select_days;

    const has_more_days_than_permited = remove_days > 0;

    if(has_more_days_than_permited) {

      for (let index = 0; index < remove_days; index++) {
        days_of_weeks_selected.pop();
        selector_days_of_weeks_driver.pop();
      }

      dispatch(logisticsChangeSelected({
        selected: { overview_selected: { ...selected.overview_selected, days_of_weeks_selected: days_of_weeks_selected } }
      }));

      dispatch(logisticsChangeSelectors({ 
        selectors: {
          overview_selectors: {
            ...selectors.overview_selectors,
            selector_days_of_weeks_driver: selector_days_of_weeks_driver
          }
        }
      }));

    }
    // eslint-disable-next-line
  }, [start_date_selected, end_date_selected])

  useEffect(() => {

    
    const has_zero_days = days_of_weeks_selected?.length === 0;
    const is_more_than_limit = days_of_weeks_selected?.length >= limitDaysOfWeek;

    if(is_more_than_limit && has_zero_days === false) {

      dispatch(setChangeSelectorDaysOfWeeks({ clean_selector_days_of_weeks: true }));

      DaysOfTheWeek();
      return;
    }

    dispatch(setChangeSelectorDaysOfWeeks({ clean_selector_days_of_weeks: false }));

    DaysOfTheWeek();
    // eslint-disable-next-line
  }, [days_of_weeks_selected, limitDaysOfWeek]);

  useEffect(() => {
    DaysOfTheWeek();
    // eslint-disable-next-line
  }, [days_of_weeks_selected, selector_days_of_weeks])


  const DaysOfTheWeek = () => {
    
    return(
    
      <Select
      title={localizedStrings.logisticService.daysOfTheWeek}
      required={false}
      options={selector_days_of_weeks}
      error={errors.overview.days_of_weeks_selected_error.error}
      errorText={errors.overview.days_of_weeks_selected_error.message}
      placeholder={localizedStrings.logisticService.daysOfTheWeekPlaceholder}
      onChange={(item) => {
        dispatch(logisticsChangeSelected({
          selected: { overview_selected: { ...selected.overview_selected, days_of_weeks_selected: item } }
        }))
        dispatch(logisticsChangeSelectors({ 
          selectors: {
            overview_selectors: {
              ...selectors.overview_selectors,
              selector_days_of_weeks_driver: item
            }
          }
        }))
      }}
      isMulti={true}
      value={days_of_weeks_selected || []} 
      icon={<HelpIconWithTooltip
          text={[
              localizedStrings.logisticService.daysOfTheWeekInfo,
              <Link
                      href={
                        localizedStrings.logisticService.daysOfTheWeekInfoLink  
                      }
                      target={"_blank"}
                    >
                      {" "}
                      {localizedStrings.learnMore}
                    </Link>
          ]} />}
      />
  );
  }

  return (
    <>
      <Modal
        height={"300px"}
        width={"388px"}
        open={openCreateTypeService}
        setOpen={setOpenCreateTypeService}
        header={TypeServiceForm({ onCancel })} />
      <Row>
        <Col xl="6" xxl="6">
          <CardInput style={{ margin: "0px" }}
            register={inputsConfig.register}
            onChange={inputsConfig.setValue}
            inputs={[
              {
                label: localizedStrings.logisticService.name,
                name: "name",
                type: "text",
                required: false,
                defaultValue: inputsConfig.getValues()?.name,
                error: errors.overview.name_error.error,
                errorText: errors.overview.name_error.message,
              },
            ]}
          />
        </Col>
        <Col xl="6" xxl="6">
          <Select
            title={localizedStrings.logisticService.client_name}
            required={false}
            error={errors.overview.clients_selected_error.error}
            errorText={errors.overview.clients_selected_error.message}
            loading={loadLoadingClients}
            options={clients?.map(client => ({ label: client.company_name, value: client.id }))}
            placeholder={localizedStrings.logisticService.clientPlaceholder}
            onChange={(item) => {
              dispatch(logisticsChangeSelected({
                selected: { overview_selected: { ...selected.overview_selected, clients_selected: item, } }
              }))
            }}
            value={clients_selected || {}}
          />
        </Col>

      </Row>
      <Row>
      <Col xl="5" xxl="5">
          <Select
            title={localizedStrings.logisticService.serviceType}
            required={false}
            icon={<HelpIconWithTooltip
            text={[
                localizedStrings.logisticService.typeServiceInfo,
                <Link
                  href={
                    localizedStrings.logisticService.typeServiceInfoLink
                  }
                  target={"_blank"}
                >
                  {" "}
                  {localizedStrings.learnMore}
                </Link>
            ]} />}
            error={errors.overview.type_service_selected_error.error}
            errorText={errors.overview.type_service_selected_error.message}
            loading={loadLoadingTypeService}
            options={types_services.map(type => ({ label: type.name, value: type.id }))}
            placeholder={localizedStrings.logisticService.placeholderServiceType}
            onChange={(item) => {
              const type_service = types_services?.find(service => service.id === item.value) || 0;
              dispatch(logisticsChangeSelected({
                selected: { overview_selected: { ...selected.overview_selected, type_service_selected: item, wating_time_selected: (type_service.idle_time || 0) + localizedStrings.logisticService.minutes } }
              }));
            }}
            value={type_service_selected || {}}
          />
        </Col>
        <Col xl="1" xxl="1">
        <ButtonWithIcon
            icon={"plus"}
            customIconColor={"#868E96"}
            borderRadius={"18px"}
            customBackgroundColor={"#DDDDDD"}
            minWidth={"38px"}
            marginTop={"24px"}
            border={"1px solid transparent"}
            borderColor={"#868E96"}
            onClick={e => {
              e.persist();
              setOpenCreateTypeService(true);
            }}
          />
        </Col>
        <Col xl="6" xxl="6">
          <CardInput style={{margin: "0px"}}
            inputs={[
                {
                  label: localizedStrings.logisticService.waitingTime,
                  name: "idle_time",
                  type: "text",
                  required: false,
                  defaultValue: wating_time_selected,
                  value: wating_time_selected,
                  readOnly: true,
                  icon: (
                    <HelpIconWithTooltip
                      text={[
                        localizedStrings.logisticService.departureReturnInfo,
                        <Link
                        href={
                          localizedStrings.logisticService.departureReturnInfoLink  
                        }
                        target={"_blank"}
                      >
                        {" "}
                        {localizedStrings.learnMore}
                      </Link>
                  ]} />
                )
                },
              ]}
          />
        </Col>
     </Row>
     <Row>
     <Col xl="6" xxl="6">
          <Select
        title={localizedStrings.logisticService.vehicle_name}
        required={false}
        error={errors.overview.vehicles_selected_error.error}
        errorText={errors.overview.vehicles_selected_error.message}
        loading={loadSelectVehicles}
        options={vehicles?.map?.(vehicle => ({ label: vehicle.name, value: vehicle.id }))}
        placeholder={localizedStrings.logisticService.vehiclePlaceholder}
        onChange={(item) => {
          dispatch(logisticsChangeSelected({
            selected: { overview_selected: { ...selected.overview_selected, vehicles_selected: item } }
          }))
        }}
        value={vehicles_selected || {}} />
        </Col>
        <Col xl="6" xxl="6">
          <DatePickerStartEnd />
        </Col>
      </Row>
      <Row>

       <Col xl="6" xxl="6">
        <DaysOfTheWeek />
        </Col>
        <Col xl="2" xxl="2" style={{ marginTop: "30px", paddingRight: "0px" }}>
          <Switch
            text={type_selected ? localizedStrings.logisticService.going : localizedStrings.logisticService.goback}
            checked={selected.overview_selected.type_selected}
            onCheck={() => {
              setTypeSwitch(!typeSwitchState)
              setHideHourReturn(!hideHourReturn);
              dispatch(logisticsChangeSelected({
                selected: { overview_selected: { ...selected.overview_selected, type_selected: !hideHourReturn, } }
              }));
            }}
            icon={<HelpIconWithTooltip
              text={[
                localizedStrings.logisticService.activeGoingEndDestinyInfo,
                <Link
                  href={
                    localizedStrings.logisticService.activeGoingEndDestinyInfoLink
                  }
                  target={"_blank"}
                >
                  {" "}
                  {localizedStrings.learnMore}
                </Link>
              ]} />}
          />
        </Col>
        <Col xl="2" xxl="2" style={{ paddingLeft: "0px" }}>
          <Select
            title={type_selected ? localizedStrings.logisticService.hour_departure : localizedStrings.logisticService.hour_return}
            required={false}
            icon={<HelpIconWithTooltip
              text={[
                localizedStrings.logisticService.activeGoingEndDestinyInfo,
                <Link
                  href={
                    localizedStrings.logisticService.activeGoingEndDestinyInfoLink
                  }
                  target={"_blank"}
                >
                  {" "}
                  {localizedStrings.learnMore}
                </Link>
              ]} />}
            options={selector_hour_going}
            error={errors.overview.hour_going_selected_error.error}
            errorText={errors.overview.hour_going_selected_error.message}
            onChange={(item) => {
              dispatch(logisticsChangeSelected({
                selected: { overview_selected: { ...selected.overview_selected, hour_going_selected: item } }
              }))
            }}
            placeholder={localizedStrings.logisticService.hourPlaceholder}
            value={hour_going_selected || {}} />
        </Col>
      </Row>
      <Row>
       <Col xl="6" xxl="6">
     <AsyncSelect
            options={selector_inicial_destiny}
            error={errors.overview.inicial_destiny_selected_error.error}
            errorText={errors.overview.inicial_destiny_selected_error.message}
            title={localizedStrings.logisticService.inicial_destiny}
            required={false}
            loading={loadLoadingDestiny}
            onChange={(item) => {
              dispatch(logisticsChangeSelected({
                selected: { overview_selected: { ...selected.overview_selected, inicial_destiny_selected: item } }
              }))
            }}
            value={inicial_destiny_selected || {}}
            icon={<HelpIconWithTooltip
            text={[
                localizedStrings.logisticService.inicialDestinyInfo,
                <Link
                        href={
                          localizedStrings.logisticService.inicialDestinyInfoLink  
                        }
                        target={"_blank"}
                      >
                        {" "}
                        {localizedStrings.learnMore}
                      </Link>
            ]} />}
          />
        </Col>
        <Col xl="6" xxl="6">
          <AsyncSelect
            cacheOptions
            options={selector_end_destiny}
            defaultOptions
            error={errors.overview.end_destiny_selected_error.error}
            errorText={errors.overview.end_destiny_selected_error.message}
            title={localizedStrings.logisticService.end_destiny}
            required={false}
            loading={loadLoadingDestiny}
            onChange={(item) => {
              dispatch(logisticsChangeSelected({
                selected: { overview_selected: { ...selected.overview_selected, end_destiny_selected: item } }
              }))
            }}
            value={end_destiny_selected || {}}
            icon={<HelpIconWithTooltip
              text={[
                localizedStrings.logisticService.endDestinyInfo,
                <Link
                  href={
                    localizedStrings.logisticService.endDestinyInfoLink
                  }
                  target={"_blank"}
                >
                  {" "}
                  {localizedStrings.learnMore}
                </Link>
              ]} />}
          />
        </Col>
      </Row>
    { status && <Row>
      
      <Col xl="6" xxl="6">
         <Col style={{marginBottom: "0px;"}}>
         <Row >
            <Title>{localizedStrings.logisticService.thisLogisticServiceStatus}</Title>
            <HelpIconWithTooltip
                  text={[localizedStrings.logisticService.service_edit.deactivateToolTip]} />
          </Row></Col>
          <Switch
            text={status === 'active'?
             localizedStrings.logisticService.service_edit.activatedStatus
             : localizedStrings.logisticService.service_edit.deactivatedStatus}
            checked={status === 'active'}
            onCheck={() => {
              dispatch(logisticsChangeSelected({
                selected: { overview_selected: { ...selected.overview_selected, status:status === 'active' ? 'inactive':'active' } }
              }))
            }}
          />
        </Col>
      </Row> }
    </>
  );
}