
import styled from 'styled-components';

const ModalContent = styled.div(props => ({
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingLeft: "16px",
    paddingRight: "16px",
    "& > div": {
        display: "flex",
        justifyContent: "center",
    },
    "& > p:first-child": {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "14px",
        lineHeight: "22px",
    },
    "& > p:not(:first-child)": {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "22px",
        letterSpacing: "0.1px",
        color: "#505050",
        textAlign: "left",
        display: "list-item",
        marginLeft: "20px",
        whiteSpace: "normal",
    },
    ...props
}))
const ConfirmCheckboxWrapper = styled.div(props => ({
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "16px 0",
    ...props
}))
const ConfirmButtonsWrapper = styled.div(props => ({
    width: "100%",
    margin: "0",
    flexDirection: "row",
    ...props
}))

export {
    ModalContent,
    ConfirmCheckboxWrapper,
    ConfirmButtonsWrapper,
}