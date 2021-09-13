import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { VirtualizedTable, EmptyStateContainer, InitStateContainer } from 'containers'
import { localizedStrings } from 'constants/localizedStrings'
import populateSelects from "constants/populateSelects";
import { Card } from 'components';
import { utcToZonedTime } from 'date-fns-tz';
import { DEFAULT_NULL_VALUE } from 'constants/environment';
import { eachMonthOfInterval, format, subMonths } from 'date-fns';

export default function MonthCostReportsTable({
    loading,
    onLoadFail,
    initReport,
    filterText
}) {
    const {
        loadLoading,
        loadFail,
        monthCost,
        total
    } = useSelector(state => state.monthCostReports);

    const {
        user: {
            user_settings: {
                volumetric_measurement_unit,
                distance_unit,
                currency
            }
        }
    } = useSelector(state => state.auth)

    const getCostPerLiterLabel = useCallback(() => {
        try {
            const volumetricUnit = populateSelects.volumetricUnit.find(volumetric => volumetric.value === volumetric_measurement_unit)?.unit;
            const unit = populateSelects.currency.find(money => money.value === currency)?.unit;

            if(!distance_unit || !volumetricUnit) throw new Error('Error getting units');

            return localizedStrings.averageCostPerLiter + ` (${unit}/${volumetricUnit})`;
        } catch (error) {
            return localizedStrings.averageCostPerLiter;
        }
    }, [
        volumetric_measurement_unit,
        distance_unit,
        currency,
        populateSelects,
    ])

    const hasZeroLength = total === 0 && !loadLoading && !loadFail;

    const searchTable = useMemo(
        () => Array.from(monthCost).map(monthSummary => {
            const [,monthNumber] = monthSummary.month.split("-");
            const monthTranslated = localizedStrings.monthsPerNumber[+monthNumber];

            return {
                ...monthSummary,
                month: monthTranslated,
            }
        }),
        [
            monthCost?.length,
            format
        ]
    );

    const tableColumns = [
        {
            active: true,
            key: "month",
            label: localizedStrings.month,
            type: "text",
            showSort: true,
        },
        {
            active: true,
            key: "liters",
            label: localizedStrings.quantity,
            type: "liters",
            showSort: true,
        },
        {
            active: true,
            key: "total_cost",
            label: localizedStrings.value,
            type: "cost",
            showSort: true,
        },
        {
            active: true,
            key: "cost_per_liter",
            label: getCostPerLiterLabel(),
            type: "cost",
            showSort: true,
        },
    ];


    return (
        <Card loading={loading} onFail={onLoadFail}>
            <div style={{ display: "flex", flexDirection: "column" }}>

                <div>
                    <div>
                    {total === 0 && !initReport && (
                        <InitStateContainer
                            title={localizedStrings.initReportsStateTitle}
                            subtitle={localizedStrings.initReportStateSubtitle}
                        />
                    )}
                    {total !== 0 && !loadLoading && !loadFail && (
                        <VirtualizedTable
                            name={'monthCost'}
                            data={searchTable}
                            columns={tableColumns}
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
    )
}
