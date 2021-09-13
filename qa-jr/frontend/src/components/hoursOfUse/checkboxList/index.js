import { Checkbox } from 'components/inputs';
import React from 'react'
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';

function CheckboxList({
    weekDays,
    daysDisabledPerId,
    checkboxList,
    configurationIndex,
    toggleCheckbox = () => { },
}) {
    return (
        <Row style={{ width: "100%" }}>
            <Col md="12" className="mb-12" style={{ display: "flex", padding: "16px 25px" }}>
                {
                    weekDays.map((weekDay, index) => {

                        const userWeekDayConfigIndex = checkboxList.findIndex((checkbox) => checkbox && weekDay.id === checkbox.id);

                        const hasToDisable = !!daysDisabledPerId[configurationIndex].find(id => +weekDay.id === +id);

                        const userWeekDayConfig = checkboxList[userWeekDayConfigIndex]

                        const defaultWeekDay = weekDay

                        const daySetup = {
                            weekDay: defaultWeekDay
                        }
                        if (userWeekDayConfig) {
                            daySetup.weekDay = {
                                ...userWeekDayConfig,
                                selected: true
                            }
                        }

                        return (
                            <Checkbox
                                key={index}
                                disabled={hasToDisable}
                                divOptions={{ flex: "1" }}
                                checked={daySetup.weekDay.selected}
                                title={daySetup.weekDay.name}
                                onChange={() => toggleCheckbox({
                                    configurationIndex,
                                    checkboxIndex: userWeekDayConfigIndex,
                                    index,
                                })}
                            />
                        )
                    }
                    )
                }
            </Col>

        </Row>
    )
}

export default CheckboxList
