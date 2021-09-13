
import React, { memo } from "react";

function PercentageProgressBar({
    history,
    barHeight,
    backgroundBarColor,
    barColor,
    barBorderRadius,
    value,
    maxValue,
    decimalPlaces,
    text,
    onClick = () => {},
    ...option
}) {
    const GREY = '#EEEEEE';
    const CONTELEBLUE = '#1D1B84';

    const barSettings = {
        frontBarColor: barColor || CONTELEBLUE,
        backBarColor: backgroundBarColor || GREY,
        barHeight: barHeight || '12px',
        barBorder: barBorderRadius || '20px',
        value: value || 0,
        maxValue: maxValue || 100,
        text: text || '',
    }

    const percentage = ((barSettings.maxValue * barSettings.value) / 100);
    
    return (
        <div style={{
            ...option.style,
            width: '100%'
        }}
        onClick={onClick}>
            <div style={{
                background: barSettings.backBarColor,
                borderRadius: barSettings.barBorder,
                height: barSettings.barHeight,
                width: '100%'
            }}>
                <div style={{
                    background: barSettings.frontBarColor,
                    borderRadius: barSettings.barBorder,
                    width: `${percentage}%`,
                    height: barSettings.barHeight
                }}>
                </div>
                <div style={{ width: '100%' }}>
                    {barSettings.text}
                </div>
            </div>
        </div>
    )

}
export default memo(PercentageProgressBar);