import styled from "styled-components";
import "../../assets/fonts.css";

export const VehiclePinDefault = styled.div(props => ({
    height: "40px",
    width: "40px",
    borderWidth: "4px",
    borderStyle: "solid",
    borderRadius: " 25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
        position: "absolute",
        left: "0%",
        top: "5px",
        ...props.iconOptions
    },
    "& span": {
        borderTop: "5px solid " + props.borderColor,
    },
    ...props
}))

export const ArrowStyle = styled.span(props => ({
    marginTop: "2px",
    width: "10px",
    height: "10px",
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    ...props
}))