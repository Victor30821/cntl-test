import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, } from 'components';
import { VirtualizedTable, EmptyStateContainer, BottomPagination, InitStateContainer } from 'containers';
import { localizedStrings } from 'constants/localizedStrings';
import { getUrlParam } from 'utils/params';

export default function AllDriversReportsTable({
    onLoadFail,
    perPage,
    page,
    setPage,
    initReport,
    filterSerchText,
    totalRegisters
}) {
    const {
        allDrivers,
        loadLoading,
    } = useSelector(state => state.allDriversReports);

    const [loadedRegisters, setLoadedRegisters] = useState([]);
    const [visibleRegisters, setVisibleRegisters] = useState([]);
    const [searchTable, setSearchTable] = useState([]);

    const has_all_drivers = () => Array.isArray(allDrivers) && allDrivers.length > 0;

    const onWhatsAppClick = (driver) => {
        window.open("https://api.whatsapp.com/send?phone=" + driver?.driver_phone, "_blank");
    };

    const tableColumns = [
        { active: true, key: "driver_name", label: localizedStrings.driver, type: "text", showSort: true },
        { active: false, key: "driver_code", label: localizedStrings.reportsExport.idCode, type: "text", showSort: true },
        { active: false, key: "driver_cnh", label: localizedStrings.reportsExport.CNH, type: "text", showSort: true },
        { active: false, key: "driver_cnh_expiration", label: localizedStrings.reportsExport.CNHExpirationDate, type: "date", showSort: true },
        {
            active: false,
            key: "driver_phone",
            label: localizedStrings.phone,
            type: "text",
            style: driver => ({ display: 'flex' }),
          
            buttons: [
              {
                name: "whatsapp", tooltipText:"WhatsApp", color: "#24b3a4", 
                onClick: driver => 
                { 
                 driver?.driver_phone && onWhatsAppClick(driver)},

                style: (driver) => ({
                  cursor:driver?.driver_phone ? "pointer" : "default",
                  color: !driver?.driver_phone && "#868E96",
                  width: "20px",
                  height: "20px",
                })
              },
            ],
            showSort: true
        },
        { active: true, key: "total_conduction_hours", label: localizedStrings.greaterContinuousDriving, type: "duration", showSort: true },
        { active: true, key: "total_night_hours", label: localizedStrings.totalNightHours, type: "duration", showSort: true },
        { active: true, key: "greater_continuous_driving_hour", label: localizedStrings.greaterContinuousDrivingHour, type: "duration", showSort: true },
        { active: true, key: "total_distance", label: localizedStrings.totalDistance, type: "distance", showSort: true },
        // { key: "total_night", label: localizedStrings.totalNight('H'), type: "time" }
    ];

    const getRegistersByOffSet = () => {
        const currentPage = Number(getUrlParam("page")) || 1;
        const data = [];
        const totalRegisters = loadedRegisters.length;
        const offset = currentPage === 1 ? 0 : totalRegisters - (totalRegisters - ((currentPage - 1) * perPage));

        for (let i = offset; i < (offset + perPage); i++) {
            if (loadedRegisters[i]) {
                data.push(loadedRegisters[i]);
            }
            else {
                break;
            }
        }
        setSearchTable(data);
        setVisibleRegisters(data);
    }

    const handlePagination = () => {
        getRegistersByOffSet()
    }

    useEffect(() => {
        getRegistersByOffSet();
        // eslint-disable-next-line
    }, [perPage, loadedRegisters]);


    return (
        <>
            <Card onFail={onLoadFail} loading={loadLoading}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {
                        loadLoading && !has_all_drivers && !initReport && (
                            <InitStateContainer
                                title={localizedStrings.initReportsStateTitle}
                                subtitle={localizedStrings.initReportStateSubtitle}
                            />
                        )
                    }
                    <div>
                        {!loadLoading && has_all_drivers && (
                            <VirtualizedTable
                                name={'allDrivers'}
                                data={allDrivers}
                                columns={tableColumns}
                                filterText={filterSerchText}
                                filterLocally
                            />
                        )}
                    </div>
                    {loadLoading && initReport && !has_all_drivers && (
                        <EmptyStateContainer
                            title={localizedStrings.emptyStateTitle}
                            subtitle={localizedStrings.emptyStateSubtitle}
                        />
                    )}
                </div>

            </Card>
            {has_all_drivers && (
                <BottomPagination
                    list={allDrivers}
                    page={page}
                    setPage={setPage}
                    perPage={perPage}
                    total={allDrivers.length}
                    action={handlePagination}
                />
            )}
        </>
    )
}
