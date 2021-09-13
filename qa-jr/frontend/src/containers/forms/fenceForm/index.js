import React, { useState, useEffect } from "react";
import { Card, CardTitle, CardForm, CardInput, Select, Checkbox } from "components";
import { useDispatch, useSelector } from "react-redux";
import { localizedStrings } from "constants/localizedStrings";
import { loadVehicles } from "store/modules";
import { MAX_LIMIT_FOR_SELECTORS } from "constants/environment";
import { Label } from "reactstrap";

export default function FenceForm({
  title,
  onSubmit,
  inputsConfig,
  handleSelectedVehicles,
  selectedVehicles,
  isAllVehiclesSelected,
  style,
}) {
  const {
      vehicles,
      loadVehiclesLoading: loadLoading,
      loadVehiclesFail: loadFail
  } = useSelector((state) => state.vehicles);
  const dispatch = useDispatch();
  const [visibleVehicles, setVisibleVehicles] = useState([]);
  const {
    user: { organization_id },
  } = useSelector((state) => state.auth);
  const [checkbox, setCheckbox] = useState(isAllVehiclesSelected);
  useEffect(() => setCheckbox(isAllVehiclesSelected), [isAllVehiclesSelected])
  const toggleCheckbox = (isChecked) => {
    setCheckbox(isChecked);
    if (isChecked) {
      setSelectDisabled(true);
      handleSelectedVehicles([
        {
          label: localizedStrings.allVehicles,
          value: "all",
        },
      ]);
    } else {
      if (selectedVehicles[0]?.value === "all") {
        setSelectDisabled(false);
        handleSelectedVehicles([]);
      }
    }
  };
  const loadOrganizationVehicles = (searchParam) => {
    dispatch(
      loadVehicles({
        organization_id,
        limit: MAX_LIMIT_FOR_SELECTORS,
      })
    );
  };
  useEffect(() => {
    loadOrganizationVehicles();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setVisibleVehicles(vehicles);
  }, [vehicles]);
  useEffect(() => setSelectDisabled(isAllVehiclesSelected), [isAllVehiclesSelected])

  const [selectedDisabled, setSelectDisabled] = useState(false);

  return (
    <Card>
      <CardTitle color={"#333"} fontWeight={"bold"} fontSize={"14px"}>
        {title}
      </CardTitle>
      <CardForm
        {...style}
        id={"fence"}
        onSubmit={(...val) => onSubmit(...val)}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <CardInput
            onChange={inputsConfig.onChange}
            register={inputsConfig.register}
            inputs={inputsConfig.inputs}
            width={"50%"}
            marginRight={"10px"}
            marginBottom={"10px"}
          />
          <Select
            style={{
              minWidth: "200px",
              marginRight: "10px",
              width: "24%",
              marginBottom: "10px"
            }}
            isMulti
            options={
              visibleVehicles?.map((vehicle) => {
                return {
                  label: vehicle.name,
                  value: vehicle.id,
                };
              }) || []
            }
            error={loadFail}
            loading={loadLoading}
            title={localizedStrings.selectAVehicle}
            placeholder={localizedStrings.selectAVehicle}
            onChange={handleSelectedVehicles}
            value={selectedVehicles}
            emptyStateText={localizedStrings.noVehicleCreated}
            disabled={selectedDisabled}
          />
          <Label>
            <Checkbox
              title={localizedStrings.allVehicles}
              disabled={loadLoading || loadFail}
              onChange={toggleCheckbox}
              checked={checkbox}
            />
          </Label>
        </div>
      </CardForm>
    </Card>
  );
}
