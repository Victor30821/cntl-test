import styled from "styled-components";
const cardFormStyle = styled.div(props => ({
  padding: "16px",
  position: "relative",
  margin: "10px 0 10px 0",
  display: "flex",
  flexDirection: "column"
}));

export const TabFormContent = styled.div`
  margin: 0 24px;
  padding: 25px 15px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-top: 0;
  border-radius: 0px 0px 4px 4px;
`;

export const HeaderTab = styled.div`
  width: 100%;
  height: ${props => (props.first ? "40px" : "65px")};
  font-weight: bold;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  line-height: ${props => (props.first ? "25px" : "65px")};
  margin-bottom: 24px;
`;

export const CheckBoxContent = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  span {
    font-weight: bold;
    font-size: 13px;
    margin-left: 13pc;
  }
`;

export { cardFormStyle as CardContent };
