import React, { forwardRef } from "react";
import { CustomInputIcon, InputIconDiv } from "./style.js";
import { InputDiv } from "../../../components/card/cardInput/style"
import { Icon } from '../../../components'

function InputWithIcon(
  {
    onChange,
    placeholder,
    name,
    label,
    id,
    icon,
    type,
    value,
    required,
    style,
    divStyle,
    ...option
  }
) {
  return (
    <InputDiv style={{...divStyle,
    display:'flex', flexDirection:'row'}}>
        <CustomInputIcon
            {...option}
            placeholder={placeholder}
            onChange={text => onChange(text.target.value, text)}
            id={id}
            name={name}
            type={type}
        >
        </CustomInputIcon>
        <InputIconDiv
        style={{
          justifyContent: 'center',
          backgroundColor: '#f2f2f2',
          border: '1px solid #e5e5e5',
          boxSizing: 'border-box',
          borderRadius: '0px 4px 4px 0px',
          color: '#868e96',
          position:'absolute',
          zIndex:2,
          width:'34px',
          height:'100%'
        }}>
            <Icon icon={icon} width={'16px'} height={'16px'} color='#868E96' divProps={{alignSelf:'center'}} />
        </InputIconDiv>
    </InputDiv>
  );
}

const forwardInput = forwardRef(InputWithIcon);
export default forwardInput;
