import React from 'react';
import { ArrowToggle, Icon, Text } from '../../../components'
import {
    ClickableMenuItem,
    DivArrowToggle,
    DivCircle,
    Circle
} from '../item/style.js';

export default function SubItem({ id, isCurrentScreen, icon, title, onItemClick, iconMarginRight, iconPaddingLeft, isExpandedMenu, screens, hasToggle, toggleChildrenScreen, ...options }) {
    
    return (
        <ClickableMenuItem
            onClick={() => {
                if (screens && screens.length > 0) {
                    toggleChildrenScreen(id);
                }
                onItemClick(id)
            }}
            key={id}>
            <Icon icon={icon} width="35px" height="20px" color='#ccc'
                style={{ opacity: '0.6', marginLeft: '12px', }}  {...options} />
            {!isExpandedMenu &&
                <Text fontWeight={"bold"} color={"#fff"}>
                    {title}
                </Text>
            }
            {/* {options.screens && options.screens.length > 0 &&
                <SubItem {...options.screens} />
            } */}
            {hasToggle &&
                <DivArrowToggle
                    onClick={() => {
                        // options.toggleChildrenScreen(id);
                    }}>
                    <ArrowToggle />
                </DivArrowToggle>
            }
            {isCurrentScreen &&
                <DivCircle>
                    <Circle />
                </DivCircle>
            }
        </ClickableMenuItem>
    );
}
