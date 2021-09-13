import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { TimeRangePickerStyle } from './style';
import { InputLabel } from "components/card/cardInput/style"
import { Text } from 'components';
import { localizedStrings } from 'constants/localizedStrings';

function TimeRangeInput({
    onChange = console.log,
    label = "",
    id = 'input-date',
    name = false,
    value: defaultValue = {
        start: false,
        end: false
    },
    setErrors,
    required = false,
    divStyles = {},
    rangeDivider = "até",
    disableClock = true,
    clearIcon = false,
    ...options
}) {

    const [time, setTime] = useState(defaultValue);

    const setTimeOnClear = (event, { isStart, isEnd }) => {
        const missingValues = !event.target.value;
        if (!missingValues) return;

        setTime(value => ({
            start: isStart ? "00:00" : (value.start || "00:00"),
            end: isEnd ? "00:00" : (value.end || "00:00"),
        }))
    }

    useEffect(() => {
        const configureClearInput = (input, index) => {
            const isStart = index === 0;
            const isEnd = index === 1;
            input.addEventListener("change", (event) => setTimeOnClear(event, { isStart, isEnd }))
        }
        const inputs = Array.from(document.querySelectorAll(`[aria-label="${name}"]`))
        inputs.forEach(configureClearInput)
        return () => {
            inputs.forEach(configureClearInput)
        }

    }, [
        time.start,
        time.end
    ])

    const verifyErrors = ({
        start, end
    }) => {
        const [rawStart = 0, rawEnd = 0] = [
            +start?.replace?.(":", ""),
            +end?.replace?.(":", ""),
        ]

        const endIsBeforeStart = rawEnd <= rawStart;

        const errorConfig = {
            hasError: endIsBeforeStart,
            errorMessage: endIsBeforeStart && localizedStrings.errorHourOfWrongOrder
        }

        return errorConfig
    }


    const hasErrors = useMemo(() => {
        const {
            start = "",
            end = ""
        } = time;

        const {
            hasError,
        } = verifyErrors({
            start,
            end,
        })

        setErrors(hasError)

        return hasError;

        // eslint-disable-next-line
    }, [
        verifyErrors,
        // eslint-disable-next-line
        Object.values(time),
    ])

    const errorMessage = useMemo(() => {
        const {
            start = "",
            end = ""
        } = time;

        const {
            errorMessage,
        } = verifyErrors({
            start,
            end,
        })

        return errorMessage;
        // eslint-disable-next-line
    }, [
        hasErrors,
        verifyErrors,
    ])


    useEffect(() => {
        const times = Object.values(time);
        const start = times.shift() || "00:00"
        const end = times.shift() || "00:00"

        if (start || end) onChange({
            start,
            end
        })
        // eslint-disable-next-line
    }, [
        ...Object.values(time)
    ])

    return (
        <TimeRangePickerStyle id={id} {...divStyles}
            showError={hasErrors}
            errorColor={"#FD3995"}
        >
            {
                label &&
                <InputLabel required={required}>
                    {label} <span>*</span>{" "}
                </InputLabel>
            }
            <TimeRangePicker
                clearIcon={clearIcon}
                value={Object.values(time)}
                onChange={(times) => {
                    const selectedTime = times.slice()
                    const start = selectedTime.shift() || "00:00"
                    const end = selectedTime.shift() || "00:00"

                    setTime({
                        start,
                        end
                    });
                }}
                rangeDivider={rangeDivider}
                disableClock={disableClock}
                minuteAriaLabel={name}
                {...options}
            />
            {
                errorMessage &&
                <Text
                    position="absolute"
                    color={"red"}>
                    {errorMessage}
                </Text>
            }
        </TimeRangePickerStyle>

    )
}

export default TimeRangeInput
