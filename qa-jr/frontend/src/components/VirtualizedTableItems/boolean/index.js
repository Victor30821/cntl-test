import React from "react";
import { VirtualizedTableItems } from "components";
export default (props) => {
    return (
        <VirtualizedTableItems.InformationCell cellData={
            props.cellData
                ? props.onTrue
                : props.onFalse
        } />
    )
}