import React from "react";
import { CardInput, Select, Col, Link } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import getOption from "helpers/getOption";

export default function Tab1({
  inputsConfig,
  organization,
  onChanges,
  errors,
}) {
  return (
    <>
      <Row>
        <Col md="6" className="mb-6">
          <CardInput
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.companyName,
                name: "name",
                type: "text",
                value: organization.company_name,
                readOnly: true,
              },
            ]}
          />
        </Col>
        <Col md="6" className="mb-6">
          <CardInput
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.tradingName,
                name: "name",
                type: "text",
                value: organization.trading_name,
                readOnly: true,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <CardInput
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.cNPJCPF,
                name: "name",
                type: "text",
                value: organization.identification,
                readOnly: true,
              },
            ]}
          />
        </Col>
        <Col md="6" className="mb-6">
          <CardInput
            register={inputsConfig.register}
            inputs={[
              {
                label: "Dia do Vencimento",
                name: "name",
                type: "text",
                value: organization.end_date,
                readOnly: true,
                showTooltip: true,
                tooltipMessage: [
                  localizedStrings.tooltipHelpTexts.endDate.text,
                  <Link
                    href={localizedStrings.tooltipHelpTexts.endDate.link}
                    target="_blank"
                  >
                    {" "}
                    {localizedStrings.tooltipHelpTexts.endDate.linkText}
                  </Link>,
                ],
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <Select
            title="Moeda"
            required={true}
            error={errors.currency.error}
            errorText={errors.currency.message}
            options={inputsConfig.inputs.currencyOptions}
            placeholder={localizedStrings.selectAItem}
            value={getOption(
              organization.currency,
              inputsConfig.inputs.currencyOptions
            )}
            onChange={onChanges.handleCurrency}
          />
        </Col>
        <Col md="6" className="mb-6">
          <Select
            title="País"
            required={true}
            error={errors.country.error}
            errorText={errors.country.message}
            options={inputsConfig.inputs.countryOptions}
            placeholder={localizedStrings.selectAItem}
            value={getOption(
              organization.country,
              inputsConfig.inputs.countryOptions
            )}
            onChange={onChanges.handleCountry}
          />
        </Col>
      </Row>
    </>
  );
}
