
import styled from 'styled-components';

export const ColorfulListStyle = styled.div(props => ({
    background: "#FFFFFF",
    transition: "all 0.2s ease-out",
    display: "flex" ,
    opacity: props.show ? "1" : "0",
    alignItems: "start",
    borderRadius: "4px 4px 0px 0px",
    marginTop: "5px",
    width: "100%",
    height: '100%',
    boxShadow: "0px 8px 13px rgba(49, 48, 99, 0.08)",
    ...props,
}))
export const ListStyle = styled.div(props => ({
    padding: "0px",
    width: "100%",
    maxHeight: `222px`,
    overflow: "scroll",
    "& div": {
        display: "flex",
        transition: "all 0.2s ease-out",
    },
    "& > div": {
        flexDirection: "row"
    }
}))

export const NoVehicleFoundContainer = styled.div`
	margin-top: 36px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100%;
	color: #505050;
`;

export const NoVehicleFoundTitle = styled.p`
	font-size: 1.3em;
	padding: 4px;
	font-weight: 500;
`;

export const NoVehicleFoundSubtitle = styled.p`
	max-width: 75%;
	text-align: center;
	line-height: 1.25em;
	padding: 4px;
`;

export const NoVehicleFoundImageContainer = styled.div`
	img {
		height: 200px;
		width: 200px;
	}
`;

