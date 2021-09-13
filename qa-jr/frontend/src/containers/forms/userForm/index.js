import React, { useState, useEffect } from "react";
import { BottomActionButtons, Tabs } from "components";
import { useHistory } from "react-router-dom";
import { localizedStrings } from "constants/localizedStrings";
import Tab1 from "./components/Tab1";
import Tab2 from "./components/Tab2";
import Tab3 from "./components/Tab3";
import { useSelector } from "react-redux";
const { findFieldError, Tab, handleTabs, thereTabError } = Tabs;
const [
  tab1, tab2, tab3
] = [0, 1, 2];
export default function UserForm({
  inputsConfig,
  onSave = () => { },
	initialValue,
}) {
  const history = useHistory();
  const {
    selectors,
  } = useSelector(state => state.users);
  const [user] = useState(inputsConfig.getValues());
  const [fieldsToValidate,] = useState([
    [
      "email",
      "name",
      "phone",
      "type",
      "country",
      "language",
    ],
    [
      "short_date_format",
      "short_time_format",
      "timezone",
    ],
    [
      "decimal_separators",
      "thousands_separators",
      "distance_unit",
      "currency",
      "volumetric_measurement_unit",
    ]
  ]);
  const [errors, setErrors] = useState({
    0: {
      email: {
        message: "",
        error: false,
      },
      name: {
        message: "",
        error: false,
      },
      phone: {
        message: "",
        error: false,
      },
      type: {
        message: "",
        error: false,
      },
      country: {
        message: "",
        error: false,
      },
      language: {
        message: "",
        error: false,
      },
      password: {
        message: "",
        error: false,
      },
      passwordRepeat: {
        message: "",
        error: false,
      },
    },
    1: {
      short_date_format: {
        message: "",
        error: false,
      },
      short_time_format: {
        message: "",
        error: false,
      },
      timezone: {
        message: "",
        error: false,
      },
    },
    2: {
      decimal_separators: {
        message: "",
        error: false,
      },
      thousands_separators: {
        message: "",
        error: false,
      },
      distance_unit: {
        message: "",
        error: false,
      },
      currency: {
        message: "",
        error: false,
      },
      volumetric_measurement_unit: {
        message: "",
        error: false,
      },
    },
  });

  const [tabComponent, setTabComponent] = useState({
    tabs: [
      {
        active: true,
        name: localizedStrings.userData,
        error: false,
        Component: () => (
          <Tab1
						initialValue={initialValue}
            inputsConfig={inputsConfig}
            user={user}
            errors={errors[tab1]}
            onChanges={{
              handleInput: inputsConfig.setValue,
            }}
          />
        ),
      },
      {
        active: false,
        name: localizedStrings.dateAndHour,
        error: false,
        Component: () => (
          <Tab2
            inputsConfig={inputsConfig}
            user={user}
            errors={errors[tab2]}
            onChanges={{
              handleInput: inputsConfig.setValue,
            }}
          />
        ),
      },
      {
        active: false,
        name: localizedStrings.currencyDecimalsUnits,
        error: false,
        Component: () => (
          <Tab3
            inputsConfig={inputsConfig}
            user={user}
            errors={errors[tab3]}
            onChanges={{
              handleInput: inputsConfig.setValue,
            }}
          />
        ),
      },
    ],
    tabActive: 0,
  });

  useEffect(() => {
    setTabComponent(tabComponent);
    // eslint-disable-next-line
  }, [inputsConfig]);

  const checkPassword = ({ password, passwordRepeat }) => password === passwordRepeat

  const showError = (field, indexTab, message = localizedStrings.fieldRequired) => {
    if (!errors[indexTab][field]) return;
    errors[indexTab][field].message = message;
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
      checkPassword(inputsConfig.getValues())
        ? clearError("passwordRepeat", 0)
        : showError("passwordRepeat", 0, localizedStrings.passwordWrong)
      // eslint-disable-next-line
      fields.map(field => {
        const [
          fieldValue,
          selectorValue
        ] = [
            inputsConfig.getValues()?.[field] ?? "",
            selectors[field]
          ];

        const hasValue = fieldValue.toString().trim() || selectorValue;
        hasValue
          ? clearError(field, indexTab)
          : showError(field, indexTab)
      })
      findFieldError(errors[indexTab], indexTab, tabComponent, setTabComponent);
      setErrors({ ...errors });
    } catch (error) {
      console.log(error);
    }

  }

  function handleSubmit() {
    handleErrorTab({ fields: fieldsToValidate[tab1], indexTab: tab1 });
    handleErrorTab({ fields: fieldsToValidate[tab2], indexTab: tab2 });
    handleErrorTab({ fields: fieldsToValidate[tab3], indexTab: tab3 });

    if (!thereTabError(tabComponent)) onSave(user);
  }

  return (
    <>
      <Tab
        handleTabs={(index) => handleTabs(index, tabComponent, setTabComponent)}
        tabComponent={tabComponent}
      />
      <BottomActionButtons
        onSave={handleSubmit}
        loading={inputsConfig.loading}
        formId={"user"}
        onCancel={() => history.goBack()}
      />
    </>
  );
}
