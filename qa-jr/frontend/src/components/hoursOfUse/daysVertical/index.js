import React from 'react';
import { DayStyle, PeriodSelected, DaysDiv } from './style';
import { Text } from "components";

const allDays = [{
    dayName: "segunda-feira",
    key: "mon",
    value: 1
}, {
    dayName: "terça-feira",
        key: "tue",
    value: 2
}, {
    dayName: "quarta-feira",
        key: "wed",
    value: 3
}, {
    dayName: "quinta-feira",
        key: "thu",
    value: 4
}, {
    dayName: "sexta-feira",
        key: "fri",
    value: 5
}, {
    dayName: "sábado",
        key: "sat",
    value: 6
}, {
    dayName: "domingo",
        key: "sun",
    value: 7
},];

const totalHoursInADay = 24;
export default function Days({
    settings,
    fillColor,
}) {

    const convertTimeToPercentage = ({
        startAt,
        endAt,
    }) => {
        const startPercentage = 100 * (startAt / totalHoursInADay)
        const endPercentage = 100 * ((endAt / totalHoursInADay) - 1);

        return {
            startPercentage,
            endPercentage: endPercentage * -1
        }
    }
    return (

        <DaysDiv>
            {
                allDays.map((day, index) => {
                    if (!Array.isArray(settings)) return <></>
                    const currentDay = settings.filter(daySetting => daySetting.day === day.key)
                    return (
                        <>
                            <DayStyle key={index}>
                                <Text>{day.dayName}</Text>
                                {
                                    currentDay && currentDay.map(days => (
                                        <PeriodSelected
                                            fillColor={fillColor}
                                            {...convertTimeToPercentage(days.hours)}
                                        >
                                            <div>
                                                <Text
                                                    fontWeight="bold"
                                                    textShadow="1px 1px #1b2479"
                                                >
                                                    {days.hours.startAtRaw}
                                                </Text>
                                            </div>
                                            <div>
                                                <Text
                                                    fontWeight="bold"
                                                    textShadow="1px 1px #1b2479"
                                                >
                                                    {days.hours.endAtRaw}
                                                </Text>
                                            </div>
                                        </PeriodSelected>
                                    ))
                                }
                            </DayStyle>
                        </>

                    )
                })
            }
        </DaysDiv>
    );
}
