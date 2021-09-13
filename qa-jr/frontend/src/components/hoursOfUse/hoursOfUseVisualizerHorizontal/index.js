import React from 'react';
import DaysHorizontal from '../daysHorizontal';
import { Col } from "components";
export default function HoursOfUseVisualizerHorizontal({
    settings = [],
    fillColor = "#1A237A",
    ...options
}) {
    return (
        <Col md="12" className="mb-12">
            <DaysHorizontal
                settings={settings}
                fillColor={fillColor}
            />
        </Col>
    );
}