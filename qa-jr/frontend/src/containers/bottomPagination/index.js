import React, { memo, useMemo } from 'react';
import { Text } from '../../components'
import Pagination from '@material-ui/lab/Pagination';
import { BottomPaginationWrapper, PageItemDescriptionDiv } from './style'
import { localizedStrings } from '../../constants/localizedStrings'
import { setUrlParam } from '../../utils/params'
export default memo(function BottomPagination({ list = [], page, setPage, total, perPage, action = () => { }, ...options }) {
    const numberOfPage = useMemo(
        () => Math.ceil(Number(total) / Number(perPage)),
        [total, perPage]
    );

    const [
        startRegisterCount,
        endRegisterCount
    ] = useMemo(
        () => +page === +numberOfPage
            ? [total - list.length, total]
            : [(perPage * page) - (list.length), (perPage * page)],
        // eslint-disable-next-line
        [perPage, page, list, total,]
    );



    const goToPage = (number) => {
        setUrlParam("page", number);
        setPage(number)
        action();
    }

    return (
        <BottomPaginationWrapper>
            <PageItemDescriptionDiv {...options.descriptionOptions}>
                <Text>
                    {localizedStrings.showing}
                    {
                        isNaN(startRegisterCount) || startRegisterCount <= 0
                            ? 1
                            : startRegisterCount
                    }
                    {" " + localizedStrings.until.toLowerCase() + " "}
                    {
                        endRegisterCount > total
                            ? total
                            : endRegisterCount
                    }
                    {" " + localizedStrings.from.toLowerCase() + " "}
                    {total}
                    {" " + localizedStrings.registersLowerCase}
                </Text>
            </PageItemDescriptionDiv>
            <div>
                <div>
                    <Pagination count={numberOfPage <= 0 ? 1 : numberOfPage} shape={"rounded"} {...options.paginationOptions}
                        page={page} onChange={(event, value) => goToPage(value)} />
                </div>
            </div>
        </BottomPaginationWrapper>
    );
})
