import React, { memo } from 'react';
import { Text } from '../../components'
import { InitStateWrapper } from './style'
function InitStateContainer({ title, subtitle, ...options }) {
    return (
        <InitStateWrapper {...options.containerOptions}>
            <Text fontSize={"19px"} fontWeight={"bold"} color={"#505050"} marginBottom={"15px"} {...options.titleOptions}>{title}</Text>
            <Text fontSize={"16px"} color={"#505050"} {...options.subtitleOptions}>{subtitle}</Text>
        </InitStateWrapper >
    );
}
export default memo(InitStateContainer)