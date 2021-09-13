import React, { useState, useEffect } from "react";
import { BottomActionButtons, Tabs } from "components";
import { localizedStrings } from "constants/localizedStrings";
import Tab1 from "./components/Tab1";
import Tab2 from "./components/Tab2";
import Tab3 from "./components/Tab3";
import { useDispatch, useSelector } from "react-redux";
import { solicitationChangeSelectors, solicitationChangeOperationStates } from "store/modules";
import { SOLICITATIONS_MANAGE_PATH } from "constants/paths";

const { findFieldError, Tab, handleTabs, thereTabError } = Tabs;

export default function SolicitationForm({
  history,
  title,
  onSubmit,
  inputsConfig,
  onSave = () => { },
  ...options
}) {
  const dispatch = useDispatch();
  const [inputsForm, setInputConfig] = useState(inputsConfig);
  const [solicitation, setSolicitation] = useState(inputsConfig.getValues());
  const {
    selectors,
    createLoading,
    editLoading,
  } = useSelector(state => state.solicitations);
  const [fieldsToValidate,] = useState([
    [
      "descr",
      "start_time",
      "end_time",
    ],
    [
      "vehicles"
    ],
    [
      "drivers"
    ],
  ]);

  const returnToManageScreen = () => {
    dispatch(solicitationChangeSelectors({}, true));
    dispatch(solicitationChangeOperationStates({}));
    history.push(SOLICITATIONS_MANAGE_PATH);
  }

  const [errors, setErrors] = useState({
    0: {
      descr: {
        message: "",
        error: false
      },
      start_time: {
        message: "",
        error: false
      },
      end_time: {
        message: "",
        error: false
      },
    },
    1: {
      vehicles: {
        message: "",
        error: false
      },
    },
    2: {
      drivers: {
        message: "",
        error: false
      },
    },
  });

  const [tabComponent, setTabComponent] = useState({
    tabs: [
      {
        active: true,
        name: localizedStrings.editVehicleSolicitations,
        error: false,
        Component: () => (
          <Tab1
            inputsConfig={inputsForm}
            solicitation={solicitation}
            errors={errors[0]}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.associatedVehicle,
        error: false,
        Component: () => (
          <Tab2
            inputsConfig={inputsForm}
            solicitation={solicitation}
            errors={errors[1]}
            history={history}
          />
        )
      },
      {
        active: false,
        name: localizedStrings.associatedDriver,
        error: false,
        Component: () => (
          <Tab3
            inputsConfig={inputsForm}
            solicitation={solicitation}
            errors={errors[2]}
          />
        )
      },
    ],
    tabActive: 0
  });

  useEffect(() => {
    setInputConfig(inputsConfig);
    setTabComponent(tabComponent);
    setSolicitation({
      ...inputsConfig.values,
    });
    // eslint-disable-next-line
  }, [inputsConfig.inputs]);

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
      // eslint-disable-next-line
      fields.map(field => {
        const [
          fieldValue,
          selectorValue
        ] = [
            inputsConfig.getValues()?.[field] ?? "",
            selectors[field]
          ];

        const hasValue = fieldValue.toString().trim() || selectorValue?.length;
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

  function handleSubmit() {
    const [
      tab1, tab2, tab3
    ] = [0, 1, 2];
    handleErrorTab({ fields: fieldsToValidate[tab1], indexTab: tab1 });
    handleErrorTab({ fields: fieldsToValidate[tab2], indexTab: tab2 });
    handleErrorTab({ fields: fieldsToValidate[tab3], indexTab: tab3 });

    if (!thereTabError(tabComponent)) onSave(solicitation);
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
        loading={inputsConfig.pageEdit ? editLoading : createLoading}
      />
    </>
  );
}
