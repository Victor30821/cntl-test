import React, { memo } from "react";
import { Icon } from "components";
import { ReportCardDiv, ReportCardTitle, ReportCardValue } from "./style";

const CardReportFilter = ({
  icon,
  iconColor,
  label,
  value,
  isSelected,
  handleCard,
  useFontAwesome = false,
  ...props
}) => {

  return (
    <ReportCardDiv
      className="defaultBoxShadow"
      onClick={handleCard && (() => handleCard(!isSelected))}
      isSelected={isSelected}
      style={handleCard && { cursor: "pointer" }}
      {...props}
    >
      <ReportCardTitle>{label}</ReportCardTitle>
      <ReportCardValue>{value}</ReportCardValue>
      <Icon useFontAwesome={useFontAwesome} icon={icon} size={"4x"} color={"#C8C7EB"}/>
    </ReportCardDiv>
  );
};

export default memo(CardReportFilter);
