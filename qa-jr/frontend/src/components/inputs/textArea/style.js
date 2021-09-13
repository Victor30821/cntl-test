import styled from "styled-components";

const TextArea = styled.textarea(props => ({
  background: props.readOnly ? "#F3F3F3" : "#FFFFFF",
  border: props.error ? "1px solid #FD3995" : "1px solid #E5E5E5",
  color: props.readOnly ? "#868E96" : "#000",
  boxSizing: "border-box",
  borderRadius: "4px",
  flex: "1",
  padding: "8px 16px",
  outline: "none",
  fontSize: "13px",
  paddingRight: "30px",
  minHeight: "145px",
  minWidth: "100%"
}));

const AfterError = `
 &:after {
    content: "x";
  }
`;

const TextAreaInput = styled(TextArea)`
  ${props => props.error && AfterError};
`;

export { TextAreaInput };
