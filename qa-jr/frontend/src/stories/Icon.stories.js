import React from "react";
import { action } from "@storybook/addon-actions";
import { Icon, Text } from "../components";
import iconJson from "../assets/icons.json";

export default {
  title: "Icons"
};

export const AllIcons = () => (
  <>
    <Text size="30px">Icones</Text>
    <Icon icon={'phone'} width={'30px'} height={"20px"} color='#1a2565' />
    {iconJson.icons.map((item, index) => {
      return (
        <>
          <Icon
            onClick={action(item.properties.name)}
            icon={item.properties.name}
            width={"30px"}
            height={"20px"}
            color="#000"
            viewBox="0 0 14 14"
          />
          <Text size="20px">{item.properties.name}</Text>
        </>
      );
    })}
  </>
);
