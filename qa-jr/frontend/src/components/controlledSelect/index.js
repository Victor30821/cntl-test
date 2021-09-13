import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { Container, Title } from "./styles";
import { Text } from "components";
import { localizedStrings } from "constants/localizedStrings";
import HelpIconWithTooltip from "../helpIconWithTooltip";

export default ({
	options,
	title = "Title",
	required = false,
	placeholder,
	loading,
	disabled,
	value = "",
	defaultValue = "",
	isMulti = false,
	customStyle,
	error = false,
	icon,
	errorText = "",
	isCreatable,
	isTextOut,
	emptyStateText = localizedStrings.noOptions,
	showHelpTooltip,
	helpTooltipMessage,
	autoFocus,
	createMessage = localizedStrings.create + ": ",
	name,
	control,
	isClearable = false,
	...props
}) => {
	return (
		control &&
		name && (
			<Container style={props.style} disabled={disabled}>
				{title && (
					<div>
						<Title>
							{title + " "}
							{required ? <span>*</span> : ""}
							{showHelpTooltip && (
								<HelpIconWithTooltip text={helpTooltipMessage} />
							)}
						</Title>
						{icon ? icon : null}
					</div>
				)}
				{isCreatable ? (
					<Controller
						as={CreatableSelect}
						isMulti={isMulti}
						className={`react-select ${error ? "error" : ""} ${isTextOut ? "isTextOut" : ""}`}
						classNamePrefix={"react-select"}
						name={name}
						control={control}
						options={options}
						formatCreateLabel={(name) => createMessage + name}
						placeholder={placeholder}
						onCreateOption={props.onCreate}
						isLoading={loading}
						isDisabled={disabled}
						value={value}
						noOptionsMessage={() => emptyStateText}
						{...props.config}
					/>
				) : (
					<Controller
						as={Select}
						isMulti={isMulti}
						className={`react-select ${error ? "error" : ""}`}
						classNamePrefix={"react-select"}
						name={name}
						control={control}
						options={options}
						placeholder={placeholder}
						styles={customStyle}
						isLoading={loading}
						isDisabled={disabled}
						value={value}
						noOptionsMessage={() => emptyStateText}
						autoFocus={autoFocus}
						isClearable={isClearable}
					/>
				)}
				{error ? (
					<Text color="#fd3995" textAlign="right">
						{errorText}
					</Text>
				) : null}
			</Container>
		)
	);
};
