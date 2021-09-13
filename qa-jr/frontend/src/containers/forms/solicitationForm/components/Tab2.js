import React, { useState, useEffect } from "react";
import { Select, Col, } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { solicitationChangeSelectors } from "store/modules";

export default function Tab2({ errors }) {
  const dispatch = useDispatch();

  const {
    selectors,
    loadLoading,
    solicitations
  } = useSelector(state => state.solicitations);

  const {
    vehicles, loadLoading: loadingVehicles
  } = useSelector(state => state.vehicles);

  const [visibleVehicles, setVisibleVehicles] = useState([]);

  const formatVehicles = vehicle => {
    return {
      label: vehicle.name,
      value: vehicle.id
    }
  }

  useEffect(() => {
    if (vehicles.length > 0 && solicitations.length > 0) {

      const formattedVehicles = vehicles
        .map(formatVehicles)

      setVisibleVehicles(formattedVehicles);

    }
  }, [vehicles, solicitations]);

  return (
    <>
      <Row>
        <Col xl="12" xxl="12" >
          <Select
            title={localizedStrings.associateVehicles}
            isMulti
            required
            loading={loadLoading || loadingVehicles}
            error={errors.vehicles.error}
            errorText={errors.vehicles.message}
            options={visibleVehicles}
            placeholder={localizedStrings.selectAnAvailableVehicle + "..."}
            onChange={(item) => {
              dispatch(solicitationChangeSelectors({
                selectors: { vehicles: item }
              }))
            }}
            value={selectors?.vehicles || []}
          />
        </Col>
      </Row>
    </>
  );
}
