import React, { useState } from "react";
import { Switch } from "components";
import { action } from "@storybook/addon-actions";
export default {
    title: "Switch"
};

export const SwitchComponent = () => {
    const [switchState, setSwitch] = useState(false);
    return (
        <Switch
            checked={switchState}
            onCheck={() => setSwitch(!switchState)}
        />
    );
}
