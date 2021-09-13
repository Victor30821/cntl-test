import styled from "styled-components";
import { Col as Colxx } from "components";
export const Col = styled(Colxx)`
  margin-bottom: 10px;
`;

export const ShowInformation = styled.div`
  height: 73px;
  width: 100%;
  background: rgba(46, 44, 140, 0.1);
  border: 1px solid rgba(46, 44, 140, 0.5);
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0 21px;
  font-size: 13px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1d1b84;
  b {
    font-weight: bold;
  }
`;
export const FlexDiv = styled.div(props => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  ...props,
}))

export const ServiceTypeCreation = styled.div(props => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "space-around",
  marginTop: "100px",
  ...props,
}))

export const DivServiceLogistic = styled.div(props => ({
  display: "block",
  maxWidth: "97.3%",
  border: "1px solid #dee2e6",
  ...props
}));

export const InputDateLogistic = styled.div(props => ({
  margin: "14px",
  textAlign: "center",
  ...props
}));

export const TabLogistic = styled.div(props => ({
  margin: "0px",
  ...props
}));

export const FlexRow = styled.div(props => ({
  display: "flex", 
  flexDirection: "row",
  ...props
}));

export const FlexColumn = styled.div(props => ({
  display: "flex", 
  flexDirection: "column",
  marginBottom: "14px",
  ...props
}));

export const Label = styled.p(props => ({
  display: props.display || "block",
  fontFamily: props.fontFamily || "Roboto",
  color: props.color || "#000",
  margin: props.margin || "0px",
  fontSize: props.fontSize || "13px",
  lineHeight: props.lineHeight || "18px",
  fontWeight: props.fontWeight || "normal",
  cursor: props.cursor || "normal",
  letterSpacing: props.letterSpacing,
  whiteSpace: 'nowrap',
  "& a": props.withLink && {
    color: "#1A237A",
    cursor: "pointer",
    ...props.linkProps
  },
   '@media(max-width:1366px)': {
    whiteSpace: 'nowrap'
   },
  ...props
}));