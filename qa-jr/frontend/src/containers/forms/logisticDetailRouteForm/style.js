import styled from "styled-components";
import { Col as Colxx } from "components";
export const Col = styled(Colxx)`
  margin-bottom: 10px;
`;

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

export const FlexColumnLast = styled.div(props => ({
  display: "flex", 
  flexDirection: "column",
  marginBottom: "0px",
  ...props
}));

export const SpaceBetweenItens = styled.hr(props => ({
  marginTop: "0px",
  ...props
}))