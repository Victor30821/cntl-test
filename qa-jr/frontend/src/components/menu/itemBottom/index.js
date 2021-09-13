import React from 'react';
import { Icon } from '../../../components'
import { useSelector } from 'react-redux';
import {
    DivMenuItem,
} from './style.js';

export default function ItemMenuBottom({ isSelected, onItemClick, ...options }) {

    const {
        menuIsOpen
    } = useSelector(state => state.menu);
    return (
        <DivMenuItem
            {...options}
            onClick={() => {
                onItemClick(!menuIsOpen)
            }}  >
            <Icon icon={'arrow-left'} width="35px" height="20px" color='#1A2565' style={{ transform: menuIsOpen ? "rotate(0deg)" : "rotate(180deg)", transition: "all 0.5s ease 0s" }} />
        </DivMenuItem>
    );
}
