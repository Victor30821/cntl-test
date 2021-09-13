import styled from "styled-components";

export const AvailableModuleBtn = styled.button(props => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    color: "#192379",
    border: "1px solid #1D1B84",
    borderRadius: "4px",
    height: "36px",
    width: "unset",
    padding: "12px 8px",
    "&:hover": {
        backgroundColor: "#F5F5FF"
    }
}));
