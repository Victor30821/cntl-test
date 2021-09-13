const loadGroups = data => async dispatch => {

    try {
        const params = [];
        const filters = {
            urn: val => val && params.push("urn=" + val),
            limit: val => val && params.push("perPage=" + val),
            page: (val = 0) => params.push("page=" + val),
            // eslint-disable-next-line
            search_term: val => val && params.push("tagName=" + "*" + val + "*"),
            entity: val => val && params.push("resourceTypes=" + val),
        }

        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter]))

        const URL = "/vehicle/v1/tag?" + params.join("&");

        dispatch(groupChangeOperationStates({ loadLoading: true, }));

        const {
            data: { tags, totalItems }
        } = await api.get(URL);
        dispatch(groupLoadSuccess({ tags, total: totalItems }));
        dispatch(groupChangeOperationStates({ loadSuccess: true }));

    } catch (error) {
        console.log(error);
        dispatch(groupChangeOperationStates({ loadFail: true }));
    }
};