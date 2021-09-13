import React from "react";
import AsyncSelect, { createFilter } from "react-select";
import CreatableSelect from 'react-select/creatable';
import { Container, Title } from "./styles";
import { Text } from "components";
import { localizedStrings } from "constants/localizedStrings";

export default ({
  options,
  title = "Title",
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
  ...props
}) => {

  const ignoreCase = false;
  const ignoreAccents = false;
  const trim = false;
  const matchFromStart = false;

  const filterConfig = {
    ignoreCase,
    ignoreAccents,
    trim,
    matchFrom: matchFromStart ? 'start' : 'any',
  };

  return (
    <Container style={props.style} disabled={disabled}>
      <div>
        <Title>
          {title + " "}
          {required ? <span>*</span> : ""}
        </Title>
        {icon ? (
          icon
        ) : null}
      </div>
      {
        isCreatable
          ? <CreatableSelect
            isMulti={isMulti}
            className={`react-select ${error ? "error" : ""}`}
            classNamePrefix={"react-select"}
            name="form-field-name"
            options={options}
            formatCreateLabel={(name) => localizedStrings.create + ": " + name}
            placeholder={placeholder}
            onCreateOption={props.onCreate}
            isLoading={loading}
            isDisabled={disabled}
            value={value}
            onChange={onChange}
            filterOption={createFilter(filterConfig)}
            noOptionsMessage={() => emptyStateText}
            {...props.config}
          />
          : <AsyncSelect
            isMulti={isMulti}
            isSearchable
            cacheOptions
            className={`react-select ${error ? "error" : ""}`}
            classNamePrefix={"react-select"}
            name="form-field-name"
            options={options}
            placeholder={placeholder}
            styles={customStyle}
            isLoading={loading}
            isDisabled={disabled}
            value={value}
            onChange={onChange}
            noOptionsMessage={() => emptyStateText}
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
