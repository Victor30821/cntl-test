import React from 'react';
import DaysVertical from '../daysVertical';
import { Col } from "components";
export default function HoursOfUseVisualizerVertical({
    settings = [],
    fillColor = "#1A237A",
    ...options
}) {
    return (
        <Col md="12" className="mb-12">
            <DaysVertical
                settings={settings}
                fillColor={fillColor}
            />
        </Col>
    );
}