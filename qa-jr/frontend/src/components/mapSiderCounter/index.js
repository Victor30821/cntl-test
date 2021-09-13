import React, { useState, useEffect } from 'react'
import { localizedStrings } from 'constants/localizedStrings'
import { SideCountDiv } from "../../containers/mapControls/style";

const MapSiderCounter = ({ loadVehiclesOnMap, restartTimer, setRestartTimer }) => {
	const SECONDS_MAP_RELOAD = 16;
    const [secondsToUpdate, setSecondsToUpdate] = useState(SECONDS_MAP_RELOAD);

    const GetTextUpdateSecondsLeft = () => {
        if (secondsToUpdate === SECONDS_MAP_RELOAD) return `${localizedStrings.updating}...`
        return `${localizedStrings.updateIn} ${secondsToUpdate} ${localizedStrings.seconds}`
    };

    useEffect(() => {
        if (secondsToUpdate > 0 && !restartTimer) {
            setTimeout(() => setSecondsToUpdate(secondsToUpdate - 1), 1000);
            setRestartTimer(false);
        }
        else {
            loadVehiclesOnMap();
            setSecondsToUpdate(SECONDS_MAP_RELOAD);
            setRestartTimer(false)
        }
        // eslint-disable-next-line
    }, [secondsToUpdate])

    return (
        <SideCountDiv onClick={() => loadVehiclesOnMap()}>
            <GetTextUpdateSecondsLeft
                secondsToUpdate={secondsToUpdate}
            />
        </SideCountDiv>
    )
};

export default MapSiderCounter
