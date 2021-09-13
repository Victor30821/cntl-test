import React from "react";
import { Icon } from "components";
import { ArrowStyle } from './style';
import "./style.css";

export default function VehiclePin({
  newIcons = false,
  rotate,
  text,
  hasText,
  icon,
  iconColor = "#1A237A",
  showVehicleName = false,
  optionsWrapper = {},
  optionsIcons = {},
  optionsArrow = {},
  ...options
}) {
  if (newIcons && icon) return (
    <div style={{cursor:'pointer'}} onClick={options?.onClick}>
      {showVehicleName && (
        <span id="vehicleName" style={{ color: "white" }}>
          {options.name}
        </span>
      )}
      <Icon
        divProps={{display:'flex',justifyContent:'center'}}
        transform={"rotate("+rotate+")"}
        icon={icon}
        width={"34px"}
        height={"34px"}
        color={iconColor}
        {...optionsIcons}
      />
    </div>
  );
  return (
    <div id="vehiclePinWrapper" onClick={options?.onClick}>
      {showVehicleName && (
        <span id="vehicleName" style={{ color: "white" }}>
          {options.name}
        </span>
      )}
      <div
        id="vehiclePinDefault"
        {...options}
        style={{
          border: `3px solid ${options.borderColor}`,
          backgroundColor: options.backgroundColor,
        }}
          >
        {icon && (
          <Icon
          icon={icon}
          width={"35px"}
          height={"30px"}
          style={{marginTop: "4px", paddingLeft: "1px"}}
          color={iconColor}
          {...optionsIcons}
          />
          )}
          <ArrowStyle {...optionsArrow} borderTop={`5px solid ${options.borderColor}`}/>
        {hasText && <span id="textStyle">{text}</span>}
      </div>
    </div>
  );
}
