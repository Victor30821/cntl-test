import React from "react";
import useScreenSize from "hooks/useScreenSize";
import { Button, Text, Col } from "components";
import { Row } from "reactstrap";
import Ilutration from "assets/ilustration.png";
import {
    ContainerInfo,
    Br,
    ContentInfoLeft,
} from "./style.js";
import { localizedStrings } from "constants/localizedStrings";

export default function LoginLateralInformation({ title }) {
    const isLargeScreen = useScreenSize();

    return (
        <ContainerInfo active={isLargeScreen}>
            <Text
                as="h1"
                fontSize="48px"
                color="#fff"
                lineHeight="56px"
                fontWeight="bold"
            >
                {localizedStrings.loginPage.meetContele}
            </Text>
            <Br height="32px" />

            <Text
                as="h3"
                fontSize="24px"
                color="#fff"
                lineHeight="28px"
                fontWeight="bold"
            >
                {localizedStrings.loginPage.whoWeAre}
            </Text>
            <Br height="16px" />

            <Text
                width="388px"
                fontSize="18px"
                color="#fff"
                lineHeight="21px"
                dangerouslySetInnerHTML={{
                    __html: localizedStrings.loginPage.whoWeAreText
                }}
            ></Text>
            <Br height="36px" />
            <Row style={{ margin: "0px" }}>
                <Col md={"6"} className={"mb-6 login-topics-text"} style={{
                    padding: "0px",
                    minHeight: "500px",
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "space-between",
                }}>

                    {
                        localizedStrings.loginPage.topics.map((item, index) => (
                            <div>
                                <Text
                                    fontSize="18px"
                                    color="#fff"
                                    lineHeight="35px"
                                    fontWeight="bold"
                                    key={index}
                                >
                                    {item}
                                </Text>
                            </div>
                        ))
                    }
                    <div>
                        <Text
                            as="h3"
                            fontSize="24px"
                            color="#fff"
                            lineHeight="28px"
                            fontWeight="bold"
                            letterSpacing="0.1px"
                        >
                            {localizedStrings.loginPage.yetDontUseContent}
                        </Text>
                    </div>
                    <div>
                        <Button
                            width="345px"
                            height="42px"
                            fontWeight="500"
                            backgroundColor="#fff"
                            textConfig={{
                                style: { color: "#2E2C8C", fontWeight: "bold", fontSize: "16px" }
                            }}
                            boxShadow={"3px 3px 3px 0px #00000050"}
                            as={"a"}
                            href={localizedStrings.loginPage.landingPageLink}
                            target={"_blank"}
                            title={localizedStrings.loginPage.knowServices}
                        />
                    </div>
                </Col>
                <Col md="6" className="md-6" style={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    <ContentInfoLeft>
                        <img src={Ilutration} alt={"login ilustration"} />
                    </ContentInfoLeft>
                </Col>
            </Row>
        </ContainerInfo>
    );
}
