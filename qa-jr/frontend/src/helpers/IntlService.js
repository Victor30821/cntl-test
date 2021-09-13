import Intl from 'cntl-js';

const DEFAULT_VALUE = Object.freeze({
    currency: 'BRL',
    decimalSeparator: ',',
    distanceUnit: 'km',
    language: 'PT',
    shortDateFormat: 'DD/MM/YYYY',
    shortTimeFormat: 'HH24:MM:SS',
    thousandsSeparator: '.',
    timezone: 'America/Sao_Paulo',
});

const userSettings = JSON.parse(window.localStorage.getItem('user_settings'));

const createSettings = {
    currency: userSettings?.user_settings?.currency || DEFAULT_VALUE.currency,
    decimalSeparator: userSettings?.user_settings?.decimalSeparator || DEFAULT_VALUE.decimalSeparator,
    distanceUnit: userSettings?.user_settings?.distanceUnit || DEFAULT_VALUE.distanceUnit,
    language: userSettings?.user_settings?.language || DEFAULT_VALUE.language,
    shortDateFormat: userSettings?.user_settings?.short_date_format || DEFAULT_VALUE.shortDateFormat,
    shortTimeFormat: userSettings?.user_settings?.short_time_format || DEFAULT_VALUE.shortTimeFormat,
    thousandsSeparator: userSettings?.user_settings?.thousands_separators || DEFAULT_VALUE.thousandsSeparator,
    timezone: userSettings?.user_settings?.timezone || DEFAULT_VALUE.timezone,
};

const IntlInstance = Intl.intl.createInstance({ options: createSettings });

export const convert = (value, fromUnit, toUnit) => IntlInstance.convert({ value, fromUnit, toUnit });
export const formatCurrency = (value) => IntlInstance.formatCurrency({ value });
export const formatDate = (value, fromPattern) => IntlInstance.formatDate({ value, fromPattern });
export const formatDatetime = (value, fromPattern) => IntlInstance.formatDatetime({ value, fromPattern });
export const formatNumber = (value) => IntlInstance.formatNumber({ value });
export const formatTime = (value, fromPattern) => IntlInstance.formatTime({ value, fromPattern });
export const formatUnit = (value, unit) => IntlInstance.formatUnit({ value, unit });
