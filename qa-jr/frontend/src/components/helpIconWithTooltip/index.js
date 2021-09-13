import React from 'react';
import { Icon } from 'components'

export default ({ text = null, icon = "help", color = "#2E2C8C", ...options }) => {
    return (
        <Icon
            tooltipText={text}
            icon={icon}
            width={"16px"}
            height={"16px"}
            style={{ margin: "0 0 0 5px" }}
            color={color}
            {...options} />
    );
}
