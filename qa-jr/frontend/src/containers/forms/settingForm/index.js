import React, { useState, useEffect } from "react";
import { BottomActionButtons, Text, Tabs, Link } from "components";
import { FailStateContainer } from "containers";
import { localizedStrings } from "constants/localizedStrings";
import Tab1 from "./components/Tab1";
import Tab2 from "./components/Tab2";
import { useHistory } from "react-router-dom";

let { findFieldError, Tab, handleTabs, thereTabError } = Tabs;

export default function SettingForm({
  title,
  onSubmit,
  inputsConfig,
  dropDownConfig,
  loadFail,
  onSave,
}) {
  let history = useHistory();
  let [inputsForm, setInputConfig] = useState(inputsConfig);
  let [organization, setOrganization] = useState({
    ...inputsConfig?.values,
    ...hasAddress(inputsConfig?.values?.addresses),
  });

  let [errors, setErrors] = useState({
    0: {
      country: {
        message: "",
        error: false,
      },
      currency: {
        message: "",
        error: false,
      },
    },
    1: {
      address1: {
        message: "",
        error: false,
      },
      number: {
        message: "",
        error: false,
      },
      neighborhood: {
        message: "",
        error: false,
      },
      city: {
        message: "",
        error: false,
      },
      state: {
        message: "",
        error: false,
      },
      zipcode: {
        message: "",
        error: false,
      },
    },
  });

  function sameAddress(bool) {
    let addressEmpty = {
      zipcode: "",
      address1: "",
      address2: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
    };

    if (bool) {
      organization.address2 = { ...organization.address1 };
    } else {
      organization.address2 = { ...addressEmpty };
    }

    organization.isSameAddress = bool;

    setOrganization({ ...organization });
  }

  function isEqual(address1, address2) {
    let isSameAddress = true;

    if (
      address1.address !== address2.address ||
      address1.city !== address2.city ||
      address1.number !== address2.number ||
      address1.state !== address2.state ||
      address1.zipcode !== address2.zipcode ||
      address1.neighborhood !== address2.neighborhood
    ) {
      isSameAddress = false;
    }

    return isSameAddress;
  }

  function hasAddress(addresses) {
    let address1 = {};
    let address2 = {};

    if (addresses.length > 1) {
      address1 = addresses[0];
      address2 = addresses[1];
    } else if (addresses.length > 0) {
      address1 = addresses[0];
    }

    return {
      address1,
      address2,
      isSameAddress: isEqual(address1, address2),
    };
  }

  useEffect(() => {
    setInputConfig(inputsConfig);
    setTabComponent(tabComponent);
    setOrganization({
      ...inputsConfig.values,
      ...hasAddress(inputsConfig.values.addresses),
    });
// eslint-disable-next-line
  }, [inputsConfig.inputs]);

  let [tabComponent, setTabComponent] = useState({
    tabs: [
      {
        active: true,
        name: localizedStrings.DataAndSettings,
        error: false,
        Component: () => (
          <Tab1
            inputsConfig={inputsForm}
            organization={organization}
            errors={errors[0]}
            onChanges={{
              handleCurrency,
              handleCountry,
            }}
          />
        ),
      },
      {
        active: false,
        name: localizedStrings.addresses,
        error: false,
        Component: () => (
          <Tab2
            inputsConfig={inputsForm}
            organization={organization}
            errors={errors[1]}
            onChanges={{
              handleCheckbox,
              handleAddress,
              handleZipCode,
              handleCity,
              handleState,
              handleNumber,
              handleNeighborHood,

              handle2Address,
              handle2ZipCode,
              handle2City,
              handle2State,
              handle2Number,
              handle2NeighborHood,
            }}
          />
        ),
      },
    ],
    tabActive: 0,
  });

  function handleErrorTab1() {
    let indexTab = 0;
    errors[indexTab].currency.error = false;
    errors[indexTab].country.error = false;

    if (!organization.currency) {
      errors[indexTab].currency.message = localizedStrings.fieldRequired;
      errors[indexTab].currency.error = true;
    }

    if (!organization.country) {
      errors[indexTab].country.message = localizedStrings.fieldRequired;
      errors[indexTab].country.error = true;
    }

    findFieldError(errors[indexTab], indexTab, tabComponent, setTabComponent);
    setErrors({ ...errors });
  }

  function handleErrorTab2() {
    let indexTab = 1;
    errors[indexTab].address1.error = false;
    errors[indexTab].number.error = false;
    errors[indexTab].city.error = false;
    errors[indexTab].state.error = false;
    errors[indexTab].neighborhood.error = false;
    errors[indexTab].zipcode.error = false;

    if (!organization.address1.address1) {
      errors[indexTab].address1.message = localizedStrings.fieldRequired;
      errors[indexTab].address1.error = true;
    }

    if (!organization.address1.number) {
      errors[indexTab].number.message = localizedStrings.fieldRequired;
      errors[indexTab].number.error = true;
    }

    if (!organization.address1.city) {
      errors[indexTab].city.message = localizedStrings.fieldRequired;
      errors[indexTab].city.error = true;
    }

    if (!organization.address1.state) {
      errors[indexTab].state.message = localizedStrings.fieldRequired;
      errors[indexTab].state.error = true;
    }

    if (!organization.address1.neighborhood) {
      errors[indexTab].neighborhood.message = localizedStrings.fieldRequired;
      errors[indexTab].neighborhood.error = true;
    }

    if (!organization.address1.zipcode) {
      errors[indexTab].zipcode.message = localizedStrings.fieldRequired;
      errors[indexTab].zipcode.error = true;
    }

    findFieldError(errors[indexTab], indexTab, tabComponent, setTabComponent);
    setErrors({ ...errors });
  }

  function handleSubmit() {
    handleErrorTab1();
    handleErrorTab2();
    if (!thereTabError(tabComponent)) {
      organization = { ...organization };

      organization.addresses[0] = organization.address1;

      if (
        !!Object.keys(organization.address2).find(
          (item) => !!organization.address2[item]
        )
      ) {
        if (organization.address1.id === organization.address2.id) {
          delete organization.address2.id;
        }
        organization.addresses[1] = organization.address2;
      }

      onSave(organization);
    }
  }

  function handleCurrency(data) {
    organization.currency = data.value;
    setOrganization({ ...organization });
  }

  function handleCountry(data) {
    organization.country = data.value;
    setOrganization({ ...organization });
  }

  function handleCheckbox(data) {
    sameAddress(data);
  }

  function handleAddress(key, value) {
    organization.address1.address1 = value;
    setOrganization({ ...organization });
  }
  function handleNumber(key, value) {
    organization.address1.number = value;
    setOrganization({ ...organization });
  }
  function handleCity(key, value) {
    organization.address1.city = value;
    setOrganization({ ...organization });
  }
  function handleState(key, value) {
    organization.address1.state = value;
    setOrganization({ ...organization });
  }
  function handleZipCode(key, value) {
    organization.address1.zipcode = value;
    setOrganization({ ...organization });
  }
  function handleNeighborHood(key, value) {
    organization.address1.neighborhood = value;
    setOrganization({ ...organization });
  }

  function handle2Address(key, value) {
    organization.address2.address1 = value;
    setOrganization({ ...organization });
  }
  function handle2Number(key, value) {
    organization.address2.number = value;
    setOrganization({ ...organization });
  }
  function handle2City(key, value) {
    organization.address2.city = value;
    setOrganization({ ...organization });
  }
  function handle2State(key, value) {
    organization.address2.state = value;
    setOrganization({ ...organization });
  }
  function handle2ZipCode(key, value) {
    organization.address2.zipcode = value;
    setOrganization({ ...organization });
  }
  function handle2NeighborHood(key, value) {
    organization.address2.neighborhood = value;
    setOrganization({ ...organization });
  }

  const onLoadFail = () => {
    return (
      <FailStateContainer
        title={title}
        titleError={localizedStrings.noOrganizationFound}
        subtitleError={
          <Text withLink>
            {localizedStrings.pleaseTryAgain}
            <Link onClick={() => window.location.reload()}>
              {localizedStrings.clickingHere}
            </Link>
          </Text>
        }
      />
    );
  };

  if (loadFail) return onLoadFail();

  return (
    <>
      <Tab
        handleTabs={(index) => handleTabs(index, tabComponent, setTabComponent)}
        tabComponent={tabComponent}
      />
      <BottomActionButtons
        onSave={handleSubmit}
        formId={"organization"}
        onCancel={() => history.goBack()}
      />
    </>
  );
}
