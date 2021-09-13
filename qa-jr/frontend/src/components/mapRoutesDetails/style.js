
import styled from 'styled-components';

export const RouteDetailsWrapper = styled.div(props => ({
	width: "100%",
    background: "#FFFFFF",
    transition: "all 0.2s ease-out",
    display: "flex",
    opacity: props.show ? "1" : "0",
    alignItems: "center",
    borderRadius: "4px 4px 0px 0px",
    marginTop: "5px",
    padding: "10px",
    boxShadow: "0px 8px 13px rgba(49, 48, 99, 0.08)",
    flexDirection: "column",
    ...props,
}))
export const RouteDetails = styled.div(props => ({
    width: "100%",
    height: "100%",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
}))
export const RouteButtons = styled.div(props => ({
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: "10px",
}))

export const DataRow = styled.div(props => ({
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    "& > *:first-child": {
        marginLeft: "0px",
    },
    "& *": {
        fontSize: "15px",
    },
    "& span": {
        fontWeight: "bold",
        marginRight: "5px",
    },
    "& p": {
        marginTop: "10px",
    }
}))

export const ContainerVehicleName = styled.div`
    position: relative;
    align-items: center;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid #E5E5E5;
    padding-bottom: 10px;
`;

export const DetailsContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

