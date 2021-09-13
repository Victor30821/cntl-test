import styled from 'styled-components';

export const MapVehicleDetailsStyle = styled.div(props => ({
    display: "flex",
    padding: "8px",
    flexDirection: "column",
    width: "inherit",
    "& > div": {
        display: "flex",
        padding: "8px",
        flexDirection: "row",
        alignItems: "center",
    }
}))