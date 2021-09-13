import React, { memo } from 'react';
import { TextDefault } from './style';
import Tooltip from '@material-ui/core/Tooltip';
import {
    withStyles
} from "@material-ui/core/styles";

const TextOnlyTooltip = withStyles({
    tooltip: {
        color: "black",
        backgroundColor: "#fff",
        fontSize: "14px",
        border: "1px solid #00000070"
    }
})(Tooltip);

function Text({ tooltipText, ...options }) {
    return (
        tooltipText
            ? (
                <TextOnlyTooltip title={tooltipText} arrow interactive {...options.tooltipOptions}>
                    <TextDefault {...options} >
                        {options.children}
                    </TextDefault>
                </TextOnlyTooltip>
            )
            : (
                <TextDefault {...options} >
                    {options.children}
                </TextDefault>
            )
    );
}
export default memo(Text);