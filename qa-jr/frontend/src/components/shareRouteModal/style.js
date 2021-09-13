import styled from "styled-components";
import "../../assets/fonts.css";

export const ShareRouteModalContainer = styled.div(props => ({
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
    height: "100%",
    "& > div": {
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        ...props.childDiv
    },
    "& > div div": {
        display: "flex",
        flexDirection: "row",
    },
    ...props
}));

