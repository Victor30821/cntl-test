import React from "react";
import { CardInput, Col, Checkbox } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { HeaderTab } from "../style";

export default function Tab1({
  inputsConfig,
  organization,
  onChanges,
  errors,
}) {
  return (
    <>
      <HeaderTab first={true}>Endereço de Entrega</HeaderTab>
      <Row>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handleAddress}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.address,
                name: "address1",
                type: "text",
                required: true,
                value: organization.address1.address1,
                error: errors.address1.error,
                errorText: errors.address1.message,
              },
            ]}
          />
        </Col>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handleNumber}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.number,
                name: "number",
                type: "text",
                required: true,
                value: organization.address1.number,
                error: errors.number.error,
                errorText: errors.number.message,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handleNeighborHood}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.neighborhood,
                name: "neighborhood",
                type: "text",
                required: true,
                value: organization.address1.neighborhood,
                error: errors.neighborhood.error,
                errorText: errors.neighborhood.message,
              },
            ]}
          />
        </Col>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handleCity}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.city,
                name: "city",
                type: "text",
                required: true,
                value: organization.address1.city,
                error: errors.city.error,
                errorText: errors.city.message,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handleState}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.state,
                name: "state",
                type: "text",
                required: true,
                value: organization.address1.state,
                error: errors.state.error,
                errorText: errors.state.message,
              },
            ]}
          />
        </Col>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handleZipCode}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.zipcode,
                name: "zipcode",
                type: "text",
                required: true,
                value: organization.address1.zipcode,
                error: errors.zipcode.error,
                errorText: errors.zipcode.message,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6" style={{ margin: "24px 0" }}>
          <Checkbox
            checked={organization.isSameAddress}
            onChange={onChanges.handleCheckbox}
            title={localizedStrings.useBillingAddressSame}
          />
        </Col>
      </Row>

      <HeaderTab>Endereço de Cobrança</HeaderTab>

      <Row>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handle2Address}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.address,
                name: "address1",
                type: "text",
                value: organization.address2.address1,
                readOnly: organization.isSameAddress,
              },
            ]}
          />
        </Col>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handle2Number}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.number,
                name: "number",
                type: "text",
                readOnly: organization.isSameAddress,
                value: organization.address2.number,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handle2NeighborHood}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.neighborhood,
                name: "neighborhood",
                type: "text",
                readOnly: organization.isSameAddress,
                value: organization.address2.neighborhood,
              },
            ]}
          />
        </Col>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handle2City}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.city,
                name: "city",
                type: "text",
                readOnly: organization.isSameAddress,
                value: organization.address2.city,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handle2State}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.state,
                name: "state",
                type: "text",
                readOnly: organization.isSameAddress,
                value: organization.address2.state,
              },
            ]}
          />
        </Col>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handle2ZipCode}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.zipcode,
                name: "zipcode",
                type: "text",
                readOnly: organization.isSameAddress,
                value: organization.address2.zipcode,
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}
