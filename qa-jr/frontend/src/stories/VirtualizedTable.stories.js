import React, { useState } from "react";
import { VirtualizedTable } from "containers";
import { localizedStrings } from 'constants/localizedStrings'
import { action } from "@storybook/addon-actions";

export default {
    title: "VirtualizedTable"
};
const registers = [
    {
        "init": "2020-03-03 11:44",
        "end": "22:00",
        "time": "02:49:33",
        "total_distance": "48,2",
        "average_speed": "51",
        "max_speed": "100",
        "vehicle": "Renault Duster"
    },
    {
        "init": "2020-05-06 11:00",
        "end": "23:03",
        "time": "02:19:33",
        "total_distance": "34",
        "average_speed": "58",
        "max_speed": "100",
        "vehicle": "Ford Fusion"
    },
    {
        "init": "2020-06-04 12:00",
        "end": "15:00",
        "time": "00:49:33",
        "total_distance": "59,6",
        "average_speed": "90",
        "max_speed": "100",
        "vehicle": "Motoca à jato"
    }
];
const tableColumns = [
    {
        active: true,
        label: localizedStrings.actions,
        key: "actions",
        type: "buttons",
        buttons: [
            {
                name: "edit", color: "#1A237A",
                onClick: row => {
                    alert(JSON.stringify(row))
                    action(JSON.stringify(row))
                }
            },
        ]
    },
    {active: true, key: "init", label: localizedStrings.init, type: "date", dateFormat: "yyyy-MM-dd H:i:s" },
    {active: true, key: "end", label: localizedStrings.end, type: "text" },
    {active: true, key: "time", label: localizedStrings.time, type: "text" },
    {active: true, key: "total_distance", label: localizedStrings.totalDistanceShort, type: "text" },
    {active: true, key: "average_speed", label: localizedStrings.averageSpeedShort, type: "text" },
    {active: false, key: "max_speed", label: localizedStrings.maxSpeedShort, type: "text" },
    {active: false, key: "vehicle", label: localizedStrings.vehicle, type: "text" }
];
export const VirtualizedTableContainer = () => {
    return (
        <VirtualizedTable
            name={'stories'}
            data={registers}
            columns={tableColumns}
        />
    );
}

