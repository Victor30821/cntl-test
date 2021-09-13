import React, { useMemo } from "react";
import { Icon } from "components";

export default ({
    listSortConfig,
    onSort
}) => {

    const type = useMemo(() => listSortConfig?.sortDirection, [listSortConfig])

    const typeDivProps = useMemo(() => type === "ASC" ? "DESC" : "ASC", [type]);

    return (
        <Icon
            icon={type || "ASC"}
            width={"15px"}
            height={"7px"}
            color={"#1A237A"}
            cursor="pointer"
            divProps={{
                onClick: event => onSort({ sortBy: listSortConfig.sortBy, sortDirection: typeDivProps, event })
            }}
        />
    );
}