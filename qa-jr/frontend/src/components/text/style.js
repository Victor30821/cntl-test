import styled from "styled-components";
import "../../assets/fonts.css";

const textDefault = styled.p(props => ({
  display: props.display || "block",
  fontFamily: props.fontFamily || "Roboto",
  color: props.color || "#000",
  margin: props.margin || "0px",
  fontSize: props.fontSize || "13px",
  lineHeight: props.lineHeight || "18px",
  fontWeight: props.fontWeight || "normal",
  cursor: props.cursor || "normal",
  whiteSpace: props.whiteSpace || "nowrap",
  letterSpacing: props.letterSpacing,
  "& a": props.withLink && {
    color: "#1A237A",
    cursor: "pointer",
    ...props.linkProps
  },
   '@media(max-width:1630px)': {
    whiteSpace: 'normal'
   },
  ...props
}));

export { textDefault as TextDefault };
