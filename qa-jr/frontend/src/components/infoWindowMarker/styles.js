import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    width: 280px;
    background: rgb(255, 255, 255);
    margin-bottom: 61px;
    border-radius: 10px;
    padding: 15px;
    flex-direction: column;
`;

export const Title = styled.h3`
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.1px;
    color: #222222;
`
export const BoxTitle = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
`;

export const OdometerText = styled.span`
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    display: flex;
    align-items: center;
    letter-spacing: 0.1px;
    color: #212529;
`;
