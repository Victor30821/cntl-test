import React from "react";
import { Icon, Text } from 'components'
import { IconRowStyle, IconsBlockStyle } from './style'

export default function IconsRow({ icons, size = "16px", ...props }) {
    return (
        <IconsBlockStyle {...props}>
            <div>
                {
                    icons
                        .filter(icon => icon)
                        .map(({useFontAwesome = false, ...icon}, index) => {
                            return (
                                <IconRowStyle key={index} {...icon}{...props.divOptions}>
                                    {
                                        icon.icon &&
                                        <Icon
                                            tooltipText={icon.tooltip}
                                            icon={icon.icon}
                                            width={icon.size || size}
                                            height={icon.size || size}
                                            color={"#1A237A"}
                                            {...icon.style || {}}
                                            useFontAwesome={useFontAwesome}
                                        />
                                    }
                                    {
                                        icon.text &&
                                        <Text
                                            paddingTop={"10px"}
                                            textAlign={"center"}
                                            lineHeight={"13px"}
                                            fontSize={"12px"}
                                            whiteSpace="break-spaces"
                                            {...icon.textOptions}
                                            useFontAwesome={useFontAwesome}
                                        >
                                            {icon.text}
                                        </Text>
                                    }
                                </IconRowStyle>
                            )
                        })
                }
            </div>
        </IconsBlockStyle>
    );
};
