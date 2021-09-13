
import styled from "styled-components"
import '../../../assets/fonts.css'

const radioButtonDiv = styled.div`
display: flex;
& input[type=radio]{

  visibility: hidden;
  position: absolute;
}
& input[type=radio] + p:before, & input[type=radio] + label:before{
  height:15px;
  width:15px ;
  margin-right: 4px;
  content: " ";
  display:inline-block;
  vertical-align: baseline;
  border: 0.5px solid #ADB5BD;
}
& input[type=radio]:checked + p:before, & input[type=radio]:checked + label:before{
  background: #2531A4;
  border: 2px solid #1A237A;

}
& p span, & label span{
    width: 5px;
    position: absolute;
    height: 5px;
    background: #fff;
    left: 5px;
    border-radius: 50%;
}


& input[type=radio] + p:before, & input[type=radio] + label:before{
    border-radius:50%;
}
& input[type=radio] + p, & input[type=radio] + label{
    color: #666666
}
& input[type=radio]:checked + p, & input[type=radio]:checked + label{
    font-weight: bold;
    color: #666666
}
& p, & label{
    display: flex;
    align-items: center;
    flex-direction: row;
    position: relative;
}
${props => props}
`



export {
    radioButtonDiv as RadioButtonDiv,
}
