import React, { useState } from "react";
import { RadioButton } from "components";
import { action } from "@storybook/addon-actions";
export default {
    title: "RadioButton"
};

export const RadioButtonContainer = () => {
    const [radioButton, setRadioButton] = useState(false);
    return (
        <RadioButton
            name={'nome-do-radio-button'}
            onChange={() => action("radio changed!")}
            inputs={[
                {
                    default: true,
                    text: "texto do input 1",
                    value: "1",
                    onChange: () => {
                        setRadioButton({ value: 1 })
                        action("radio 1 changed!")
                    }
                },
                {
                    default: false,
                    text: "texto do input 2",
                    value: "2",
                    onChange: () => {
                        setRadioButton({ value: 2 })
                        action("radio 2 changed!")
                    }
                },

            ]}
        />
    );
}
