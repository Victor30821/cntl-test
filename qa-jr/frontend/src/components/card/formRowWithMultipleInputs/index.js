import React from "react";
import {
    FormRowWithMultipleInputsStyle,
    InputDiv,
    InputLabel,
} from "../cardInput/style";
import { Input, Text } from "components";
import HelpIconWithTooltip from "../../helpIconWithTooltip";

export default function FormRowWithMultipleInputs({
    inputs = [],
    onChange = () => { },
    onFocus = () => { },
    onBlur = () => { },
    register = () => { },
    ...options
}) {
    const getIcon = ({ icon }) => {
        if (typeof icon === 'function') return icon();
        return icon;
    };
    return (
        <FormRowWithMultipleInputsStyle {...options}>
            {inputs
            .filter(input => input)
            .map((input, index) => {
                return (
                    <InputDiv {...options} {...input.style} key={index} justifyContent="center">
                        <div>
                            {input.iconBeforeText && getIcon(input)}
                            <InputLabel required={input.required}>
                                {" "} {input.label} <span>*</span>{" "} 
                                {input.showTooltip && <HelpIconWithTooltip text={input.tooltipMessage}/>}
                            </InputLabel>
                            {input.iconAfterText && getIcon(input)}
                        </div>
                        <Input
                            defaultValue={input.initialValue}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            ref={register({
                                required: input.required ? true : false
                            })}
                            onChange={event => {
                                event && event.persist();
                                onChange && onChange(input.name, event.target.value);
                            }}
                            onFocus={() => onFocus && onFocus()}
                            onBlur={() => onBlur && onBlur()}
                            name={input.name}
                            {...input}
                        />
                        {input.error ? (
                            <Text textAlign="right" color="#FD3995">
                                {input.errorText}
                            </Text>
                        ) : null}
                    </InputDiv>
                );
            })}
        </FormRowWithMultipleInputsStyle>
    )
}
