import React, { useState, memo, useEffect } from 'react';
import { ReportCardDiv, ReportCardTitle, ReportCardValue, ReportCardTooltip } from './style'
import { Icon, HelpIconWithTooltip, Link } from 'components'
import { useSelector } from "react-redux";
import { formatTimeToCard, formatSpeedToCard } from "helpers/ReportCardsCalc";
import { formatUnit, convert, formatCurrency } from 'helpers/IntlService';

export default memo(function ReportCard({ title, value = 0, icon, type, tooltip, ...options }) {
    const {
        user: {
            user_settings: {
                distance_unit,
            }
        },
    } = useSelector(state => state.auth);
    const [valueTypes, setValueTypes] = useState(null);

    const values = {
		text: () => {
			const text = value;

            return text;
        },
        duration: () => {
            let time = value;
            try {

                time = formatTimeToCard(value, 'h:i');

            } catch (error) {
                console.log(error);
                time = value
            }
            return time;
        },
        distance: () => {
            let distance = value;
            try {

                distance = formatUnit(convert(value, 'm', distance_unit?.toLowerCase?.()).toFixed(0),distance_unit?.toLowerCase?.())

            } catch (error) {
                console.log(error);
                distance = value;
            }
            return distance;
        },
        cost: () => {
            try {
                return formatCurrency(value);
            } catch (error) {
                console.log(error);
                return value;
            }
        },
        velocity: () => {
            let velocity = "";
            try {

                velocity = formatSpeedToCard(value, 2, distance_unit + "/h", 0, true);

            } catch (error) {
                console.log(error);
                velocity = value
            }
            return velocity;
        },
        hours: () => {
            try {

                const minutes = value / 60;

                const hours = minutes / 60;

                const has_minutes = String(hours).includes(".");

                if(has_minutes) {

                    const hours = Math.trunc((Math.floor(value) / 3600));

                    const minutes = Math.trunc((Math.floor(value) % 3600) / 60);

                    return `${hours} h ${minutes} min`;

                }

                return hours > 0 ? `${hours} h` : "0 h";
            } catch (error) {
                return "0 h";
            }
        }
    }

    useEffect(() => {
        if(value || value === 0) {
            setValueTypes(values[type]());
        }
    // eslint-disable-next-line
    }, [value])

    return (
        <ReportCardDiv {...options}>
            <ReportCardTitle {...options.titleStyle}>
                {title}
                {tooltip &&
                (<ReportCardTooltip>
                    <HelpIconWithTooltip
                        text={[
                            tooltip.text,
                            <Link
                                href={tooltip.href}
                                target={"_blank"}
                            >
                                {" "}
                                {tooltip.learnMore}
                            </Link>
                        ]}
                    />
                </ReportCardTooltip>)}
            </ReportCardTitle>
            <ReportCardValue {...options.valueStyle}>
                {valueTypes}
            </ReportCardValue>
            <Icon
                icon={icon}
            ></Icon>
        </ReportCardDiv>
    )
})
