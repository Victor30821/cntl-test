import styled from "styled-components";

export const Container = styled.div`
  & .react-select__control:last-child {
    background: ${props => props.disabled ? '#f6f6f6' : '#fff'};
  }
  & > div:first-child {
    display: flex;
  }
  .react-select {
    outline: initial !important;
    box-shadow: none !important;
  }

  .react-select__value-container {
    outline: initial !important;
    box-shadow: none !important;
    /* padding: 0.45rem 0.75rem 0.4rem 0.75rem !important; */
  }

  .react-select .react-select__dropdown-indicator {
    color: #868e96;
    background-color: #e5e5e5;
    height: 36px;
    background: #f2f2f2;
    border: 1px solid #e5e5e5;
    box-sizing: border-box;
    border-radius: 0px 4px 4px 0px;
  }

  .react-select .react-select__menu-list {
    padding-bottom: 0;
    padding-top: 0;
  }

  .react-select .react-select__single-value {
    color: black;
    font-size: 14px;
  }

  .react-select .react-select__multi-value__label {
    font-size: 14px;
    color: #ffffff;
    display: flex;
    align-items: center;
    padding-right: 10px;
  }

  .react-select .react-select__dropdown-indicator,
  .react-select
    .react-select__control--is-focused
    .react-select__dropdown-indicator,
  .react-select .react-select__clear-indicator,
  .react-select
    .react-select__control--is-focused
    .react-select__clear-indicator {
    outline: initial;
    box-shadow: initial;

    &:active,
    &:focus,
    &:hover {
      color: $theme-color-1 !important;
    }
  }

  .react-select.error > .react-select__control {
    border: 1px solid #fd3995;
  }

  .react-select__control {
    background: #ffffff;
    border: 1px solid #e5e5e5;
    box-sizing: border-box;
    border-radius: 4px;
    outline: initial !important;
    box-shadow: none !important;
    min-height: 36px;
    font-size: 14px;
    width: 100%;
  }

  .react-select__value-container.react-select__value-container--has-value {
    min-height: 36px !important;
  }

  .react-select__indicator-separator {
    display: none;
  }
  .react-select__dropdown-indicator{
    display: flex;
    align-items: center;
    height: 100% !important;
  }
  .react-select__dropdown-indicator svg {
    width: 15px;
    height: 15px;
  }

  .react-select__option {
    background: $foreground-color !important;
    color: $primary-color !important;

    &:hover,
    &:active {
      background: $theme-color-1 !important;
      color: $button-text-color !important;
    }
  }

  .react-select__option--is-selected {
    background: $theme-color-1 !important;
    color: $button-text-color !important;
  }

  .react-select__control--is-focused {
    border-color: rgba($theme-color-1, 0.6) !important;
  }

  .react-select__multi-value {
    background: #1a237a !important;
    border-radius: 4px;
    display: flex;
    flex-direction: row-reverse;
  }

  .isTextOut .react-select__multi-value {
    display: none;
  }
  .isTextOut .react-select__clear-indicator {
    display: none;
  }
  .react-select__multi-value__remove {
    padding: 5px;
    border-radius: 50%;
    color: #ffffff !important;
    cursor: pointer;
  }

  .react-select__multi-value__remove:hover,
  .react-select__multi-value__remove:active {
    background: transparent !important;
  }

  .react-select .react-select__menu {
    border-radius: $border-radius !important;
    z-index: 20 !important;
    box-shadow: initial !important;
    border: 1px solid rgba($theme-color-1, 0.6) !important;
    border-top: initial !important;
    margin-top: -1px !important;
    background-color: $foreground-color !important;
    border-width: 1px !important;
  }

  .react-select__single-value {
    bottom: 0 !important;
    top: 50% !important;
    padding-top: 2px !important;
  }
  ${props => props.style}
`;

export const Title = styled.p`
  display: flex;
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  line-height: 19px;
  letter-spacing: 0.1px;
  color: #666666;
  margin-bottom: 4px;
  span {
    color: red;
  }
`;
