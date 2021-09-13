import React from "react";
import Select, { createFilter } from "react-select";
import CreatableSelect from 'react-select/creatable';
import { Container, Title } from "./styles";
import { Text } from "components";
import { localizedStrings } from "constants/localizedStrings";
import HelpIconWithTooltip from "../helpIconWithTooltip";

export default ({
  options,
  title,
  required = false,
  placeholder,
  loading,
  disabled,
  value = "",
  isMulti = false,
  customStyle,
  selectOption,
  onChange = () => { },
  error = false,
  icon,
  errorText = "",
  isCreatable,
  emptyStateText = localizedStrings.noOptions,
  showHelpTooltip,
  helpTooltipMessage,
  autoFocus,
  createMessage = localizedStrings.create + ": ",
  ...props
}) => {

	const checkOnChange = (...values) => {
		const firstElementIsNull = values.length > 0 && values[0] === null && isMulti;

		if(firstElementIsNull) return onChange([], ...values.slice(1));

		return onChange(...values);
	}

  return (
    <Container style={props.style} disabled={disabled}>
      {
       title && (<div>
          <Title>
            {title + " "}
            {required ? <span>*</span> : ""}
            {showHelpTooltip && <HelpIconWithTooltip text={helpTooltipMessage} />}
          </Title>
          {icon ? (
            icon
          ) : null}
        </div>)
      }
      {
        isCreatable
          ? <CreatableSelect
            isMulti={isMulti}
            className={`react-select ${error ? "error" : ""}`}
            classNamePrefix={"react-select"}
            name="form-field-name"
            options={options}
            formatCreateLabel={(name) => createMessage + name}
            placeholder={placeholder}
            onCreateOption={props.onCreate}
            isLoading={loading}
            isDisabled={disabled}
            value={value}
            onChange={checkOnChange}
            noOptionsMessage={() => emptyStateText}
            {...props.config}
          />
          : <Select
            isMulti={isMulti}
            className={`react-select ${error ? "error" : ""}`}
            classNamePrefix={"react-select"}
            name="form-field-name"
            options={options}
            placeholder={placeholder}
            styles={customStyle}
            isLoading={loading}
            isDisabled={disabled}
            value={value}
            onChange={checkOnChange}
            noOptionsMessage={() => emptyStateText}
            autoFocus={autoFocus}
            filterOption={createFilter(props?.filterConfig || {})}
            {...props}
          />
      }
      {error ? (
        <Text color="#fd3995" textAlign="right">
          {errorText}
        </Text>
      ) : null}
    </Container>
  );
};
