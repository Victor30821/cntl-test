import React, { useCallback, useState } from 'react'
import { Text } from 'components';
import { Button } from 'components/buttons';
import { Checkbox } from 'components/inputs';
import { localizedStrings } from 'constants/localizedStrings';
import {
    ModalContent,
    ConfirmCheckboxWrapper,
    ConfirmButtonsWrapper,
    ImageContainer,
} from './style';

function ModalChangeModuleFromVehicle({
    MySwal,
    divOptions = {},
}) {

    const [hasAcceptedTermsToChangeContract, setAcceptedTermsToChangeContract] = useState(false);

    const onConfirm = () => hasAcceptedTermsToChangeContract && MySwal?.clickConfirm && MySwal.clickConfirm();

    return (
        <div {...divOptions}>
            <Text
                fontFamily="Roboto"
                fontStyle="normal"
                fontWeight="bold"
                fontSize="28px"
                lineHeight="26px"
                textAlign="center"
                letterSpacing="0.1px"
                color="#505050"
                padding="48px 24px 30px"
            >
                {localizedStrings.attention}!
				</Text>
            <ImageContainer>
                <div >
                    <img src={require("assets/module.svg")} />
                </div>
                <div >
                    <img src={require("assets/real_car.svg")} />
                </div>
                <div  >
                    <img src={require("assets/module.svg")} />
                </div>
            </ImageContainer>

            <ModalContent>
                <Text
                    fontFamily="Roboto"
                    fontStyle="normal"
                    fontWeight="bold"
                    fontSize="14px"
                    lineHeight="22px"
                    color="#505050"
                >
                    {localizedStrings.migratingAModuleToAnotherVehicle}
                </Text>
                <Text
                    padding="10px 0 0"
                >
                    {localizedStrings.migratingAModuleItemOne}
                </Text>
                <Text
                    padding="5px 0"
                >
                    {localizedStrings.migratingAModuleItemTwo}
                </Text>
                <Text
                    padding="5px 0"
                >
                    {localizedStrings.migratingAModuleItemThree}
                </Text>
                <Text
                    padding="5px 0"
                >
                    {localizedStrings.migratingAModuleItemFour}
                </Text>
                <ConfirmCheckboxWrapper>
                    <Text
                        fontFamily="Roboto"
                        fontStyle="normal"
                        fontWeight="bold"
                        fontSize="14px"
                        lineHeight="22px"
                        color="#505050"
                    >
                        {localizedStrings.areYouSureUWantToContinue}
                    </Text>
                    <div>
                        <Checkbox
                            checked={hasAcceptedTermsToChangeContract}
                            textOptions={{
                                color: "#666666",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "14px",
                                lineHeight: "19px",
                            }}
                            title={localizedStrings.iAmAwareOfTheConsequencesOfThisAction}
                            onChange={accepted => setAcceptedTermsToChangeContract(accepted)}
                        />
                    </div>

                </ConfirmCheckboxWrapper>
                <ConfirmButtonsWrapper>
                    <Button
                        color="#fff"
                        whiteSpace="none"
                        backgroundColor="#FD3D3D"
                        borderRadius="4px"
                        borderColor="#fff"
                        display="inline-flex"
                        onClick={() => MySwal?.clickCancel?.()}
                        title={localizedStrings.cancel}
                        as="a"
                        flexDirection="row"
                        merginRight="5px"
                    />
                    <Button
                        merginLeft="5px"
                        color="#fff"
                        whiteSpace="none"
                        backgroundColor={hasAcceptedTermsToChangeContract ? "#1a2565" : "#8E8DC2"}
                        disabled={!hasAcceptedTermsToChangeContract}
                        borderRadius="4px"
                        borderColor="#fff"
                        onClick={() => onConfirm()}
                        title={localizedStrings.continue}
                        as="a"
                        display="inline-flex"
                        flexDirection="row"
                    />
                </ConfirmButtonsWrapper>
            </ModalContent>
        </div>
    )
}

export default ModalChangeModuleFromVehicle
