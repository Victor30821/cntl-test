import styled from "styled-components";

const TimeRangePickerStyle = styled.div(props => ({
    cursor: 'pointer',
    padding: "0 0 22px 0",
    "& .react-timerange-picker__wrapper": {
        padding: "8px 0",
        border: props.showError ? `1px solid ${props.errorColor}` : "1px solid #E5E5E5"
    },
    "& .react-timerange-picker__range-divider": {
        cursor: "default",
    },

    "& .react-timerange-picker__inputGroup ": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    ...props,
}));


export { TimeRangePickerStyle };
