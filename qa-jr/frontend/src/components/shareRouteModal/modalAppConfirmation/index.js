import React from 'react'
import {
    ShareRouteModalContainer
} from '../style'
import { Text } from 'components'
import { BottomActionButtons } from 'components/buttons'
import { useSelector } from 'react-redux'
import { localizedStrings } from 'constants/localizedStrings'

export default function ShareRouteModalAppConfirmation({
    setAppShareConfirmation,
    onShare,
}) {
    const {
        vehicleToShow
    } = useSelector(state => state.map);
    return (
        <ShareRouteModalContainer
            childDiv={{
                justifyContent: "flex-end",
                padding: "0"
            }}
        >
            <Text fontSize={"18px"} color={"#666666"} whiteSpace={"normal"}>
                {localizedStrings.sendToDriverViaAppConfirmation(vehicleToShow?.driver?.nickname || localizedStrings.driver.toLowerCase())}
            </Text>
            <BottomActionButtons
                onCancel={() => setAppShareConfirmation(false)}
                onSave={() => {
                    onShare({
                        type: "app"
                    });
                    setAppShareConfirmation(false)
                }}
                loading={false}
                type="button"
                saveText={localizedStrings.send}
                divProps={{
                    marginBottom: "0px"
                }}
            />
        </ShareRouteModalContainer>
    )
}
