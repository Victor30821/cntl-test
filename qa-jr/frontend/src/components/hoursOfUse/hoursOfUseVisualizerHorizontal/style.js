import styled from "styled-components";
import "../../assets/fonts.css";

export const DaysDiv = styled.div(props => ({
    display: "flex",
    flexDirection: "row",
    height: "150px",
    width: "inherit",
    alignItems: "center",
    "& > div":{
        margin: "0 10px"
    },
    "& > div:first-child":{
        margin: "0 10px 0 0"
    },
    "& > div:last-child":{
        margin: "0 0 0 10px"
    },
    ...props,
}))