import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'components';
import { VirtualizedTable, EmptyStateContainer, BottomPagination, InitStateContainer } from 'containers';
import { localizedStrings } from 'constants/localizedStrings';
import { Link } from "components";
import { getUrlParam } from 'utils/params';
import populateSelects from "constants/populateSelects";
import { convert } from 'helpers/IntlService';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import { format, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { DEFAULT_NULL_VALUE } from 'constants/environment';

export default function ConsumptionMonthReportsTable({
    fail,
    filters,
    perPage,
    setPage,
    page,
    initReport,
    filterText
}) {
    const {
        consumptionMonth,
        loadLoading,
    } = useSelector(state => state.consumptionMonthReports);

    const {
        vehicles
    } = useSelector(state => state.vehicles);


    const {
        user: { user_settings: { timezone } }
    } = useSelector(state => state.auth)

    const searchTable = useMemo(() => {

        const hasFuel = Array.isArray(consumptionMonth) && consumptionMonth.length > 0;

        if (!hasFuel) return [];

        const vehiclesInfo = Array.from(vehicles || []);

        const vehicleInfoPerVehicleId = vehiclesInfo.reduce((allVehicles, vehicle) => {

            allVehicles[vehicle.id] = vehicle;

            return allVehicles
        }, {})

        return consumptionMonth.map(fuel => {
            const vehicleInfo = vehicleInfoPerVehicleId[fuel.vehicle_id] || {};

            return {
                ...fuel,
                vehicle_type: vehicleInfo.type_vehicle_name,
                vehicle_model: vehicleInfo.model,
                year_manufacturer: vehicleInfo.year_manufacturer,
            }
        })

    },
        [
            consumptionMonth,
            vehicles,
        ]
    )


    const getTimezonedPeriod = useCallback(({
        start_date = "",
        end_date = "",
    }) => {
        const errorPeriod = {
            start_date: false,
            end_date: false,
        }
        try {
            if (!start_date || !end_date) return errorPeriod;

            const startDateTimezoned = utcToZonedTime(new Date(start_date.split("-")), timezone);

            const endDateTimezoned = utcToZonedTime(new Date(end_date.split("-")), timezone);

            return {
                start_date: startDateTimezoned,
                end_date: endDateTimezoned,
            }
            
        } catch (error) {
            console.log(error);
            return errorPeriod;
        }
    }, [
        timezone,
        utcToZonedTime,
    ])

    const tableColumns = useMemo(
        () => {
          
            const {
                start_date,
                end_date
            } = getTimezonedPeriod(filters?.period || {});

            if (!start_date || !end_date) return {}

            const intervalDates = eachMonthOfInterval({
                start: start_date,
                end: end_date,
            })
            const monthsColumns = intervalDates.map(date => {
                const formattedDate = format(date, "yyyy-MM");
                const monthNumber = format(date, "MM");
                return {
                    active: true,
                    key: formattedDate,
                    label: localizedStrings.monthsPerNumber[+monthNumber],
                    type: "distancePerLiter",
                    showSort: true,
                }
            })

            return [
                {
                    active: true,
                    key: "total_average",
                    label: localizedStrings.average,
                    type: "distancePerLiter",
                    showSort: true,
                },
                {
                    active: true,
                    key: "year_manufacturer",
                    label: localizedStrings.yearManufacturer,
                    type: "text",
                    showSort: true,
                },
                {
                    active: false,
                    key: "plate_number",
                    label: localizedStrings.plateNumber,
                    type: "text",
                    showSort: true,
                },
                {
                    active: false,
                    key: "vehicle_model",
                    label: localizedStrings.vehicleModel,
                    type: "text",
                    showSort: true,
                },
                {
                    active: true,
                    key: "vehicle_name",
                    label: localizedStrings.vehicle,
                    type: "text",
                    showSort: true,
                },
                ...monthsColumns,
            ]
        },
        [
            getTimezonedPeriod,
            eachMonthOfInterval,
            format,
            filters,
        ],
    )

    const hasZeroLength = !searchTable?.length && !loadLoading && !fail;

    return (
        <>
            <Card loading={loadLoading} fail={fail}>
                <div style={{ display: "flex", flexDirection: "column" }}>

                    <div>
                        <div>
                        {hasZeroLength && !initReport && (
                            <InitStateContainer
                                title={localizedStrings.initReportsStateTitle}
                                subtitle={localizedStrings.initReportStateSubtitle}
                            />
                        )}
                        {!hasZeroLength && !loadLoading && (
                            <VirtualizedTable
                                columns={tableColumns}
                                    data={searchTable}
                                    filterLocally
                                    filterText={filterText}
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
            {searchTable.length > 0 && (
                <BottomPagination
                    list={searchTable}
                    page={page}
                    setPage={setPage}
                    perPage={perPage}
                    total={searchTable.length}
                    action={() => { }}
                />
            )}
        </>
    )
}
