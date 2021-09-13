import styled from "styled-components";
export const DeleteConfirmation= styled.div(props => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-around",
    marginTop: "100px",
    ...props,
}))