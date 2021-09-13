import React from "react";
import { action } from "@storybook/addon-actions";
import { Button, ButtonWithIcon } from "components";
export default {
  title: "Buttons"
};

export const ButtonDefault = () => (
  <Button title="A" onClick={action("clicked")} />
);
export const ButtonWithIcons = () => (
  <ButtonWithIcon
    icon={"list"}
    title={"listar algo"}
    customTextColor={"#000"}
    customIconColor={"#000"}
    border={"1px solid transparent"}
    onClick={e => {
      e.persist();
      action("clicked ButtonWithIcons")
    }}
  />
);
