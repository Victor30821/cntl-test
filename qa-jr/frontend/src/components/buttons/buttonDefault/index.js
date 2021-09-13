import React from "react";
import { ButtonDefault } from "./style.js";
import { Text, Icon } from "../../../components";

export default function Button({
  title = "",
  onClick,
  form,
  hasIcon = false,
  iconConfig,
  textConfig,
  loading = false,
  disabled = false,
  color="#fff",
  ...options
}) {
  return (
    <ButtonDefault
      onClick={onClick}
      form={form}
      disabled={loading || disabled}
      {...options}
    >
      {hasIcon && <Icon {...iconConfig} />}
      <Text color={color} cursor={"pointer"} {...textConfig}>
        {loading ? "Carregando..." : title}
      </Text>
    </ButtonDefault>
  );
}
