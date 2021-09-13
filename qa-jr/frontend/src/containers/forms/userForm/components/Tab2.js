import React from "react";
import { Select, Col } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { userChangeSelectors } from "store/modules";
import { useDispatch, useSelector } from "react-redux";
export default function Tab2({ inputsConfig, user, onChanges, errors }) {
  const dispatch = useDispatch()
  const {
    selectors
  } = useSelector(state => state.users);
  return (
    <>
      <Row>
        <Col md="6" className="mb-6">
          <Select
            title={localizedStrings.dateFormat}
            required={true}
            error={errors.short_date_format.error}
            errorText={errors.short_date_format.message}
            options={inputsConfig.inputs.dateOptions}
            placeholder={localizedStrings.selectAItem}
            onChange={(item) => {
              dispatch(userChangeSelectors({
                selectors: { short_date_format: item }
              }))
            }}
            value={selectors?.short_date_format || {}}
          />
        </Col>
        <Col md="6" className="mb-6">
          <Select
            title={localizedStrings.timeFormat}
            required={true}
            error={errors.short_time_format.error}
            errorText={errors.short_time_format.message}
            options={inputsConfig.inputs.timeOptions}
            placeholder={localizedStrings.selectAItem}
            onChange={(item) => {
              dispatch(userChangeSelectors({
                selectors: { short_time_format: item }
              }))
            }}
            value={selectors?.short_time_format || {}}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <Select
            title={localizedStrings.timezone}
            required={true}
            error={errors.timezone.error}
            errorText={errors.timezone.message}
            options={inputsConfig.inputs.timezoneOptions}
            placeholder={localizedStrings.selectAItem}
            onChange={(item) => {
              dispatch(userChangeSelectors({
                selectors: { timezone: item }
              }))
            }}
            value={selectors?.timezone || {}}
          />
        </Col>
      </Row>
    </>
  );
}
