import { getUrlParam } from 'utils/params';

export const loadTableByUrlParams = ({
    sort = "",
}) => {

    const sortBy = getUrlParam("sortBy");

    const sortDirection = getUrlParam("sortDirection");

    const has_sort_by = 
        !!sortBy &&
        sortBy?.length > 0;

    const has_sort_direction = 
        !!sortDirection && 
        sortDirection?.length > 0;

    const has_query_sort =
        has_sort_by && 
        has_sort_direction && 
        sort;

    return {
        has_query_sort,
        sortBy,
        sortDirection
    };
}