import styled from "styled-components";
import "../../assets/fonts.css";

export const PinDefault = styled.div(props => ({
    height: "50px",
    width: "50px",
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
export const PinName = styled.div(props => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0px 20px",
    backgroundColor: "#1D1B84",
    borderRadius: "8px",
    marginBottom: "2px",
    ...props
}))
export const PinWrapper = styled.div(props => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexDirection: "column",
    ...props
}))
export const PinDiv = styled.div(props => ({
    display: "flex",
    alignItems: "center",
    ...props
}))
export const ArrowStyle = styled.span(props => ({
    bottom: "-13px",
    left: " 50%",
    marginLeft: " -5px",
    width: "10px",
    height: "10px",
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    position: "absolute",
    ...props
}))