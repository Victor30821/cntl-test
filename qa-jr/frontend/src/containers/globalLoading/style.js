
import styled from 'styled-components';

export const BackgroundLayer = styled.div(props => ({
    position: "absolute",
    top: "0",
    width: "100%",
    height: "inherit",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#07061F70",
    "& div": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    "&>div": {
        minWidth: "350px",
        minHeight: "250px",
        borderRadius: "20px",
        background: "radial-gradient(#fff,#fff,#FFFFFF90)",
    },
    "&>div>div:first-child": {
        margin: "auto 0 20px 0",
    },
    "&>div>div:last-child": {
        margin: "20px 0 auto 0",
    },
    ...props
}))

export const LoadingSpinStyle = styled.div(props => ({
    border: `${props.weight || "6px"} solid ${props.backColor || "transparent"}`,
    borderRadius: "50%",
    borderTop: `${props.weight || "6px"} solid ${props.frontColor || "#1a2565"}`,
    borderLeft: props.halfColored && `${props.weight || "6px"} solid ${props.frontColor || "#1a2565"}`,
    width: props.size || "70px",
    height: props.size || "70px",
    animation: "spin 2s linear infinite",
    ...props,
}))
