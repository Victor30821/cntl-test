import styled from "styled-components";

export const TabContainer = styled.div`
  margin: 0 24px;
  .nav-tabs {
    padding: 0 10px;
    height: 53px;
    background-color: #fff;
    background: #f7f9fa;
    border: 1px solid #dee2e6;
    box-sizing: border-box;
    border-radius: 3px 3px 0px 0px;
    display: flex;
    align-items: flex-end;
    color: #000;
    font-size: 13px;
    font-weight: bold;
    border-bottom: 0;
  }

  .nav-item {
    height: 36px;
    border-radius: 4px 4px 0px 0px;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    border-bottom: 0;
  }
  .active.nav-item {
    background: #ffffff;
    border: 1px solid #dee0e1;
    border-bottom: 0;
  }
  .nav-link {
    &:hover {
      border: 1px solid transparent;
    }
  }
  .active > .nav-link {
    &:hover {
      border: 1px solid transparent;
    }
  }

  .inactive.nav-item {
    color: #666;
  }
  .error.nav-item {
    color: #fd3995;
  }
`;

export const TabFormContent = styled.div`
  margin: 0 24px;
  padding: 25px 15px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-top: 0;
  border-radius: 0px 0px 4px 4px;
`;
