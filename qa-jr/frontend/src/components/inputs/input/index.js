import React, { forwardRef, useEffect, useState } from "react";
import { InputDefault } from "./style.js";
import { Text } from "../../../components";
import { localizedStrings } from "../../../constants/localizedStrings";
import $ from 'jquery';
import 'jquery-mask-plugin/dist/jquery.mask.min';
import { Icon } from "components";
import { useSelector } from "react-redux";

$.jMaskGlobals = {
  translation: {
    '0': {pattern: /\d/},
    '9': {pattern: /\d/, optional: true},
    '#': {pattern: /\d/, recursive: true},
    'A': {pattern: /[a-zA-Z0-9 ãõñÃÕÑ~˜áéíóúÁÉÍÓÚçÇ]/},
    'S': {pattern: /[a-zA-Z ]/},
    '@': {pattern: /[\w@\-.+]/, recursive: true },
    // eslint-disable-next-line
    'G': { pattern: /^([a-zA-Z0-9\+\-\=\.\_\/çÇ]*)$/, recursive: true },
    'N': { pattern: /[0-9]/ },
  }
}

const getMaskWithCustomLength = ({ array = [], length = 250, type = "S" }) => {
  array.length = length;
  return array.join(type);
};

const Input = (
  {
    type,
    maxLength,
    showMask = false,
    errorTitle = "",
    error = false,
    noMask = false,
    mask,
    isPassword,
    setPasswordInputType,
    ...option
  },
  ref
) => {
	const {
    user,
  } = useSelector(state => state.auth);

	const thousandSeparator = user?.user_settings?.thousands_separators || '.'
	const decimalSeparator = user?.user_settings?.decimal_separators || ','

	const replaceDecimalValueRegex = /(.*)(.)(.{2})$/;
	const replaceValue = `$1${decimalSeparator}$3`;

  const [masks] = useState([
    "phone",
    "cpf",
    "cnpj",
    "driver_license",
    "zipcode",
    "plate",
    "date",
    "datetime",
    "liters",
    'average_liters',
    "time",
    "text",
    "number",
    "addressNumber",
    "money",
    "mini_money",
    "email",
    "custom",
    "odometer"
  ])
  const [maskTypes] = useState({
    phone: () => localizedStrings.phoneMask,
    cpf: () => localizedStrings.userIdentificationMask,
    cnpj: () => localizedStrings.companyIdentificationMask,
    plate: () => localizedStrings.plateMask,
    driver_license: () => localizedStrings.driverLicenseMask,
    datetime: () => "00/00/0000 00:00",
    time: () => "00:00",
    zipcode: () => localizedStrings.zipcodeMask,
    money: () => "000.000.000.000.000,00".replace('.', thousandSeparator).replace(replaceDecimalValueRegex, replaceValue),
    odometer: () => "000.000.000.000".replace('.', thousandSeparator),
    mini_money: () => "000,00".replace('.', thousandSeparator).replace(replaceDecimalValueRegex, replaceValue),
    liters: () => "000.000.000.000.000,000".replace('.', thousandSeparator).replace(replaceDecimalValueRegex, replaceValue),
    average_liters: () => "000,00".replace('.', thousandSeparator).replace(replaceDecimalValueRegex, replaceValue),
    number: () => getMaskWithCustomLength({ length: maxLength, type: "0" }),
    addressNumber: () => getMaskWithCustomLength({ length: maxLength, type: "N" }),
    text: () => getMaskWithCustomLength({ length: maxLength, type: "A" }),
    email: () => getMaskWithCustomLength({ length: maxLength, type: "@" }),
    custom: () => mask,
    undefined: () => getMaskWithCustomLength({ length: maxLength, type: type.mask }),
  });

  useEffect(() => {
    try {
      // eslint-disable-next-line
      const selectedMask = maskTypes[masks.find(mask => type == mask)]();
      if (option.name && !noMask) {
        $("#" + option.name)
          .mask(selectedMask, { selectOnFocus: true, ...option.maskOptions })
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line
  }, [])
  const [eyeColor, setEyeColor] = useState("#ccc");

  const handleShowPassword = () => {
    if (type === "password") {
      setPasswordInputType("text");
      setEyeColor("#1A237A")
    }
    if (type === "text") {
      setPasswordInputType("password");
      setEyeColor("#ccc")
    }
  };

  return (
    option.component
      ? option.component({ ...option, })
      :
      <>
      <span style={{display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
        <InputDefault
          error={error}
          type={type}
          id={option.name}
          ref={ref}
          as={"input"}
          {...option}
        />
        {isPassword &&
        <Icon
          onClick={handleShowPassword}
          icon={'eye'}
          width={'24px'}
          height={'12px'}
          color={eyeColor}
          divProps={{position: "absolute"}}
          style={{cursor: "pointer", marginRight: ".6rem"}}
        />}
      </span>
        {error && errorTitle
          ? (
            <Text color="#FD3995" size="10px" >
              {errorTitle}
            </Text>
          )
          : null}
      </>
  );
}
export default forwardRef(Input)


