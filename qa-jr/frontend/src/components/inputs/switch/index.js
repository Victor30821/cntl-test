import React from 'react';
import { SwitchWrapper, SwitchButton, SwitchDiv } from './style';
import { Text } from '../../../components';

export default function Switch({
    checked,
    onCheck,
    text = false,
    hide,
    icon,
    optionsSwitchDiv = {},
    disableSwitch,
    ...options
}) {
    return (
        <SwitchDiv display={hide ? "none" : false} style={{...optionsSwitchDiv}}>
            <SwitchWrapper
                background={checked ? "#2531A4" : "rgba(37, 49, 164, 0.5)"} {...options}>
                <input
                    checked={checked}
                    type="checkbox"
                    onClick={(e) => {
                        e.persist();
                        onCheck && onCheck(e);
                    }} 
                    disabled={disableSwitch}
                />
                <SwitchButton background={"#fff"} />
            </SwitchWrapper>
            {
                text &&
                <Text
                    cursor="pointer"
                    onClick={onCheck}
                    {...options.textOptions}>
                    {text}
                </Text>
            }
            {
                icon
            }
        </SwitchDiv>
    );
}
