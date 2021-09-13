import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'components';
import { VirtualizedTable, EmptyStateContainer, BottomPagination, InitStateContainer } from 'containers';
import { localizedStrings } from 'constants/localizedStrings';
import { getUrlParam } from "utils/params";
import { parseISO, format } from 'date-fns';

export default function DriversPerDayReportsTable({ onLoadFail, page, perPage, setPage, initReport }) {
    const {
        driversPerDay,
        loadLoading,
        loadFail,
        total,
        newDriversPerDay
    } = useSelector(state => state.driversPerDayReports);
    const [loadedRegisters, setLoadedRegisters] = useState([]);
    const [visibleRegisters, setVisibleRegisters] = useState([]);
    const {
      user: { user_settings },
    } = useSelector((state) => state.auth);
    const tableColumns = [
        { active: true,key: "day", label: localizedStrings.day, type: "date", showSort: true },
        { active: true,key: "total_conduction_time", label: localizedStrings.totalConductionTime, type: "duration", showSort: true },
        { active: true,key: "total_night_hours", label: localizedStrings.totalNightHours, type: "duration", showSort: true },
        {active: true, key: "greater_continuous_driving", label: localizedStrings.greaterContinuousDriving, type: "duration", showSort: true },
        {active: true, key: "km_of_day", label: localizedStrings.distanceUnitOfDay(user_settings.distance_unit), type: "distance", showSort: true }
    ];

    const getFormattedObj = () => {

        const remove_idx_days_new_api = newDriversPerDay.map(route => route.day);

        const driver_per_day_idx_by_date = driversPerDay.reduce((acc, current_route) => {

            const idx = format(parseISO(current_route.start_date), 'yyyy-MM-dd');

            const has_idx = !!acc[idx];
            const idx_equals_days_new_api = remove_idx_days_new_api.includes(idx);

            if(idx_equals_days_new_api) return acc;

            if(has_idx === false) acc[idx] = [];

            const route_modified = {
                km_of_day: 0,
                total_conduction_time: 0,
                greater_continuous_driving: 0,
                total_night_hours: 0,
            };

            route_modified.km_of_day = current_route.total_distance;
            route_modified.total_conduction_time = current_route.total_time;
            route_modified.greater_continuous_driving = current_route.longest_driving_route_time;
            route_modified.total_night_hours = current_route.total_night_hours;

            acc[idx].push(route_modified);

            return acc;

        }, {});

        const driver_per_day_compiled = Object.keys(driver_per_day_idx_by_date).map(date => {

            const {
                km_of_day,
                total_conduction_time,
                greater_continuous_driving,
                total_night_hours
            } = driver_per_day_idx_by_date[date].reduce((acc, routes) => {

                acc.km_of_day += routes.km_of_day;
                acc.total_conduction_time += routes.total_conduction_time;
                acc.total_night_hours += routes.total_night_hours;

                const has_greater_continuous_driving = acc.greater_continuous_driving < routes.greater_continuous_driving;

                if(has_greater_continuous_driving) {
                   acc.greater_continuous_driving = routes.greater_continuous_driving;
                }

                return acc;

            }, {
                km_of_day: 0,
                total_conduction_time: 0,
                greater_continuous_driving: 0,
                total_night_hours: 0,
            });

            return {
                day: date,
                km_of_day,
                total_conduction_time,
                greater_continuous_driving,
                total_night_hours
            }
        })

        return driver_per_day_compiled;
    }

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
    }

    const tableData = () => {

        if(total <= 0) {
            return [];
        }

        const driver_per_day_data = getFormattedObj();

        const driver_per_day_data_with_new = [...driver_per_day_data, ...newDriversPerDay];
        
        const ordered_data = driver_per_day_data_with_new.sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime());
        
        return ordered_data;

    }

    const hasZeroLength = total === 0 && !loadLoading && !loadFail;

    useEffect(() => {
        setLoadedRegisters(tableData());
        // eslint-disable-next-line
    }, [driversPerDay])

    useEffect(() => {
        getRegistersByOffSet();
        // eslint-disable-next-line
    }, [perPage, loadedRegisters]);

    return (
        <>
            <Card loading={loadLoading} onFail={onLoadFail}>
                <div style={{ display: "flex", flexDirection: "column" }}>

                    <div>
                        <div>
                        {hasZeroLength && !initReport && (
                            <InitStateContainer
                                title={localizedStrings.initReportsStateTitle}
                                subtitle={localizedStrings.initReportStateSubtitle}
                            />
                        )}
                        {(driversPerDay.length !== 0 || newDriversPerDay.length !== 0) && !loadLoading && !loadFail && (
                            <VirtualizedTable
                                name={'driverPerDay'}
                                data={visibleRegisters}
                                columns={tableColumns}
                            />
                        )}
                        </div>
                        {hasZeroLength && initReport && (
                            <EmptyStateContainer
                                title={localizedStrings.emptyStateTitle}
                                subtitle={localizedStrings.emptyStateSubtitle}
                            />
                        )}
                    </div>

                </div>
            </Card>
            {visibleRegisters?.length > 0 && (
                <BottomPagination
                    list={visibleRegisters}
                    page={page}
                    setPage={setPage}
                    perPage={perPage}
                    total={loadedRegisters?.length}
                    action={getRegistersByOffSet}
                />
            )}
        </>
    )
}
