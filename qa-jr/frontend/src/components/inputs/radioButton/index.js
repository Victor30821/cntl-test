import React, { useState, useEffect } from 'react';
import { RadioButtonDiv } from './style';
import { Text } from '../../../components'

export default function RadioButton({ name, inputs = [], onChange = () => { }, ...props }) {

    const getDefaultInputIndexChecked = () => {
        const [index] = inputs
            .map((input, index) => {
                if (input.default) return index;
                return false;
            })
            .filter(input => input !== false);
        return index
    }
    const [radioButton, setRadioButton] = useState(0);

    useEffect(() => {
        setRadioButton(
            getDefaultInputIndexChecked()
        )
        // eslint-disable-next-line
    }, [])

    const onCheck = (e, input) => {
        input.onChange && input.onChange(e, input);
        onChange(e);
    }

    return (
        <RadioButtonDiv {...props.divOptions}>
            {inputs?.map((input, index) => {

                return (
                    <>
                        <input
                            type={"radio"}
                            name={name}
                            id={name + index}
                            checked={radioButton === index}
                            onClick={(e) => {
                                e.persist()
                                onCheck(e, input);
                                setRadioButton(index)
                            }}
                            value={input.value || ""}
                            ref={input?.ref}
                        />
                        <Text
                            cursor={"pointer"}
                            as={"label"}
                            margin={index === 0
                                ? "auto 0 8px 0px"
                                : "auto 0 8px 16px"
                            }
                            htmlFor={name + index}>
                            {input.text}
                            <span></span>
                        </Text>
                    </>
                )
            })}

        </RadioButtonDiv>
    );
}
