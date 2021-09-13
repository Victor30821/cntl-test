import styled from "styled-components";
import { darken } from "polished"

const buttonDefault = styled.button(props => ({
  height:'36px',
  width: props.width || "100px",
  display: "flex",
  justifyContent: "center",
  background: props.disabled ? "#999999" : props.backgroundColor || "#1A237A",
  flexDirection: props.flexDirection || "row",
  cursor: props.disabled ? "not-allowed" : "pointer",
  alignItems: props.alignItems || "center",
  border: props.disabled
    ? "1px solid #999999"
    : props.border || "1px solid #1A237A",
  borderRadius: props.borderRadius || "4px",
  padding: props.padding || "8px 16px",
  "& *": {
    opacity: props.disabled ? "0.7" : "1",
    cursor: props.disabled ? "not-allowed" : "pointer",
  },
  "&:hover": props.hover && {
    backgroundColor: darken(0.05, props.backgroundColor || "#1A237A"),
    ...props.hover
  },
  ...props
}));

export { buttonDefault as ButtonDefault };
