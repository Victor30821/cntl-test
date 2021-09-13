import React, { memo } from 'react';
import { Text } from '../../components'
import { EmptyStateWrapper } from './style'
function EmptyStateContainer({ title, subtitle, ...options }) {
    return (
        <EmptyStateWrapper {...options.containerOptions}>
            <Text fontSize={"19px"} fontWeight={"bold"} color={"#182379"} marginBottom={"15px"} {...options.titleOptions}>{title}</Text>
            <Text fontSize={"16px"} color={"#182379"} {...options.subtitleOptions}>{subtitle}</Text>
        </EmptyStateWrapper >
    );
}
export default memo(EmptyStateContainer)