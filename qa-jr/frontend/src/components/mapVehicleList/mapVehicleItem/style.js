import styled from 'styled-components';

export const VehicleItemStyle = styled.div(props => ({
    flexDirection: "column",
    flex: "1",
    padding: "8px",
    cursor: props.clickable ? "pointer" : "normal",
    "& >div": {
        display: "flex",
        flexDirection: "row",
        flex: "1",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "8px"
    },
    "&:hover": {
        background: "#ECECF5",
    },
}))
export const IconItemStyle = styled.div(props => ({
    minWidth: "35px",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    height: '100%',
    "&:hover": {
        background: "#ECECF5",
    },
}))
export const VehicleItemWrapper = styled.div(props => ({
    display: "flex",
    transition: "all 0.2s ease-out",
    borderBottom: "1px solid #E5E5E5",
    "& div": {
        display: "flex",
        transition: "all 0.2s ease-out",
    },
}))

export const ContainerActions = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`;

export const BoxStatus =  styled.div`
    display: flex;
    flex-direction: row;
`;

export const BoxName =  styled.div`
    display: flex;
    flex-direction: row;
`;

export const ButtonSMS = styled.button`
    border: 1px solid #1A237A;
    border-radius: 4px;
    flex-direction: row;
    cursor: pointer;
    text-align: center;
    background: #1A237A;
    width: 27px;
    height: 27px;
    color: #fff;
    font-size: 10px;
    z-index: 9999;
`
export const BoxButtonSendSMS = styled.div`
    z-index: 99999;
`;

export const PlateBox = styled.div`
    color: rgb(255, 255, 255);
    background: rgb(183, 183, 183);
    border-radius: 2px;
    width: 66px;
    height: 18px;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    justify-content: center;
    align-items: center;
`;

export const Status = styled.div`
    background: ${props => props.color || '#808080'};
    height: 18px;
    width: 5px;
    margin-right: 7px;
    border-radius: 20px;
`;
