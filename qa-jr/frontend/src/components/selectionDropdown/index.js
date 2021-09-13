import React, { useEffect, useState } from 'react';
import {
    DropDown,
    ItemsList,
    Item,
    ItemDiv
} from './style';
import { Text } from '../../components';

export default function SelectionDropdown({ visible = false, items = [], onItemClick, alreadySelected = [], half, name = "name", returnProperty = "id", ...options }) {
    const [visibleItems, setVisibleItems] = useState(items);

    useEffect(() => {
        setVisibleItems(
            items.filter(item => !alreadySelected.includes(item))
        );
    }, [alreadySelected, items]);

    return (
        visible &&
        <DropDown width={half && "50%"}>
            <ItemsList>
                {
                    visibleItems.map((item, index) => {
                        return (
                            <Item key={index}>
                                <ItemDiv onMouseDown={() => onItemClick && onItemClick(item[returnProperty])}>
                                    <Text cursor={"pointer"}>{item[name]}</Text>
                                </ItemDiv>
                            </Item>
                        )
                    })
                }
            </ItemsList>
        </DropDown>
    )
}
