import styled from "styled-components";
export const StatusChangeConfirmation= styled.div(props => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems:"center",
    justifyContent: "space-around",
    marginTop: "100px",
    ...props,
}))