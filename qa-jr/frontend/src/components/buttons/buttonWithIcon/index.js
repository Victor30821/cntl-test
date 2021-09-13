import React from 'react';
import {
    ButtonWithIconStyle
} from './style';
import { Icon, Text } from 'components'
export default function ButtonWithIcon({
    title,
    onClick,
    formId = "",
    icon,
    customTextColor = "#fff",
    customIconColor = "#fff",
    customBackgroundColor = "#192379",
    disabled = false,
    hide = false,
    ...option
}) {
    return hide ? null : (
        <ButtonWithIconStyle
            onClick={onClick}
            backgroundColor={customBackgroundColor}
            form={formId}
            width="auto"
            disabled={disabled}
            {...option}
        >
            <Icon
                icon={icon}
                width={"14px"}
                height={"14px"}
                color={customIconColor}
                {...option.iconOptions}
            />
            {
                title &&
                <Text
                    cursor={"pointer"}
                    fontWeight={"500"}
                    fontSize={"13px"}
                    lineHeight={"15px"}
                    color={customTextColor}
                    marginLeft={"10px"}
                    {...option.textOptions}
                >
                    {title}
                </Text>
            }
        </ButtonWithIconStyle>
    );
}
