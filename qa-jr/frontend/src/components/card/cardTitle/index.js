import React from 'react';
import { CardTitleStyle } from '../style'
import { Text } from '../../../components'
export default function CardTitle({ children, ...options }) {
    return (
        <CardTitleStyle {...options.divOptions}>
            <Text {...options} >{children}</Text>
            {options.icon && options.icon()}
        </CardTitleStyle>
    )
}