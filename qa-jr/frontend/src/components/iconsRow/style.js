
import styled from 'styled-components';

export const IconRowStyle = styled.div(props => ({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    flex: "1",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease-out",
    "&:hover": {
        background: "#FFFFFF",
        boxShadow: "0px 7px 17px #00000020",
    }
}))

export const IconsBlockStyle = styled.div(props => ({
    background: "#FFFFFF",
    transition: "all 0.2s ease-out",
    display: "flex",
    opacity: props.show ? "1" : "0",
    alignItems: "center",
    borderRadius: "4px 4px 0px 0px",
    boxShadow: "0px 8px 13px rgba(49, 48, 99, 0.08) inset",
    "& > div": {
        display: "flex",
        alignItems: "center",
        width: "100%",
    },
    "& > div > *": {
        minHeight: "75px",
        padding: "5px",
        textDecoration: "none",
    },
    ...props
}))

