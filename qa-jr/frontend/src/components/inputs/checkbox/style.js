
import styled from "styled-components"
import '../../../assets/fonts.css'

const checkBoxDiv = styled.div`
display: flex;
position: relative;
align-items: center;

&  {
    display: flex;
    position: relative;
    margin: ${props => props.margin || "0 15px 0 0 "};
    padding: 6px;
}

& input {
    position: absolute;
    opacity: 0;
    cursor: ${props => props.disabled ? "default" : "pointer"};
    z-index: 999;
    width: 100%;
    height: 100%;
}

& span {
    max-height: ${props => props.size || "18px"};
    max-width: ${props => props.size || "18px"};
    min-height: ${props => props.size || "18px"};
    min-width: ${props => props.size || "18px"};
    background-color:${props => props.disabled ? "#F3F3F3" : "transparent"};
    border-radius: 5px;
    transition: all 0.3s ease-out;
    border: 2px solid ${props => props.disabled ? "#ADB5BD" : "#2531A4"};
}

&:hover{
    border-radius: 5px;
    background-color: '#EDEDF2';
}

& input:checked ~ span {
    background-color: ${props => props.disabled ? "#F3F3F3" : "#2531A4"};
    border-radius: 5px;
    transform: rotate(0deg) scale(1);
    opacity:1;
    border: 2px solid ${props => props.disabled ? "#ADB5BD" : "#2531A4"};
}

& span::after {
    position: absolute;
    content: "";
    left: 12px;
    top: 12px;
    height: 0px;
    width: 0px;
    border-radius: 5px;
    border: solid ${props => props.disabled ? "#ADB5BD" : "#fff"};
    border-width: 0 3px 3px 0;
    transform: rotate(0deg) scale(0);
    opacity:1;
    transition: all 0.3s ease-out;
}

& input:checked ~ span::after {
    transform: rotate(45deg) scale(1);
    opacity:1;
    left: ${props => props.checkPositionLeft || "5px"};
    top: ${props => props.checkPositionTop || "1px"};
    width:  ${props => props.checkWidth || "5px"};
    height: ${props => props.checkHeight || "10px"};
    border: solid ${props => props.disabled ? "#ADB5BD" : "#fff"};
    border-width: 0 2px 2px 0;
    background-color: transparent;
    border-radius: 0;
}

& span::before  {
    position: absolute;
    content: "";
    left: 10px;
    top: 10px;
    width: 0px;
    height: 0px;
    border-radius: 5px;
    border: 2px solid #1A237A;
    transform: scale(0);
}

& input:checked ~ span::before {
    left: ${props => props.animationLeft || "-3px"};
    top: ${props => props.animationTop || "-3px"};
    width: ${props => props.animationSize || "18px"};
    height: ${props => props.animationSize || "18px"};
    border-radius: 5px;
    transform: scale(3);
    opacity:0;
    z-index: 999;
    transition: all 0.3s ease-out;
}

${props => props.hover ? props.hover : ""}

${props => props.divOptions}
`


export {
    checkBoxDiv as CheckBoxDiv,
}
