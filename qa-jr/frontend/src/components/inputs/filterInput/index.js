import React, { useRef } from 'react';
import { FilterInputWrapper, FilterInputStyle, IconWrapper } from './style';
import { HelpIconWithTooltip, Icon } from 'components'
import { localizedStrings } from 'constants/localizedStrings';

export default function FilterInput({ onChange,
    iconConfig = {},
    iconWrapper = {},
    placeholder,
    inputStyle,
    defaultValue = "",
    helpText = localizedStrings.searchHelp,
    hasHelpText = true,
    hasIcon = true,
    disabled = false,
    value,
    ...props
}) {
    let inputRef = useRef(null);
    return (
        <FilterInputWrapper
            alignItems="center"
            {...props}
        >
            <FilterInputWrapper
                inputWrapperMarginLeft={"0px"}
                inputWrapperMarginRight={"0px"}
                minWidth={"auto"}
            >
                <FilterInputStyle
                    style={inputStyle}
                    ref={inputRef}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={(event) => {
                        event.persist();
                        onChange && onChange(event.target.value);
                    }}
                    disabled={disabled}
                    placeholder={placeholder || localizedStrings.filter}
                />
                {hasIcon && <IconWrapper {...iconWrapper} onClick={() => onChange(inputRef.current.value)}>
                    <Icon icon={iconConfig.name || 'search'} width={iconConfig.width || '20px'} height={iconConfig.height || '17px'} color={iconConfig.color || '#868E96'} cursor="pointer" />
                </IconWrapper>}
            </FilterInputWrapper>
            {
                hasHelpText &&
                <HelpIconWithTooltip
                    divProps={{
                        marginLeft: "5px"
                    }}
                    text={[helpText,]} />
            }
        </FilterInputWrapper>
    );
}
