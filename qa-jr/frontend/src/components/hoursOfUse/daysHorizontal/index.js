import React, { useState, useMemo } from 'react';
import { DayStyle, PeriodSelected, DaysDiv, AccompaniedTime } from './style';
import { Text } from "components";
import { localizedStrings } from 'constants/localizedStrings';

const totalHoursInADayMultipliedBy100 = 2359;
export default function Days ({
    settings,
    fillColor,
}) {
    const [timeToShow, setTimeToShow] = useState("")

    const parsedTimeToShow = useMemo(
        () => {
            const [hour, minutes = false] = String(timeToShow).split(".")

            const timeFixed = {
                hour: hour < 0 ? 0 : hour,
                minutes: minutes < 0 ? 0 : minutes,
            }
            const timeConfig = {
                userHour: String(timeFixed.hour),
                hours: localizedStrings.hoursS,
                userMinute: timeFixed.minutes,
                minutes: minutes && localizedStrings.minuteS,
            }
            const hasToFixMinutes = minutes && String(timeConfig.userMinute).length === 1

            if (hasToFixMinutes) {
                timeConfig.userMinute += "0"
            }

            return Object.values(timeConfig).filter(Boolean).join(" ")
        },
        [timeToShow]
    )

    const percentage = useMemo(
        () => {
            const {
                to: end,
                from: start,
            } = settings;

            const [to, from] = [
                parseFloat(start?.replace?.(":", "")),
                +end?.replace?.(":", ""),
            ];
            setTimeToShow((from - to) / 100)
            const percentage = {
                startPercentage: ((to * 100) / totalHoursInADayMultipliedBy100),
                endPercentage: Math.abs(((from * 100) / totalHoursInADayMultipliedBy100) - 100)
            }

            return percentage
        },
        [settings]
    )


    return (
        <>
            <AccompaniedTime {...percentage}>
                <Text>
                    {`${localizedStrings?.intervalSetting} ${parsedTimeToShow}`}
                </Text>
            </AccompaniedTime>
            <DaysDiv>
                <Text>00:00</Text>
                <DayStyle >
                    <PeriodSelected
                        fillColor={fillColor}
                        {...percentage}
                    >
                    </PeriodSelected>
                </DayStyle>
                <Text>23:59</Text>
            </DaysDiv>
        </>
    );
}
