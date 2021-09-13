import styled from "styled-components";

const CustomDateInputStyle = styled.input(props => ({
  background: props.readOnly ? "#F3F3F3" : "#FFFFFF",
  border: props.error ? "1px solid #FD3995" : "1px solid #E5E5E5",
  color: props.readOnly ? "#868E96" : "#000",
  boxSizing: "border-box",
  borderRadius: "4px",
  position: "relative",
  zIndex: "2",
  flex: "1",
  margin: "0",
  opacity: "0",
  padding: "8px 16px",
  outline: "none",
  fontSize: "13px",
  minWidth: "100%",
  height: "36px"
}));

const DateLabelStyle = styled.label(props => ({
  position: "absolute",
  right: "15px",
  left: "15px",
  zIndex: "1",
  fontSize: "13px",
  padding: "8px 16px",
  fontWeight: "400",
  lineHeight: "1.5",
  color: "#495057",
  backgroundColor: "#fff",
  cursor: 'pointer',
  border: props.error ? "1px solid #FD3995" : "1px solid #ced4da",
  borderRadius: "0.25rem",
  textAlign: 'start',
  height: 37
}));

const DateDiv = styled.div(props => ({
  "&:nth-child(1)": {
    position: "absolute",
    top: "0",
    right: "0",
    bottom: "0",
    zIndex: "3",
    display: "flex",
    padding: ".375rem .75rem",
    lineHeight: "1.5",
    color: "#495057",
    content: "",
    backgroundColor: "#e9ecef",
    borderLeft: "inherit",
    borderRadius: "0 .25rem .25rem 0"
  }
}));
const DateRangePickerStyle = styled.div(props => ({
  cursor: 'pointer',
  ...props,
}));

const DateLabel = DateLabelStyle;

const AfterError = `
 &:after {
    content: "x";
  }
`;

const CustomDateInput = styled(CustomDateInputStyle)`
  ${props => props.error && AfterError};
`;

export { CustomDateInput, DateLabel, DateDiv, DateRangePickerStyle };
