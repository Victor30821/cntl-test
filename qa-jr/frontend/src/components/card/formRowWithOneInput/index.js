import React from "react";
import {
    FormRowWithOneInputStyle,
    InputDiv,
    InputLabel,
} from "../cardInput/style";
import { Input } from "components";

export default function FormRowWithOneInput({
    inputs = {},
    onChange = () => { },
    onFocus = () => { },
    onBlur = () => { },
    register = () => { },
    half = false,
    ...options
}) {

    return (
        <FormRowWithOneInputStyle width={(half && "50%") || ""} {...options}>
            <InputDiv {...options.inputDivStyle}>
                {inputs.label &&
                    <InputLabel> {inputs.label} </InputLabel>
                }
                <Input
                    ref={register({
                        required: inputs.required ? true : false
                    })}
                    name={inputs.name}
                    autoComplete="off"
                    defaultValue={inputs.initialValue}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    onChange={event => {
                        event && event.persist();
                        onChange && onChange(inputs.name, event.target.value);
                    }}
                    onFocus={() => onFocus && onFocus()}
                    onBlur={() => onBlur && onBlur()}
                    {...inputs}
                />
            </InputDiv>
        </FormRowWithOneInputStyle>
    )
}