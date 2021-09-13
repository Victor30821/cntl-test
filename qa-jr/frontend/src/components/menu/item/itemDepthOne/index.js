
import React from 'react';
import { ArrowToggle } from '../../../../components'
import { ItemDepthTwo } from '../itemDepthTwo'

import {
    DivArrowToggle,
    DivMenuSubitens,
    ListSubitem,
    ListSubitemDepth,
    LinkItemMenu
} from '../style.js';
import { useSelector, useDispatch } from 'react-redux';
import { selectChildScreen } from '../../../../store/modules'
export const ItemDepthOne = ({ index, currentPath, path, history, title, hasToggle, name, ...options }) => {
    const dispatch = useDispatch();

    const {
        selectedChildrenScreen
    } = useSelector(state => state.menu);

    const setSelectedChildrenScreen = (screensObj) => dispatch(selectChildScreen(screensObj));

    const onItemClick = () => {

        if (selectedChildrenScreen.depthOne === index) {
            return setSelectedChildrenScreen({ depthOne: -1, depthTwo: -1, })
        }
        !hasToggle && console.log("Navigate to: ", currentPath + path);
        setSelectedChildrenScreen({ depthOne: index, depthTwo: -1, });
    }

    return (
        <ListSubitemDepth key={index} display="inline-block" >
            <DivMenuSubitens
                onClick={onItemClick}
                paddingLeft={"55px"}
                {...options.styles}
                as={hasToggle ? "div" : "a"}
                href={currentPath + path}
                data-menu={name}
            >
                <LinkItemMenu fontWeight={"bold"} color={index === selectedChildrenScreen.depthOne ? "#ffffff" : "#ffffff90"} {...options.linkProps} >
                    {title}
                </LinkItemMenu>
                {hasToggle &&
                    <DivArrowToggle
                        isActive={selectedChildrenScreen.depthOne === index}
                        onClick={() => {
                            // toggleChildrenScreen(id);
                        }}>
                        <ArrowToggle />
                    </DivArrowToggle>
                }
            </DivMenuSubitens>
            <ListSubitem backgroundColor={"#00000020"} >
                {
                    hasToggle && options.screens.length > 0 && selectedChildrenScreen.depthOne === index &&
                    options.screens.map((childScreen, index) =>
                        <ItemDepthTwo
                            key={index}
                            {...options}
                            history={history} currentPath={currentPath + path}
                            selectedChildrenScreen={selectedChildrenScreen}
                            setSelectedChildrenScreen={setSelectedChildrenScreen}
                            index={index} {...childScreen} />)
                }
            </ListSubitem>
        </ListSubitemDepth>
    )
}
