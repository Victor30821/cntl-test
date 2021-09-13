

import React, { useState } from "react";
import { DescriptionPageHeader } from "containers";
import { action } from "@storybook/addon-actions";
import { localizedStrings } from 'constants/localizedStrings'
export default {
    title: "DescriptionPageHeader"
};
export const DescriptionPageHeaderComponent = ({
    title = localizedStrings.registers,
    subtitle = localizedStrings.drivers,
    page = localizedStrings.driversPerRoute,
    icon = "list",
}) => {
    return (
        <DescriptionPageHeader
            title={title}
            pageName={subtitle}
            page={page}
            customPageTitle={localizedStrings.driverPerRouteReport}
            subtitleIsTitle={true}
            description={localizedStrings.kmReportDescription}
            icon={icon}
        />
    );
}
