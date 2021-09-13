import React from 'react';
import { Icon, Text } from '../../components'

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function Tooltip({ items = [], visible, toggle, id }) {

    const handleClose = (event, onClose) => {
        toggle(null);
        if (!event) return;
        onClose && onClose(event)
    };

    return (
        <Menu
            id={id}
            anchorEl={visible}
            keepMounted
            onClick={() => handleClose(false)}
            open={Boolean(visible)}  >
            {items.map(({action, icon, useFontAwesome = false, style, title}, index) => {
                return (
                    <MenuItem key={index} onClick={(event) => handleClose(event, action)}>
                        <Icon
                            style={{ position: 'absolute', left: "8px", ...style }}
                            icon={icon}
                            width={"15px"}
                            height={"15px"}
                            size={"sm"}
                            useFontAwesome={useFontAwesome}
                            divProps={{
                                minHeight: "10px"
                            }}
                            color='#212529' />
                        <Text
                            cursor={"pointer"}
                            marginLeft="20%"
                            paddingRight={"12px"}>
                            {title}
                        </Text>
                    </MenuItem>
                )
            })}
        </Menu>

    );
}
