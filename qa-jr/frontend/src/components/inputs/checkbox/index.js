import React from "react";
import { CheckBoxDiv } from "./style";
import { Text } from "../../../components";

export default function CheckBox({
  title,
  disabled = false,
  defaultChecked,
  checked = false,
  onChange,
  divOptions = {},
  ...props
}) {
  return (
    <CheckBoxDiv style={divOptions} disabled={disabled}>
      <input
        type={"checkbox"}
        checked={checked}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={(event) => {
          event.persist();
          onChange && onChange(event.target.checked);
        }}
      />
      <span />
      <Text
        marginLeft={"10px"}
        fontWeight={"bold"}
        fontSize={"13px"}
        color={"#666666"}
        {...props.textOptions}
      >
        {title}
      </Text>
    </CheckBoxDiv>
  );
}
