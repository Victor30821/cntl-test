import React, { useState, useEffect } from "react";
import { BottomActionButtons, Tabs } from "components";
import { localizedStrings } from "constants/localizedStrings";
import Overview from "./components/overview";
import Drivers from "./components/drivers";
import StopPlaces from "./components/stopPlaces";
import RouteMap from "./components/routeMap";
import ClientLink from "./components/clientLink";
import { LOGISTICS_SERVICES_PATH } from 'constants/paths';
import { useDispatch, useSelector } from "react-redux";
import { setActiveFitBounce } from "store/modules";
import { isDate } from "date-fns";
const { Tab, handleTabs } = Tabs;

export default function LogisticsServiceForm({
  history,
  title,
  onSubmit,
  inputsConfig,
  fail,
  onFail,
  onSave,
  ...options
}) {

  const dispatch = useDispatch();

  const {
    selected,
    services_drivers,
    services_places
  } = useSelector(state => state.logisticsServices);

  const [fieldsToValidate,] = useState([
    [
      "name_error",
      "type_service_selected_error",
      "watiting_time_selected_error",
      "clients_selected_error",
      "vehicles_selected_error",
      "days_of_weeks_selected_error",
      "hour_deperture_selected_error",
      "start_date_selected_error",
      "end_date_selected_error",
      "inicial_destiny_selected_error",
      "end_destiny_selected_error",
    ],
  ]);

  //
  const [errors, setErrors] = useState({
    overview: {
      overview_tab: {
        error: false,
      },
      name_error: {
        message: "",
        error: false
      },
      type_service_selected_error: {
        message: "",
        error: false
      },
      wating_time_selected_error: {
        message: "",
        error: false
      },
      clients_selected_error: {
        message: "",
        error: false
      },
      vehicles_selected_error: {
        message: "",
        error: false
      },
      start_date_selected_error: {
        message: "",
        error: false,
      },
      end_date_selected_error: {
        message: "",
        error: false
      },
      days_of_weeks_selected_error: {
        message: "",
        error: false
      },
      inicial_destiny_selected_error: {
        message: "",
        error: false
      },
      end_destiny_selected_error: {
        message: "",
        error: false
      },
      hour_going_selected_error: {
        message: "",
        error: false
      }
    },
    drivers: {
      message: "",
      error: false,
      service_driver_selected_error: {
        message: "",
        error: false
      },
      days_of_weeks_driver_selected_error: {
        message: "",
        error: false
      },
      period_driver_selected_error: {
        message: "",
        error: false
      },
    },
    stop_places: {
      message: "",
      error: false,
      places_depature: {
        message: "",
        error: false,
      }
    },
  });

  const [tabComponent, setTabComponent] = useState({
    tabs: [
      {
        active: true,
        name: localizedStrings.logisticService.overview,
        error: errors.overview.overview_tab.error,
        Component: () => (
          <Overview
            inputsConfig={inputsConfig}
            errors={errors}
            pageEdit={inputsConfig.pageEdit}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.logisticService.drivers,
        error: errors.drivers.error,
        Component: () => (
          <Drivers
            inputsConfig={inputsConfig}
            errors={errors}
            setErrors={setErrors}
            history={history}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.logisticService.stopPlaces,
        error: errors.stop_places.error,
        Component: () => (
          <StopPlaces
            inputsConfig={inputsConfig}
            errors={errors}
            history={history}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.logisticService.routeMap,
        error: false,
        style: {
          padding: "0px",
        },
        Component: () => (
          <RouteMap
            inputsConfig={inputsConfig}
            history={history}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.logisticService.clientLink,
        error: false,
        Component: () => (
          <ClientLink
            inputsConfig={inputsConfig}
            history={history}
          />
        )
      },
      // {
      //   active: false,
      //   name: localizedStrings.logisticService.serviceType,
      //   error: false,
      //   Component: () => (
      //     <ServiceType
      //       inputsConfig={inputsConfig}
      //       logisticsService={logisticsService}
      //       errors={errors[5]}
      //       onChanges={{
      //       //   handleInput: inputsConfig.setValue,
      //       }}
      //     />
      //   )
      // }
    ],
    tabActive: 0
  });

  useEffect(() => {
    const tabs = {
      routeMap: 3,
    }
    dispatch(setActiveFitBounce({ execute_fit_bounce: tabComponent.tabActive === tabs.routeMap }));
    // eslint-disable-next-line
  }, [tabComponent.tabActive])

  const showError = ({ field, indexTab }) => {

    if (!errors[indexTab][field]) return true;

    errors[indexTab][field].message = localizedStrings.fieldRequired;

    errors[indexTab][field].error = true;

    const has_tab_erros = tabComponent.tabs[0].error;
    if (has_tab_erros === false) {
      tabComponent.tabs[0].error = true;
    }
    return true;
  }

  const clearError = ({ field, indexTab }) => {

    if (!errors[indexTab][field]) return false;

    errors[indexTab][field].message = "";

    errors[indexTab][field].error = false;

    const has_tab_erros = tabComponent.tabs[0].error;
    if (has_tab_erros === true) {
      tabComponent.tabs[0].error = false;
    }
    return false;

  }

  const returnToManageScreen = () => {
    const origin = window.location.origin;
    const list_service_path = origin + LOGISTICS_SERVICES_PATH;
    window.location.assign(list_service_path);
  }

  const handleOverviewSelectedErrors = ({ indexTab }) => {

    const fieldNames = {
      ...selected?.overview_selected || {},
      ...inputsConfig.getValues() || {}
    };

    const filterByFirstTab = field => !!errors[indexTab][field + "_error"];

    const hasErrors = Object.keys(fieldNames)
      .filter(filterByFirstTab)
      .map(selected_overview_items => {
        try {

          const field = selected?.overview_selected[selected_overview_items] || inputsConfig.getValues()?.[selected_overview_items];

          const clearInputError = () => clearError({ field: selected_overview_items + '_error', indexTab });

          const setInputError = () => showError({ field: selected_overview_items + '_error', indexTab });

          const verificationByType = {
            string: () => field?.length > 0,
            array: () => field?.length > 0,
            object: () => Array.isArray(Object.keys(field)) &&
              (Object.keys(field)?.length > 0 || isDate(field)),
            undefined: () => false,
          }

          const fieldType = typeof field;

          const hasValue = verificationByType[fieldType]?.();

          if (hasValue) return clearInputError()

          return setInputError()


        } catch (error) {
          console.log(error);
          return false;
        }
      })

    tabComponent.tabs[0].error = hasErrors.some(Boolean);
  }

  const handleDriversSelectedErrors = () => {
    tabComponent.tabs[1].error = false;
    const has_drivers = Array.isArray(services_drivers) && services_drivers.length > 0;
    if (has_drivers === false) {
      tabComponent.tabs[1].error = true;
    }
  }

  const handleStopPlacesSelectedErrors = () => {

    tabComponent.tabs[2].error = false;

    errors.stop_places.places_depature.error = false;

    const has_places = Array.isArray(services_places) && services_places.length > 0;

    if (has_places === false) {
      tabComponent.tabs[2].error = true;
    }

    if(has_places) {

      const has_departure_fill = services_places.every(s => s?.departure?.length === "00:00".length);

      if(has_departure_fill === false) {
        tabComponent.tabs[2].error = true;
        // eslint-disable-next-line
        errors.stop_places.places_depature.error = true;
      }
    }
  }

  const handleErrorTab = ({ fields, indexTab }) => {
    try {
      // eslint-disable-next-line
      fields.map(field => {
        // eslint-disable-next-line
        if (!errors[indexTab][field]) return;
        errors[indexTab][field].error = false
      });

      handleOverviewSelectedErrors({ indexTab });
      handleDriversSelectedErrors();
      handleStopPlacesSelectedErrors();

    } catch (error) {
      console.debug(error);
    }
  }

  const handleSubmit = () => {

    const [
      overview,
    ] = [0];
    handleErrorTab({ fields: fieldsToValidate[overview], indexTab: "overview" });

    setErrors({ ...errors });

    setTabComponent(tabComponent);
    
    const has_erros_tab = tabComponent.tabs.some(tab => tab.error === true);

    if (has_erros_tab === false) onSave();
  }


  return (
    <>
      <Tab
        handleTabs={index => handleTabs(index, tabComponent, setTabComponent)}
        tabComponent={tabComponent}
      />
      <BottomActionButtons
        onSave={handleSubmit}
        onCancel={returnToManageScreen}
        cancelButtonStyle={{ zIndex: "4" }}
        saveButtonStyle={{ zIndex: "4" }}
      />
    </>
  );
}
