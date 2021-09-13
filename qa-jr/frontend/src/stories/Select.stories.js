import React, { useState } from "react";
import { Select } from "components";
import { action } from "@storybook/addon-actions";
export default {
  title: "Selects"
};

const options = [
  {
    value: 1,
    label: "Option 1"
  },
  {
    value: 2,
    label: "Option 2"
  }
];

export const SelectOne = () => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [visibleVehicles, setVisibleVehicles] = useState([
    {
      id: 1,
      name: "nome do veiculo 1"
    },
    {
      id: 2,
      name: "nome do veiculo 2"
    },
  ]);
  return (
    <Select
      style={{
        minWidth: "200px",
        marginRight: "10px"
      }}
      error={false}
      loading={false}
      title={"selecione algo"}
      value={selectedVehicles}
      options={visibleVehicles?.map(vehicle => {
        return {
          label: vehicle.name,
          value: vehicle.id
        }
      }) || []}
      onChange={val => {
        setSelectedVehicles(val);
        action("selected")
      }}
    />
  )
};

export const SelectMulti = () => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [visibleVehicles, setVisibleVehicles] = useState([
    {
      id: 1,
      name: "nome do veiculo 1"
    },
    {
      id: 2,
      name: "nome do veiculo 2"
    },
  ]);
  return (
    <Select
      style={{
        minWidth: "200px",
        marginRight: "10px"
      }}
      isMulti
      error={false}
      loading={false}
      title={"selecione algo"}
      value={selectedVehicles}
      options={visibleVehicles?.map(vehicle => {
        return {
          label: vehicle.name,
          value: vehicle.id
        }
      }) || []}
      onChange={val => {
        setSelectedVehicles(val);
        action("selected")
      }}
    />
  )
};
