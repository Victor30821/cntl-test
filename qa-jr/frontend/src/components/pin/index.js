import React from 'react';
import { PinDefault, PinDiv, ArrowStyle, PinName, PinWrapper } from './style';
import { Icon, Text } from 'components';

export default function VehiclePin({
    text,
    hasText,
    icon,
    iconColor = "#000",
    showVehicleName = false,
    optionsWrapper = {} ,
    optionsIcons = {},
    optionsArrow = {},
    ...options
}) {
    return (
        <PinWrapper onClick={options?.onClick} {...optionsWrapper}>
            {
                showVehicleName &&
                <PinName>
                    <Text color={"#fff"}>
                        {options.name}
                    </Text>
                </PinName>
            }
            <PinDiv>
                <PinDefault iconColor={iconColor} {...options}>
                    <ArrowStyle {...optionsArrow}/>
                    {
                        icon &&
                        <Icon icon={icon} width={"43px"} height={"38px"} marginLeft={"10px"} color={iconColor} {...optionsIcons}/>
                    }
                </PinDefault>
                {
                    hasText &&
                    <Text>{text}</Text>
                }
            </PinDiv>
        </PinWrapper>
    );
}
