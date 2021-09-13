import React from 'react';
import { localizedStrings } from 'constants/localizedStrings.js';
import { Icon, Text } from 'components';
import {  BoxStatus } from './style.js';

export default function StatusCommandVehicle ({ commands }) {

    const lockCommands = [1,3,5];
    const unlockCommands = [2,4,6];
    const before = commands?.before;
    const last = commands?.last;

    const isLocked = (
        last?.status === 3 && lockCommands.includes(last?.type_command_id)
    );

    const needUnlock = (
        (before?.status === 3 && lockCommands.includes(before?.type_command_id)) &&
        (last?.status !== 3 && unlockCommands.includes(last?.type_command_id))
    );

    const needLock = (
        (before?.status === 3 && unlockCommands.includes(before?.type_command_id)) &&
        (last?.status !== 3 && lockCommands.includes(last?.type_command_id))
    );

    const status = isLocked && 1 || needLock && 2 || needUnlock && 3 || 'default';

    const vehicleStatus = {
        1: () => (
            <BoxStatus>
                <Icon icon={"block"} width={"16px"} style={{ margin: "0 12px 0 0" }} height={"16px"} color={"#FF2C5E"} />
                <Text fontWeight={'bold'} color={"#FF2C5E"}>{localizedStrings.blocked}</Text>
            </BoxStatus>
        ),
        2: () => (
        
            <BoxStatus>
                <Icon icon={"clock"} width={"16px"} style={{ margin: "0 12px 0 0" }} height={"16px"} color={"#F87700"} />
                <Text fontWeight={'bold'} color={"#F87700"}>{localizedStrings.lockPending}</Text>
            </BoxStatus>
        ),
        3: () => (
            <BoxStatus>
                <Icon icon={"clock"} width={"16px"} style={{ margin: "0 12px 0 0" }} height={"16px"} color={"#F87700"} />
                <Text fontWeight={'bold'} color={"#F87700"}>{localizedStrings.unlockPending}</Text>
            </BoxStatus>
        ),
        'default': () => <></>
    }
    return vehicleStatus?.[status]?.() || vehicleStatus?.['default']?.();
}
