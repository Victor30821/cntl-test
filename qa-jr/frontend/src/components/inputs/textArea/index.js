import React, { forwardRef } from "react";
import { TextAreaInput } from "./style.js";
import { InputLabel, InputDiv } from "../../../components/card/cardInput/style"

function TextArea(
  {
    placeholder,
    maxLength,
    name,
    label,
    register,
    required = false,
    onChange,
    ...option
  },
  ref
) {

  return (
    <InputDiv>
      <InputLabel>
        {label}
      </InputLabel>
      <TextAreaInput
        placeholder={placeholder}
        maxLength={maxLength ? maxLength : 9999}
        name={name}
        onChange={event => {
          event && event.persist();
          onChange && onChange(name, event.target.value);
        }}
        ref={register({
          name,
          required
        })}
        {...option}
      >
      </TextAreaInput>
    </InputDiv>
  );
}

const forwardInput = forwardRef(TextArea);
export default forwardInput;
