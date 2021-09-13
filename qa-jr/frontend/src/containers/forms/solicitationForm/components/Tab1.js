import React from "react";
import { CardInput, Col, DateInput } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";

export default function Tab3({ inputsConfig, vehicle, errors }) {

  return (
    <>
      <Row>
        <Col xl="6" xxl="6" >
          <CardInput
            onChange={inputsConfig.setValue}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.requestingUser,
                defaultValue: inputsConfig.getValues()?.user_name,
                name: "user_name",
                type: "text",
                readOnly: true,
                placeholder: localizedStrings.typeClientName
              },
            ]}
          />
        </Col>
        <Col xl="6" xxl="6" >
          <CardInput
            onChange={inputsConfig.setValue}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.solicitationDescription,
                defaultValue: inputsConfig.getValues()?.descr,
                name: "descr",
                type: "text",
                maxLength: 200,
                error: errors.descr.error,
                errorText: errors.descr.message,
                required: true,
                placeholder: localizedStrings.solicitationDescriptionExample
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col xl="4" xxl="4" >
          <DateInput
            type={'dateRangePicker'}
            register={inputsConfig.register}
            label={localizedStrings.selectPeriod}
            onChange={(name, values) => {
              console.log({ values });
              inputsConfig.setDate(values);
            }}
            value={Object.values(inputsConfig.date)}
            hasDefaultValue={!inputsConfig.pageEdit}
            name={"date"}
            placeholder={"dd/mm/aaaa"}
          />
        </Col>
        <Col xl="4" xxl="4" >
          <CardInput
            onChange={inputsConfig.setValue}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.from,
                name: "start_time",
                type: "time",
                defaultValue: inputsConfig.getValues()?.start_time,
                error: errors.start_time.error,
                errorText: errors.start_time.message,
                required: true,
              },
            ]}
          />
        </Col>
        <Col xl="4" xxl="4" >
          <CardInput
            onChange={inputsConfig.setValue}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.until,
                name: "end_time",
                type: "time",
                defaultValue: inputsConfig.getValues()?.end_time,
                error: errors.end_time.error,
                errorText: errors.end_time.message,
                required: true,
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}
