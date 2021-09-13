import React from 'react';
import { ArrowToggle } from '../../../../components'
import {
    DivArrowToggle,
    DivMenuSubitens,
    ListSubitemDepth,
    LinkItemMenu
} from '../style.js';

import { useSelector, useDispatch } from 'react-redux';
import { selectChildScreen } from '../../../../store/modules'
export const ItemDepthTwo = ({ index, title, path, hasToggle, history, currentPath, name, ...options }) => {
    const dispatch = useDispatch()
    const {
        selectedChildrenScreen
    } = useSelector(state => state.menu);

    const setSelectedChildrenScreen = (screensObj) => dispatch(selectChildScreen(screensObj))

    const onItemClick = () => {
        !hasToggle && console.log("Navigate to: ", currentPath + path);

        setSelectedChildrenScreen({ ...selectedChildrenScreen, depthTwo: index })
    }

    return (
        <ListSubitemDepth
            key={index} >
            <DivMenuSubitens
                paddingLeft={'65px'}
                {...options.subStyles}
                onClick={onItemClick}
                data-menu={name}
                as={hasToggle ? "div" : "a"}
                href={currentPath + path}
            >
                <LinkItemMenu fontWeight={"bold"} color={index === selectedChildrenScreen.depthTwo ? "#ffffff" : "#ffffff80"} {...options.linkProps}>
                    {title}
                </LinkItemMenu>
                {hasToggle &&
                    <DivArrowToggle isActive={selectedChildrenScreen.depthTwo === index} >
                        <ArrowToggle />
                    </DivArrowToggle>
                }
            </DivMenuSubitens>
        </ListSubitemDepth>
    )
}
