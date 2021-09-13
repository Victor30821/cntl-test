const initialZoom = 16;

const fitBoundsWithMaxZoom = ({
    googleMapsInstance,
    latLngArray = [],
    maxZoom = initialZoom
}) => {
    try {
        const latlngbound = new window.google.maps.LatLngBounds();
        latLngArray = latLngArray.filter(
            (coord) => (coord?.lat && coord?.lng) || (coord?.latitude && coord?.longitude)
        );
        latLngArray.forEach((coord) =>
            latlngbound.extend(
                new window.google.maps.LatLng(
                    coord.lat || coord.latitude,
                    coord.lng || coord.longitude
                )
            )
        );
        googleMapsInstance.fitBounds(latlngbound);

        const currentZoom = googleMapsInstance.getZoom();

        const updateZoom = Math.min(maxZoom, currentZoom)

        const newZoom = Number(updateZoom);

        googleMapsInstance.setZoom(newZoom);

        return true
    } catch (error) {
        return false
    }
}
export {
    fitBoundsWithMaxZoom
}