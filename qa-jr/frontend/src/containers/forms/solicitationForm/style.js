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
