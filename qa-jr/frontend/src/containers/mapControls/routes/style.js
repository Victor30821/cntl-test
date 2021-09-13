import styled, { css } from 'styled-components';

export const DetailsContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

export const RouteOnGoingTooltip = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;
    width: 265px;
    height: 214px;
    background-color: #fff;
    border: 2px solid #1D1B84;
    border-radius: 4px;
    position: relative;

    ${props =>
      props.showOngoingTooltip ?
      css`
        display: flex;
      ` :
      css`
		display: none;
      `}

    img {
        margin-top: 20px;
    }

    p {
        text-align: center;
        line-height: 16px;
        font-size: 14px;
        font-weight: 700;
        color: #505050;
        width: 250px;
        position: absolute;
        top: 130px;

        span {
            display: inline-block;
            margin-top: 8px;
            font-weight: 400;
            font-size: 12px;
        }
    }
`;

export const RouteOnGoingTextDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: 2px solid #1D1B84;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;

    p {
        display: inline-block;
        margin-left: 8px;
        color: #1D1B84;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
    }
`;

export const RouteOnGoingContainer = styled.div`
    position: relative;
    left: 340px;
    top: 15px;
    width: 265px;
`;
