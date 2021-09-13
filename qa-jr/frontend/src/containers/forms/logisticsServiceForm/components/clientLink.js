import React from "react";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { CardInput, HelpIconWithTooltip, Col, Link } from "components";
import { IS_PRD } from "../../../../constants/environment";

export default function ClientLink({ inputsConfig, onChanges, errors }) {
    
  return (
    <>
      <Row>
        <Col xl="4" xxl="4">
        <CardInput
              inputs={[
                {
                  label: localizedStrings.logisticService.accessLink,
                  name: "link",
                  type: "text",
                  noMask: true,
                  required: false,
                  defaultValue: IS_PRD ? "": "",
                  readOnly: true,
                  icon: (
                  <HelpIconWithTooltip
                    text={[
                      "colocar um texto aqui",
                      <Link
                        href={
                          localizedStrings.tooltipHelpTexts
                            .vehicleMedianConsumption.link
                        }
                        target={"_blank"}
                      >
                        {" "}
                        {"localizedStrings.learnMore"}
                      </Link>,
                    ]}
                  />
                )
                },
              ]}
            />
        </Col>
     </Row>
    </>
  );
}