import React, { forwardRef } from "react";
import { FileUpInput, FileLabel, FileDiv } from "./style.js";
import { InputLabel, InputDiv } from "../../../components/card/cardInput/style"
import { Icon } from '../../../components'

function FileInput(
  {
    placeholder,
    name,
    label,
    id,
    ...option
  },
  ref
) {
  
  return (
    <InputDiv>
      <InputLabel>
        {label}
      </InputLabel>
        <FileUpInput
            {...option}
            id={id}
            name={name}
            type={"file"}
        >
        </FileUpInput>
        <FileLabel
          htmlFor={id}
        >
          <FileDiv>
            <Icon icon={"paperclip"} width={'16px'} height={'16px'} color='#868E96' />
          </FileDiv>
          {placeholder}
        </FileLabel>
    </InputDiv>
  );
}

const forwardInput = forwardRef(FileInput);
export default forwardInput;
