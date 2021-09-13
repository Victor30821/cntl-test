import React from 'react';
import { Text } from '../../components'
import {
    FenceTooltipStyle,
} from './style.js';

export default ({ name, positionX, positionY }) => {
    return (
        <FenceTooltipStyle positionX={positionX} positionY={positionY}>
            <Text>{name}</Text>
        </FenceTooltipStyle>
    );
}