import React, { useState } from "react";
import { Checkbox } from "components";
import { action } from "@storybook/addon-actions";
export default {
    title: "Checkbox"
};

export const CheckboxComponent = () => {
    const [checkbox, setCheckbox] = useState(false);
    return (
        <Checkbox
            checked={checkbox}
            title={"titulo do checkbox"}
            onChange={val => {
                setCheckbox(val)
                action(val ? "checked" : "not checked")
            }}
        />
    );
}
