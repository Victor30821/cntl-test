
import styled from 'styled-components';
import '../../../assets/fonts.css'

const switchDiv = styled.div(props => ({
    display: props.display || "flex",
    flexDirection: props.flexDirection || "row",
 }))
const switchWrapper = styled.label(props => ({
    cursor: "pointer",
    display: props.display || "flex",
    height: props.height || "21px",
    width: props.width || "34px",
    position: "relative",
    background: props.background,
    alignItems: "center",
    borderRadius: "35px",
    transition: "all 0.3s ease 0s",
    border: props.border || "2px solid #2531A4",
    padding: props.padding || "0",
    margin: props.margin || " 0 10px 0 0",
    '& > input': {
        position: "absolute",
        opacity: "0",
        width: "0px",
        height: "0px",
    },
    '& > input:checked + div': {
        transform: "translateX(13px)",
        background: "#fff",
    },

}))
const switchButton = styled.div(props => ({
    height: "17px",
    transform: "translateX(1px)",
    width: "17px",
    background: props.background,
    position: "absolute",
    borderRadius: "35px",
    transition: "all 0.3s ease 0s",

}))



export {
    switchWrapper as SwitchWrapper,
    switchButton as SwitchButton,
    switchDiv as SwitchDiv,
}