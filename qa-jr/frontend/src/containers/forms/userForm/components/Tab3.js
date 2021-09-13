import React from "react";
import { Select, Col } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { userChangeSelectors } from "store/modules";
import { useDispatch, useSelector } from "react-redux";
export default function Tab3({ inputsConfig, user, onChanges, errors }) {
  const dispatch = useDispatch()
  const {
    selectors
  } = useSelector(state => state.users);
  return (
    <>
      <Row>
        <Col md="6" className="mb-6">
          <Select
            title={localizedStrings.decimalSeparators}
            required={true}
            error={errors.decimal_separators.error}
            errorText={errors.decimal_separators.message}
            options={inputsConfig.inputs.decimalOptions}
            placeholder={localizedStrings.selectAItem}
            onChange={(item) => {
              dispatch(userChangeSelectors({
                selectors: { decimal_separators: item }
              }))
            }}
            value={selectors?.decimal_separators || {}}
          />
        </Col>
        <Col md="6" className="mb-6">
          <Select
            title={localizedStrings.thousandSeparators}
            required={true}
            error={errors.thousands_separators.error}
            errorText={errors.thousands_separators.message}
            options={inputsConfig.inputs.thousandOptions}
            placeholder={localizedStrings.selectAItem}
            onChange={(item) => {
              dispatch(userChangeSelectors({
                selectors: { thousands_separators: item }
              }))
            }}
            value={selectors?.thousands_separators || {}}
          />
        </Col>
      </Row>

      <Row>
        <Col md="6" className="mb-6">
          <Select
            title={localizedStrings.distanceUnit}
            required={true}
            error={errors.distance_unit.error}
            errorText={errors.distance_unit.message}
            options={inputsConfig.inputs.distanceOptions}
            placeholder={localizedStrings.selectAItem}
            onChange={(item) => {
              dispatch(userChangeSelectors({
                selectors: { distance_unit: item }
              }))
            }}
            value={selectors?.distance_unit || {}}
          />
        </Col>
        <Col md="6" className="mb-6">
          <Select
            title={localizedStrings.volumetricUnit}
            required={true}
            error={errors.volumetric_measurement_unit.error}
            errorText={errors.volumetric_measurement_unit.message}
            options={inputsConfig.inputs.volumetricUnitOptions}
            placeholder={localizedStrings.selectAItem}
            onChange={(item) => {
              dispatch(userChangeSelectors({
                selectors: { volumetric_measurement_unit: item }
              }))
            }}
            value={selectors?.volumetric_measurement_unit || {}}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <Select
            title={localizedStrings.currency}
            required={true}
            error={errors.currency.error}
            errorText={errors.currency.message}
            options={inputsConfig.inputs.currencyOptions}
            placeholder={localizedStrings.selectAItem}
            onChange={(item) => {
              dispatch(userChangeSelectors({
                selectors: { currency: item }
              }))
            }}
            value={selectors?.currency || {}}
          />
        </Col>
      </Row>
    </>
  );
}
