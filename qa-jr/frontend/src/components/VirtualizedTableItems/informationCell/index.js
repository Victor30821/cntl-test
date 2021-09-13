import React, { useMemo } from "react";
import { HelpIconWithTooltip, Text } from "components";

export default ({
    cellData = "",
    rowData, // attributes from row
    data, // raw data in table (before parsing)
    parsedData, // data from table after parsing (example: dates already parsed, distances in user unit...)
    textStyle = {},
    title, ...props
}) => {


    const toolTipInCell = useMemo(() => {
			const index = rowData?.rawRowIndex || props.rowIndex;

			const rawRowData = data?.[index] || parsedData?.[index] || {};

			let tooltipData = {};

			if (typeof props.showTooltipInCell === "function") {
				tooltipData = props.showTooltipInCell(
					rawRowData,
					cellData,
					index,
					parsedData
				);
			}

			return tooltipData;
		}, [props.showTooltipInCell]);

    return (
        <>
            <Text {...textStyle} title={title || cellData}> {cellData} </Text>
            {
                toolTipInCell.show && toolTipInCell.iconsArray
            }

        </>
    )
}