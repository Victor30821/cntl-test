import React, { useState } from "react";
import { BottomPagination } from "containers";
import { action } from "@storybook/addon-actions";
import { getUrlParam, setUrlParam } from "utils/params";
import { PER_PAGE_LENGTHS as listLengths } from "constants/environment"
export default {
    title: "BottomPagination"
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
export const BottomPaginationComponent = () => {
    const [currentPage, setCurrentPage] = useState(
        Number(getUrlParam("page")) || 1
    );
    const getPerPageFromUrl = perPage => listLengths.includes(perPage) ? perPage : listLengths[0];
    const [maxLengthOfList, setMaxLengthOfList] = useState(
        getPerPageFromUrl(getUrlParam("perPage"))
    );

    return (
        <BottomPagination
            list={registers}
            page={currentPage}
            setPage={setCurrentPage}
            perPage={maxLengthOfList}
            total={registers.length}
        />
    );
}
