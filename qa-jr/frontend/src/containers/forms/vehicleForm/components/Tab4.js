import React from "react";
import { CardInput, Col, HelpIconWithTooltip, Text, Icon, Link } from "components";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { FlexDiv } from "../style";

const Tab4 = ({ inputsConfig, onChanges, errors }) => {
  const icon = () => {
    return (
      <Icon icon={"folder"} width={"16px"} style={{ margin: "0 12px 0 0" }} height={"16px"} color={"#2E2C8C"} />
    )
  }
  return (
    <>
      <Row
        style={{
          paddingBottom: "10px",
          marginBottom: "22px",
          borderBottom: "1px solid #cccccc80",
        }}
      >
        <Col md="12" className="mb-6">
          <FlexDiv>
            <Text
              fontWeight={"500"}
              fontSize={"14px"}
              lineHeight={"19px"}
              fontStyle={"italic"}
              color={"#333333"}
            >
              {localizedStrings.googleDriveIntegration}
            </Text>
            <HelpIconWithTooltip
              text={[
                localizedStrings.tooltipHelpTexts.vehicleDocumentation.text,
                <Link
                  href={
                    localizedStrings.tooltipHelpTexts.vehicleDocumentation.link
                  }
                  target={"_blank"}
                >
                  {" "}
                  {
                    localizedStrings.tooltipHelpTexts.vehicleDocumentation
                      .linkText
                  }
                </Link>,
              ]}
            />
          </FlexDiv>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-6">
          <CardInput
            onChange={onChanges.handleInput}
            register={inputsConfig.register}
            inputs={[
              {
                iconBeforeText: true,
                icon,
                label: localizedStrings.documentationUrl,
                name: "documentation_url",
                type: "text",
                noMask: true,
                placeholder: localizedStrings.documentationUrlExample,
                error: errors.documentation_url.error,
                errorText: errors.documentation_url.message,
              },
            ]}
          />
        </Col>

        <Col md="6" className="mb-6">
          <FlexDiv>
            <Icon
              icon={"play"}
              width={"16px"}
              height={"16px"}
              color={"#2E2C8C"}
            />
            <Text
              whiteSpace={"break-spaces"}
              fontWeight={"500"}
              fontSize={"13px"}
              lineHeight={"19px"}
              color={"#666666"}
              marginLeft={"10px"}
            >
              {localizedStrings.documentationUrlHelp}{" "}
              <Link
                href="https://help.contelerastreador.com.br/pt-br/article/saiba-como-organizar-a-documentacao-da-sua-frota-q2ajaf/"
                target="_blank"
              >
                {localizedStrings.clickingHere}
              </Link>
            </Text>
          </FlexDiv>
        </Col>
      </Row>
    </>
  );
}

export default Tab4;