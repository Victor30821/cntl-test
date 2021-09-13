import styled, { css } from 'styled-components';
import { NavItem } from "reactstrap";

export const StyledButton = styled.button`
	width: auto;
	display: flex;
	background: #192379;
	flex-direction: row;
	cursor: pointer;
	align-items: center;
	border: 1px solid #1A237A;
	border-radius: 4px;
	min-width: 130px;
	background-color: #192379;
	justify-content: flex-end;
	padding: 10px;
	margin-left: 5px;

	${({isDisabled}) => isDisabled && css`
		background: #C2C7CA;
		cursor: not-allowed !important;
		border: none;
	`}
`;

export const TooltipText = styled.span`
	font-family: 'Roboto';
	font-style: normal;
	font-size: 12px;
	line-height: 19px;
	color: #222529;
	text-transform: none;
	font-weight: 400;

	visibility: hidden;

	position: absolute;
	top: -5px;
	left: -300px;
	z-index: 1;

	width: 300px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 8px;
	border: 2px solid #C2C7CA;
	border-radius: 8px;
	background-color: #fff;
`;

export const StyledNavItem = styled(NavItem)`
	position: relative;

	&:hover ${TooltipText} {
		visibility: visible;
	}
`;
