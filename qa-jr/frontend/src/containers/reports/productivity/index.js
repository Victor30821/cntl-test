import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'components';
import { VirtualizedTable, EmptyStateContainer, BottomPagination, InitStateContainer } from 'containers';
import { localizedStrings } from 'constants/localizedStrings';
import { getUrlParam } from 'utils/params';

export default function ReportsProductivityTable({ onLoadFail, page, perPage, setPage, initReport, filterText }) {
    const [loadedRegisters, setLoadedRegisters] = useState([]);
    const [visibleRegisters, setVisibleRegisters] = useState([]);
    const [searchTable, setSearchTable] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const {
        loadLoading,
        loadFail,
        productivityRoutes,
    } = useSelector(state => state.productivityReports);

    const tableColumns = [
        {active: true, key: "day", label: localizedStrings.day, type: "date", showSort: true },
        { active: true, key: "start_route_hour", label: localizedStrings.initRoute, type: "time", showSort: true },
        { active: true, key: "total_stop_time", label: localizedStrings.routeStopTime, type: "time", showSort: true },
        {active: true, key: "time_off", label: localizedStrings.timeOff, type: "duration", showSort: true },
        {active: true, key: "driver_name", label: localizedStrings.driver, type: "text", showSort: true, fallbackText: localizedStrings.driverNotIdentified }
    ];

    const getRegistersByOffSet = () => {
        const currentPage = Number(getUrlParam("page")) || 1;
        const data = [],
            orderedData = loadedRegisters,
            totalRegisters = orderedData.length,
            offset = currentPage === 1 ? 0 : totalRegisters - (totalRegisters - ((currentPage - 1) * perPage));

        for(let i = offset; i < (offset + perPage ); i++) {
            if(!orderedData[i]) break;
            data.push(orderedData[i]);
        }
        setVisibleRegisters(data);
        setSearchTable(data);
    }

    const tableData = () => {
        const orderedData = productivityRoutes.sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime());

        return orderedData;
    }

    const hasZeroLength = visibleRegisters.length === 0;

    const handlePagination = () => {
        getRegistersByOffSet()
    }

    useEffect(() => {
        setLoadedRegisters(tableData());
        // eslint-disable-next-line
    }, [productivityRoutes])

    useEffect(() => {
        getRegistersByOffSet();
        // eslint-disable-next-line
    }, [perPage, loadedRegisters]);

    useEffect(() => {
        if(loadLoading) {
            setVisibleRegisters([]);
            return setLoaded(true);
        }
        setLoaded(false);
    }, [loadLoading])


    return (
        <>
            <Card loading={loaded} onFail={onLoadFail}>
                <div style={{ display: "flex", flexDirection: "column" }}>

                    <div>
                        <div>
                        {hasZeroLength && !initReport && (
                            <InitStateContainer
                                title={localizedStrings.initReportsStateTitle}
                                subtitle={localizedStrings.initReportStateSubtitle}
                            />
                        )}
                        {searchTable.length !== 0 && (
                            <VirtualizedTable
                                name={'productivity'}
                                data={searchTable}
                                columns={tableColumns}
                                    filterLocally
                                    filterText={filterText}
                            />
                        )}
                        </div>
                        {hasZeroLength && initReport && !loadLoading && !loadFail && (
                            <EmptyStateContainer
                                title={localizedStrings.emptyStateTitle}
                                subtitle={localizedStrings.emptyStateSubtitle}
                            />
                        )}
                    </div>

                </div>
            </Card>
            {searchTable.length > 0 && (
                <BottomPagination
                    list={searchTable}
                    page={page}
                    setPage={setPage}
                    perPage={perPage}
                    total={loadedRegisters.length}
                    action={handlePagination}
                />
            )}
        </>
    )
}
