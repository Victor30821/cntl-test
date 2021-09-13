import React from "react";
import { CardStyle, PlaceholderAnimation } from "./style";
export default function Card({
  loading,
  fail,
  onFail = () => "fail",
  ...options
}) {
  if (fail) return onFail();
  return (
    <CardStyle {...options}>
      {
        options.children
      }
      {
        loading && <PlaceholderAnimation />
      }
    </CardStyle>
  );
}
