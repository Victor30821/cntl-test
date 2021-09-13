import React from "react";
import { Text, Icon, Card, CardTitle } from "../../components";
import { FailStateWrapper } from "./style";
export default function FailStateContainer({
  title,
  titleError,
  subtitleError,
  customTitleColor,
  ...options
}) {
  return (
    <Card>
      <CardTitle color={"#333"} fontWeight={"bold"} fontSize={"14px"}>
        {title}
      </CardTitle>
      <FailStateWrapper {...options.containerOptions}>
        <div>
          <Icon
            icon={"plus"}
            width={"25px"}
            height={"19px"}
            color={customTitleColor || "#FD3995"}
          />
          <Text
            fontSize={"19px"}
            fontWeight={"bold"}
            color={customTitleColor || "#FD3995"}
            marginBottom={"15px"}
            {...options.titleOptions}
          >
            {titleError}
          </Text>
        </div>
        {subtitleError}
      </FailStateWrapper>
    </Card>
  );
}
