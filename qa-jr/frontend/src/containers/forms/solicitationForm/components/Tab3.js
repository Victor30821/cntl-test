import React, { useState, useEffect } from "react";
import { Select, Col } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { solicitationChangeSelectors } from "store/modules";

export default function Tab3({ errors }) {
  const dispatch = useDispatch();

  const {
    selectors,
    loadLoading,
    solicitations
  } = useSelector(state => state.solicitations);

  const {
    drivers, loadLoading: loadingDrivers
  } = useSelector(state => state.drivers);

  const [visibleDrivers, setVisibleDrivers] = useState([]);

  const formatDrivers = driver => {
    return {
      label: driver.name,
      value: driver.id
    }
  }


  useEffect(() => {
    if (drivers.length > 0 && solicitations.length > 0) {

      const formattedDrivers = drivers
        .map(formatDrivers)

      setVisibleDrivers(formattedDrivers);
    };
  }, [drivers, solicitations]);

  return (
    <>
      <Row>
        <Col xl="12" xxl="12" >
          <Select
            title={localizedStrings.associateDrivers}
            isMulti
            required
            loading={loadLoading || loadingDrivers}
            error={errors.drivers.error}
            errorText={errors.drivers.message}
            options={visibleDrivers}
            placeholder={localizedStrings.selectAnAvailableDrivers + "..."}
            onChange={(item) => {
              dispatch(solicitationChangeSelectors({
                selectors: { drivers: item }
              }))
            }}
            value={selectors?.drivers || []}
          />
        </Col>
      </Row>
    </>
  );
}
