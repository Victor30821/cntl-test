
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
const ImageContainer = styled.div(props => ({
    display: "flex",
    justifyItems: "center",
    alignItems: "center",
    position: "relative",
    "& > div:first-child": {
        left: "100px",
        transformOrigin: "140px center",
    },
    "& > div:last-child": {
        right: "100px",
        bottom: "110px",
        transformOrigin: "-95px center",
    },
    "& > div:not(:nth-child(2))": {
        position: "absolute",
        display: "flex",
        flex: "1",
        justifyContent: "center",
        animation: "module 6s infinite linear",
        "& > img": {
            animation: "module_img 6s infinite linear",
        }
    },
    "& > div:nth-child(2)": {
        display: "flex",
        justifyContent: "center",
        borderRadius: "140px",
        background: "#dddfeb59",
        margin: "0 auto",
        width: "250px",
        height: "250px",
        "& > img": {
            width: "140px"
        }
    },
    ...props
}))

export {
    ModalContent,
    ConfirmCheckboxWrapper,
    ConfirmButtonsWrapper,
    ImageContainer,
}