import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'components';
import { VirtualizedTable, EmptyStateContainer, BottomPagination, InitStateContainer } from 'containers';
import { localizedStrings } from 'constants/localizedStrings';
import { searchAllAddressLatLng } from 'store/modules';
import { parseISO, format } from "date-fns";

export default function DriversPerRouteReportsTable({ 
    onLoadFail, 
    page, 
    perPage, 
    setPage, 
    showAddress, 
    initReport, 
    filterText, 
    vehiclesInfo, 
    loadTable = () => {},
}) {
    const dispatch = useDispatch();
    const [loadedRegisters, setLoadedRegisters] = useState([]);
    const [visibleRegisters, setVisibleRegisters] = useState([]);
    const [searchTable, setSearchTable] = useState([]);
    const [listedAddresses, setListedAddresses] = useState([]);
    const {
        searchedAddressLatLng
    } = useSelector(state => state.map);

    const {
        newDriversPerRoute,
        driversPerRoute,
        loadLoading,
        loadFail,
        total
    } = useSelector(state => state.driversPerRouteReports);

    const tableColumns = [
        {
            active: true, 
            key: "start_date", 
            label: localizedStrings.date, 
            type: "date",
            showSort: true, 
        },
        {
            active: true, 
            key: "init", 
            label: localizedStrings.init, 
            type: "time",
            showSort: false, 
        },
        {
            active: true, 
            key: "end", 
            label: localizedStrings.end, 
            type: "time",
            showSort: false, 
        },
        {
            active: true, 
            key: "total_time", 
            label: localizedStrings.time, 
            type: "duration",
            showSort: true, 
        },
        {
            active: true, 
            key: "total_distance", 
            label: localizedStrings.totalDistanceShort, 
            type: "distance",
            showSort: true, 
        },
        {
            active: true, 
            key: "max_speed", 
            label: localizedStrings.maxSpeedShort, 
            type: "velocity",
            showSort: true, 
        },
        {
            active: true, 
            key: "average_speed", 
            label: localizedStrings.averageSpeedShort, 
            type: "velocity",
            showSort: true,  
        },
        {
            active: false,
            key: "year_manufacturer",
            label: localizedStrings.reportsExport.year_manufacturer,
            type: "text",
            showSort: true,
            tableSort: true,
        },
        {
            active: false,
            key: "type_vehicle_name",
            label: localizedStrings.reportsExport.vehicle_type,
            type: "text",
            showSort: true,
            tableSort: true,
        },
        {
            active: false,
            key: "vehicle_groups",
            label: localizedStrings.reportsExport.groups,
            type: "text",
            showSort: true,
            tableSort: true,
        },
        {
            active: false,
            key: "plate_number",
            label: localizedStrings.reportsExport.vehicle_plate,
            type: "text",
            showSort: true,
            tableSort: true,
        },
        {
            active: false,
            key: "vehicle_model",
            label: localizedStrings.reportsExport.vehicle_model,
            type: "text",
            showSort: true,
            tableSort: true,
        },
        {
            active: false,
            key: "vehicle_name", 
            label: localizedStrings.vehicle, 
            type: "text",
            showSort: true,
            tableSort: true,
        },
    ];

    const getRegistersByOffSet = () => {
        setVisibleRegisters(loadedRegisters);
        setSearchTable(loadedRegisters)
    }

    const getAddressesByOffSet = () => {
        const listAddress = [];
        loadedRegisters.forEach(register => {
            const location = register?.coords;
            listAddress.push({
                lat: location?.start_lat,
                lng: location?.start_lng
            });
            listAddress.push({
                lat: location?.end_lat,
                lng: location?.end_lng
            });
        })
        setListedAddresses(listAddress);
    }

    const getAddressFromMaps = async () => {
        dispatch(searchAllAddressLatLng({ coordinates: listedAddresses, clear: false }));
    }

    const clearSearchedAddresses = () => {
        dispatch(searchAllAddressLatLng({ coordinates: [], clear: true }));
    }

    const tableData = () => {
        
        const driver_per_route_extras = driversPerRoute.map(reg => {

            const vehicleInformation = vehiclesInfo?.find(vehicle => vehicle?.vehicle_id === reg?.vehicle_id);

            return {
                ...reg,
                coords: {
                    start_lat: reg.start_lat,
                    start_lng: reg.start_lng,
                    end_lat: reg.end_lat,
                    end_lng: reg.end_lng
                },
                start_date: format(parseISO(reg.start_date), 'yyyy-MM-dd'),
                init: format(parseISO(reg.start_date), 'yyyy-MM-dd HH:mm:ss'),
                end: format(parseISO(reg.end_date), 'yyyy-MM-dd HH:mm:ss'),
                vehicle_groups: vehicleInformation?.vehicle_groups,
                address_start: localizedStrings.loading,
                address_end: localizedStrings.loading,
            }
        });

        

        return [...driver_per_route_extras, ...newDriversPerRoute].sort((a ,b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());;
    }

    useEffect(() => {
        const has_searchedAddressLatLng = Array.isArray(searchedAddressLatLng) && searchedAddressLatLng?.length > 0;
        
        if(has_searchedAddressLatLng) {
            let newData = [];
            visibleRegisters.forEach((reg, index) => {
                
                const address_start = searchedAddressLatLng.find(s => String(s?.lat) === String(reg?.coords?.start_lat) && String(s?.lng) === String(reg?.coords?.start_lng));
                const address_end = searchedAddressLatLng.find(s => String(s?.lat) === String(reg?.coords?.end_lat) && String(s?.lng) === String(reg?.coords?.end_lng));

                const has_address_start = address_start !== undefined;
                const has_address_end = address_end !== undefined;

                reg.address_start = localizedStrings.noAddress;
                reg.address_end = localizedStrings.noAddress;

                if(has_address_start) reg.address_start = address_start.formattedAddress;

                if(has_address_end) reg.address_end = address_end.formattedAddress;
                
                newData.push(reg);
            });
            // eslint-disable-next-line
            setVisibleRegisters(newData);
            setSearchTable(newData)
            // eslint-disable-next-line
        }
        // eslint-disable-next-line
    }, [searchedAddressLatLng.length])
    // eslint-disable-next-line

    const showAddressTable = () => {
        if(showAddress) {
            tableColumns.push(
                { active: true, key: "address_start", label: localizedStrings.addressStart, type: "text" },
                { active: true,key: "address_end", label: localizedStrings.addressEnd, type: "text" }
            )
        }
        return tableColumns;
    }

    useEffect(() => {
        setLoadedRegisters(tableData());
    // eslint-disable-next-line
    }, [driversPerRoute])

    useEffect(() => {
        getRegistersByOffSet();
        getAddressesByOffSet();
        clearSearchedAddresses()
        getAddressFromMaps();
    // eslint-disable-next-line
    }, [perPage, loadedRegisters]);


    useEffect(() => {
        if(showAddress) {
            clearSearchedAddresses()
            getAddressFromMaps();
        }
    // eslint-disable-next-line
    }, [showAddress])


    return (
        <>
            <Card loading={loadLoading} onFail={onLoadFail}>
                <div style={{ display: "flex", flexDirection: "column" }}>

                    <div>
                        <div>
                        {searchTable.length === 0 && !initReport && (
                            <InitStateContainer
                                title={localizedStrings.initReportsStateTitle}
                                subtitle={localizedStrings.initReportStateSubtitle}
                            />
                        )}
                        {searchTable.length !== 0 && !loadLoading && !loadFail && (
                            <VirtualizedTable
                                name={'driverPerRoute'}
                                data={searchTable}
                                columns={showAddressTable()}
                                filterLocally
                                filterText={filterText}
                                onClickSortColumns={loadTable}
                            />
                        )}
                        </div>
                        {searchTable.length === 0 && !loadLoading && !loadFail && initReport && (
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
                    total={total}
                    action={loadTable}
                />
            )}
        </>
    )
}
