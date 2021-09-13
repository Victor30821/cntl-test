import styled from "styled-components";
import { TextDefault } from "../../../components/text/style";
const formRowWithMultipleInputsStyle = styled.div(props => ({
  display: "flex",
  justifyContent: "center",
  ...props,
}));
const formRowWithOneInputStyle = styled.div(props => ({
  margin: "0px 0 0 0",
  display: "inline-flex",
  flexDirection: "column",
  width: props.width || "100%",
  ...props,
}));
const inputDiv = styled.div(props => ({
  margin: "10px",
  flex: "1",
  display: "flex",
  width: props.width || "100%",
  justifyContent: "flex-end",
  flexDirection: "column",
  "& > div": {
    margin: "0",
    flex: "1",
    display: "flex",
    width: props.width || "100%",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  border: props.error && '1px solid #fd3995',
  ...props
}));
const inputLabel = styled(TextDefault)(props => ({
  display: "flex",
  fontWeight: "bold",
  margin: "0 0 5px 0",
  color: "#666",
  "& span": props.required
    ? {
      color: "#f00"
    }
    : {
      display: "none"
    },
  '@media(min-width:1440px)': {
    marginLeft: '7px'
  },
}));

const selectedItemDiv = styled.div(props => ({
  position: "absolute",
  left: "0",
  display: "flex",
  cursor: "pointer"
}));

export {
  formRowWithMultipleInputsStyle as FormRowWithMultipleInputsStyle,
  formRowWithOneInputStyle as FormRowWithOneInputStyle,
  inputDiv as InputDiv,
  inputLabel as InputLabel,
  selectedItemDiv as SelectedItemDiv
};
