import React from 'react'
import { useSelector } from 'react-redux';
import { Polyline } from '@react-google-maps/api'
import { getRandomColor } from 'utils/getRandomColor';

export default function Fences({
    fenceTooltip,
    setShowFenceTooltip,
    ...options
}) {
    const [ fence , setFence] = React.useState(<></>);

    const {
        fences
    } = useSelector(state => state.fences);

    React.useEffect(() => {
        setFence((
            fences?.map((fence, index) => fence?.coordinates &&
                fence?.coordinates.push(fence?.coordinates[0] || {}) &&
                <Polyline
                    key={index}
                    path={fence.coordinates}
                    editable={false}
                    visible={!!fence.show_map}
                    draggable={false}
                    onMouseOver={(event) => {
                        setShowFenceTooltip({ ...fence, positionX: event.domEvent?.layerX, positionY: event.domEvent?.layerY + 40 });
                    }}
                    options={{
                        fillColor: "transparent",
                        strokeColor: getRandomColor() || '#0000FF',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        fillOpacity: 0.55,
                    }}
                    onMouseOut={() => {
                        setShowFenceTooltip(false)
                    }}
                    {...options}
                />
            )
        ))
        // eslint-disable-next-line
    }, []);

    return fence
}
