

import React from "react";
import { Text } from "components";
import { EmptyStateContainer, FailStateContainer } from "containers";
import { localizedStrings } from "constants/localizedStrings";
export default {
    title: "States"
};

export const EmptyState = () => {
    return (
        <EmptyStateContainer
            title={localizedStrings.noChecklistsFound}
            subtitle={localizedStrings.createAChecklistToBegin}
        />
    );
}
export const FailState = () => {
    return (
        <FailStateContainer
            title={localizedStrings.noChecklistsFound}
            titleError={localizedStrings.noCheckListRegisterFound}
            subtitleError={
                <Text withLink>
                    {localizedStrings.pleaseTryAgain}{" "}
                </Text>
            }
        />
    );
}
