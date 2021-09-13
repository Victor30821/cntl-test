import React from "react";
import { Icon } from "components";
import { localizedStrings } from "constants/localizedStrings";

export default ({ cellData = "", ...props }) => (
    <Icon
        icon={"warning"}
        width={"16px"}
        height={"16px"}
        tooltipText={props.fallbackText || localizedStrings.problemsWhenLoadingDate}
        color={"#1D1B84"}
        {...props}
    />
);