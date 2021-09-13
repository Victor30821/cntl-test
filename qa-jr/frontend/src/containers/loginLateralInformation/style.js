import styled from "styled-components";





export const ContainerInfo = styled.div`
  width: calc(100% - 420px);
  display: ${(props) => (props.active ? "block" : "none")};
  background-color: #2e2c8c;
  padding-left: 48px;
  padding-top: 30px;
  padding-bottom: 50px;
  height: 100%;
  box-shadow: 5px 0px 7px 0px #00000050 inset;
  & div {
    flex: 1;
  }
`;

export const ContentInfoLeft = styled.div`
  padding: inherit; 
  width: inherit;
  img {
    padding: inherit; 
    width: inherit;
  }
  @media (max-width: 1150px) {
    img {
      display: none
    }
    .login-topics-text{
      max-width: 100%
    }
  }
`;


export const Br = styled.div`
  height: ${(props) => props.height || "30px;"};
  width: 100%;
`;
