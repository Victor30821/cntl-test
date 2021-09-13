import React, { useState, useEffect } from "react";
import { BottomActionButtons, Tabs } from "components";
import { localizedStrings } from "constants/localizedStrings";
import Tab1 from "./components/Tab1";
import Tab2 from "./components/Tab2";
import Tab3 from "./components/Tab3";
import Tab4 from "./components/Tab4";
import Tab5 from "./components/Tab5";
import Tab6 from "./components/Tab6";
import { useDispatch, useSelector } from "react-redux";
import { vehicleChangeSelectors, vehicleChangeOperationStates, loadUsers } from "store/modules";
import { VEHICLES_MANAGE_PATH } from "constants/paths";
import { manager } from 'constants/environment'
import { toast } from "react-toastify";
import defaultValues from "./defaultValues";
import { getUrlParam } from "utils/params";
import controlledSelect from "components/controlledSelect";

const { findFieldError, Tab, handleTabs, thereTabError } = Tabs;

const verifyHoursError = hour => {
  const hasHours = hour && !!hour.to && !!hour.from;
  if (!hasHours) return false;
  const {
    to,
    from
  } = hour;
  const toInNumber = +String(to).replace(":", "")
  const fromInNumber = +String(from).replace(":", "");
  const fromIsBeforeTo = Number.isFinite(fromInNumber) && Number.isFinite(toInNumber) && fromInNumber < toInNumber;
  return fromIsBeforeTo
}
const verifyDaysError = day => !Array.isArray(day) || day.length !== 0

export default function VehicleForm({
  history,
  inputsConfig,
  vehicle,
  onSave = () => { },
}) {
  const dispatch = useDispatch();

	const {
		user: {
      organization_id,
			user_settings: {
				thousands_separators,
				decimal_separators
			}
		}
	} = useSelector(state => state.auth);

  const {
    createLoading,
    editLoading,
  } = useSelector(state => state.vehicles);

  const {
    users
  } = useSelector(state => state.users);

// eslint-disable-next-line
  const [fieldsToValidate] = useState([
    [
			"company_name",
      "name",
      "model",
      "plate_number",
      "tank_capacity",
      "liters_value",
      "average_fuel_km",
      "type_fuel_id",
      "type_vehicle_id",
    ], [
      "hours",
      "daysSelected",
    ], , ,
    ["icon", "type_vehicle_id"],
    ["email"]
  ]);

  const returnToManageScreen = () => {
    dispatch(vehicleChangeSelectors({}, true));
    dispatch(vehicleChangeOperationStates({}));
    history.push(VEHICLES_MANAGE_PATH);
  }

  const [errors, setErrors] = useState({
    0: {
      company_name: {
        message: "",
        error: false
      },
      pin: {
        message: "",
        error: false
      },
      name: {
        message: "",
        error: false
      },
      model: {
        message: "",
        error: false
      },
      plate_number: {
        message: "",
        error: false
      },
      tank_capacity: {
        message: "",
        error: false
      },
      liters_value: {
        message: "",
        error: false
      },
      average_fuel_km: {
        message: "",
        error: false
      },
      odometer: {
        message: "",
        error: false
      },
      type_fuel_id: {
        message: "",
        error: false
      },
      type_vehicle_id: {
        message: "",
        error: false
      },
      year_manufacturer: {
        message: "",
        error: false
      },
      default_driver: {
        message: "",
        error: false
      },
    },
    1: {
      speed: {
        message: "",
        error: false
      },
      idle: {
        message: "",
        error: false
      },
      hours: {
        message: "",
        error: false
      },
      daysSelected: {
        message: "",
        error: false
      }
    },
    2: {

    },
    3: {
      documentation_url: {
        message: "",
        error: false
      }
    },
    4: {
      groupFilter: {
        message: "",
        error: false
      },
      icon: {
        message: "",
        error: false
      },
      type_vehicle_id: {
        message: "",
        error: false
      }
    },
    5: {
      email: {
        message: "",
        error: false
      },
    },
  });

  const [tabComponent, setTabComponent] = useState({
    tabs: [
      {
        active: true,
        name: localizedStrings.vehicleData,
        error: false,
        Component: () => (
          <Tab1
            inputsConfig={inputsConfig}
            errors={errors[0]}
            vehicle={vehicle}
            history={history}
            handleSubmit={handleSubmit}
            onChanges={{
              handleInput: inputsConfig.setValue,
            }}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.eventsAndHoursOfUse,
        error: false,
        Component: () => (
          <Tab2
            vehicle={vehicle}
            inputsConfig={inputsConfig}
            errors={errors[1]}
            history={history}
            onChanges={{
              handleInput: inputsConfig.setValue,
            }}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.maintenance,
        error: false,
        Component: () => (
          <Tab3
            inputsConfig={inputsConfig}
            errors={errors[2]}
            onChanges={{
              handleInput: inputsConfig.setValue,
            }}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.documentation,
        error: false,
        Component: () => (
          <Tab4
            inputsConfig={inputsConfig}
            errors={errors[3]}
            onChanges={{
              handleInput: inputsConfig.setValue,
            }}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.mapVisualization,
        error: false,
        Component: () => (
          <Tab5
            inputsConfig={inputsConfig}
            errors={errors[4]}
            onChanges={{
              handleInput: inputsConfig.setValue,
              setSelection: inputsConfig.setSelection
            }}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.notifications,
        error: false,
        Component: () => (
          <Tab6
            inputsConfig={inputsConfig}
            errors={errors[5]}
            onChanges={{
              handleInput: inputsConfig.setValue,
            }}
          />
        )
      }
    ],
    tabActive: 0
  });

  const showError = (field, indexTab) => {
    if (!errors[indexTab][field]) return;
    errors[indexTab][field].message = localizedStrings.fieldRequired;
    errors[indexTab][field].error = true;
  }

  const clearError = (field, indexTab) => {
    if (!errors[indexTab][field]) return;
    errors[indexTab][field].message = "";
    errors[indexTab][field].error = false;
  }

  function handleErrorTab({
    fields, indexTab,
  }) {
    try {
      // eslint-disable-next-line
      fields.map(field => {
        // eslint-disable-next-line
        if (!errors[indexTab][field]) return;
        errors[indexTab][field].error = false
      });

      fields.map(field => {
        const [
          fieldValue,
        ] = [
            inputsConfig.getValues()?.[field] ?? "",
          ];

        const fieldCustomValidation = {
          [field]: value => value.toString().trim(),
          hours: value => Array.isArray(value) &&
            value
              .map(hours => hours.every(verifyHoursError))
              .every(Boolean),
          daysSelected: value => Array.isArray(value) &&
            value
              .map(days => days.some(verifyDaysError))
              .every(Boolean),
        }

        const hasValue = fieldCustomValidation[field](fieldValue);

        hasValue
          ? clearError(field, indexTab)
          : showError(field, indexTab)
      })

      findFieldError(errors[indexTab], indexTab, tabComponent, setTabComponent);
      setErrors({ ...errors });
    } catch (error) {
      console.debug(error);
    }

  }

  const validateInputs = () => {
		const LITERS_VALUE_MAX = 100;
		const AVERAGE_FUEL_MAX = 100;
		try {
			const vehicle = inputsConfig.getValues();
			const { liters_value, average_fuel_km } = vehicle;

			const unmaskedLitersValue = Number(
				liters_value.replace(thousands_separators, "").replace(decimal_separators, ".")
			);
			if (unmaskedLitersValue > LITERS_VALUE_MAX) {
    // eslint-disable-next-line
				throw {
					key: "liters_value",
					message: localizedStrings.errors.fuelPriceMax(decimal_separators),
				};
			}

			const unmaskedAverageFuel = Number(
				average_fuel_km.replace(thousands_separators, "").replace(decimal_separators, ".")
			);
			if (unmaskedAverageFuel > AVERAGE_FUEL_MAX) {
    // eslint-disable-next-line
				throw {
					key: "average_fuel_km",
					message: localizedStrings.errors.averageFuelMax(decimal_separators),
				};
			}

			return true;
		} catch (error) {
      console.log(error);
			toast.error(error?.message || localizedStrings.error.update.vehicle);
			return false;
		}
	};

  function handleSubmit() {
		const vehicle = inputsConfig.getValues();
		const { status, tank_capacity } = vehicle;

		const isDisablingVehicle = status === 0;
		const isThereTankCapacity = Number.isFinite(tank_capacity);

		if (isDisablingVehicle && !isThereTankCapacity) {
			inputsConfig.setValue('tank_capacity', 0);
		}

		if (isDisablingVehicle) {
			onSave();
		}

    const formIsValid = validateInputs();
    if (!formIsValid) return
    const [
      tab1, tab2, , , tab5,
      tab6,
    ] = [0, 1, 2, 3, 4, 5, 6];
    handleErrorTab({ fields: fieldsToValidate[tab1], indexTab: tab1 });
    handleErrorTab({ fields: fieldsToValidate[tab2], indexTab: tab2 });
    handleErrorTab({ fields: fieldsToValidate[tab5], indexTab: tab5 });
    handleErrorTab({ fields: fieldsToValidate[tab6], indexTab: tab6 });
    if (thereTabError(tabComponent)) {
      toast.error(`${localizedStrings.fillRequired} ${localizedStrings.fillMarkedInRed}`)
      return;
    }
    onSave();
  }

  useEffect(() => {
    const tabActive = history?.location.state?.tabActive;
    if(tabActive) handleTabs(tabActive, tabComponent, setTabComponent);
    // eslint-disable-next-line
  },[history.location.state?.tabActive]);

	const setDefaultInputValue = (name, defaultValue) => {
		const value = inputsConfig.getValues(name);
		if (!value) inputsConfig.setValue(name, defaultValue);
	};

  useEffect(() => {
    dispatch(
      loadUsers({
        limit: 10000,
        organization_id,
        status: 1
      })
    );
  },[])
  
	useEffect(() => {    
    setDefaultInputValue('liters_value', defaultValues.liters_value(decimal_separators));
    setDefaultInputValue('average_fuel_km', defaultValues.average_fuel_km(decimal_separators));
    setDefaultInputValue('type_fuel_id', inputsConfig.inputs.fuelTypeOptions.find(input => input.label === defaultValues.type_fuel_id));
      
    setDefaultInputValue('speed', defaultValues.speed);
    setDefaultInputValue('idle', defaultValues.idle);
      
    setDefaultInputValue('icon', inputsConfig.inputs.vehicleTypeOnMapOptions.find(input => input.label === defaultValues.icon));
     
    if(getUrlParam("tracker_serial_number") && getUrlParam("tracker_id")) {
      const trackerOnUrl = {label: getUrlParam("tracker_serial_number"), value: getUrlParam("tracker_id")}
      setDefaultInputValue('tracker_serial_number', trackerOnUrl)
    }

    const managers = users.filter(user => user.role_id == manager)
    const allEmails = [...new Set(managers.map(user => user.email))]
    const emails = allEmails.splice(0,20)

    if (emails.length > 0) {
			setDefaultInputValue('email',
				emails.map(email => ({label: email, value: email}))
			);
		}
	}, [users]);

  return (
    <>
      <Tab
        handleTabs={index => handleTabs(index, tabComponent, setTabComponent)}
        tabComponent={tabComponent}
      />
      <BottomActionButtons
        onSave={handleSubmit}
        onCancel={returnToManageScreen}
        loading={inputsConfig.pageEdit ? editLoading : createLoading}
      />
    </>
  );
}
