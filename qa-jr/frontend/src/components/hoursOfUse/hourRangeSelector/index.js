
import React, { useState } from 'react'
import { Row } from 'reactstrap'
import { TimeRangeInput, CardForm, Button, Col, HoursOfUseVisualizerHorizontal } from 'components'
import { localizedStrings } from 'constants/localizedStrings'

export default function HourRangeSelector({
    configurationIndex,
    hourIndex,
    hour,
    onChangeTime = () => { },
    addDay = () => { },
    removeDay = () => { },
    setErrors = () => { },
    errors,
    hideMinusBtn = false,
}) {
    const [timerangeId] = useState(`timepicker:${configurationIndex}:${hourIndex}:${Math.random()}`)
    return (
        <CardForm padding="initial">
            <Row>
                <Col md="6" className="mb-6" style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <TimeRangeInput
                        setErrors={setErrors}
                        name={timerangeId}
                        label={localizedStrings.selectVehicleHoursOfUsage}
                        value={{
                            start: hour.from,
                            end: hour.to
                        }}
                        onChange={({
                            start,
                            end
                        }) => {
                            onChangeTime({
                                from: start,
                                to: end,
                                configurationIndex,
                                hourIndex,
                            })
                        }}
                    />
                    <Button
                        iconConfig={{
                            icon: "plus",
                            width: "16px",
                            height: "16px",
                            color: "#868E96",
                        }}
                        marginLeft={"10px"}
                        minWidth="42px"
                        min-height="38px"
                        width="42px"
                        background={"#fff"}
                        disabled={errors}
                        border={"1px solid #E5E5E5"}
                        hasIcon={true}
                        onClick={() => addDay({
                            configurationIndex,
                            hourIndex
                        })}
                        type={"button"}
                    />
                    <Button
                        iconConfig={{
                            icon: "minus",
                            width: "6px",
                            height: "16px",
                            color: "#868E96",
                        }}
                        display="flex"
                        justify-content="space-around"
                        padding="0"
                        minWidth="42px"
                        margin-left={"10px"}
                        min-height="38px"
                        width="50px"
                        disabled={hideMinusBtn}
                        background={"#fff"}
                        border={"1px solid #E5E5E5"}
                        hasIcon={true}
                        onClick={() => removeDay({
                            configurationIndex,
                            hourIndex,
                        })}
                        type={"button"}
                    />
                </Col>
                <Col md="6" className="mb-6" style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end"
                }}>
                    <HoursOfUseVisualizerHorizontal
                        settings={{ ...hour }} />
                </Col>
            </Row>
        </CardForm>
    )
}
