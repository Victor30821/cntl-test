import styled from "styled-components";

const InputNormal = styled.input(props => ({
  background: props.readOnly ? "#F3F3F3" : "#FFFFFF",
  border: props.error ? "1px solid #FD3995" : "1px solid #E5E5E5",
  color: props.readOnly ? "#868E96" : "#000",
  boxSizing: "border-box",
  maxHeight: "36px",
  borderRadius: "4px",
  flex: "1",
  padding: "10px 16px",
  outline: "none",
  fontSize: "13px",
  paddingRight: "30px",
  "&[type=number]::-webkit-inner-spin-button, &[type=number]::-webkit-outer-spin-button": {
    appearance: "none",
  },
  "&[type=number]": {
    appearance: "textfield"
  },
  ...props,
}));

const AfterError = `
 &:after {
    content: "x";
  }
`;

const InputDefault = styled(InputNormal)`
  ${props => props.error && AfterError};
`;

export { InputDefault };
