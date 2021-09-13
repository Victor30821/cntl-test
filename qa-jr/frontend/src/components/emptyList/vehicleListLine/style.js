
import styled from 'styled-components';

const vehicleListLineDivDefault = styled.div(props => ({
    display: "flex",
    alignItems: "center",
}));

const vehicleListLineContainer = styled(vehicleListLineDivDefault)(props => ({
    alignItems: "center",
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '12px 16px 12px 24px',
    flexWrap: 'wrap',
    ...props.style,
}));

const vehicleListLineIconList = styled(vehicleListLineDivDefault)(props => ({
    alignItems: "center",
    flexWrap: 'wrap'
}));

const vehicleListLineIcon = styled(vehicleListLineDivDefault)(props => ({...props.style}));

export {
    vehicleListLineContainer as VehicleListLineContainer,
    vehicleListLineIconList as VehicleListLineIconList,
    vehicleListLineIcon as VehicleListLineIcon,
}