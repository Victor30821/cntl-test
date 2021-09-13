import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'components';
import { VirtualizedTable, EmptyStateContainer, InitStateContainer } from 'containers';
import { localizedStrings } from 'constants/localizedStrings';
import redirectToMap from 'utils/map/redirectToMap';
import { getTaggingByFilters } from "store/modules";
import { getEventInfo, getEventType } from 'helpers/eventsHandler';

export default function EventsReportsTable({
    history,
    loading,
    fail,
    onFail,
    organizationId,
    initReport,
    filterSerchText,
    vehiclesInfo,
    loadEventsBySort
 }) {
     const dispatch = useDispatch();
    // eslint-disable-next-line
    const [visibleRegisters, setVisibleRegisters] = useState([]);
    const [searchTable, setSearchTable] = useState([]);

    const {
        loadLoading,
        loadFail,
        events,
        total
    } = useSelector(state => state.eventsReports);

    const {
        user: { user_settings }
    } = useSelector(state => state.auth);

    const {
        searchedGroup,
    } = useSelector(state => state.groups);



    const getVehicleGroup = () => {
        dispatch(getTaggingByFilters({
            urn: "v0:cgv:vehicle:" + organizationId + ":*"
        }));
    }

    useEffect(() => {
        getVehicleGroup()
// eslint-disable-next-line
    }, []);

    const onView = register => { 
        const isEmptyCoordinates = !register?.coords?.lat && !register?.coords?.lng
        if(isEmptyCoordinates) return; 
        const viewData = {
            date: register?.time,
            hour: register?.hour,
            hideGroups: true,
            ...register
        }
        redirectToMap(viewData, history);
    };

    const tableColumns = [
        {
            active: true, 
            key: "time",  
            label: localizedStrings.date, 
            type: "date",
            showSort: true,
        },
        {
            active: true, 
            key: "hour", 
            label: localizedStrings.hour, 
            type: "time",
            showSort: false,
        },
        {
            active: false,
            key: "year_manufacturer",
            label: localizedStrings.reportsExport.year_manufacturer,
            type: "text",
            showSort: true,
        },
        {
            active: false,
            key: "vehicle_type",
            label: localizedStrings.reportsExport.vehicle_type,
            type: "text",
            showSort: true,
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
        },
        {
            active: false,
            key: "vehicle_model",
            label: localizedStrings.reportsExport.vehicle_model,
            type: "text",
            showSort: true,
        },
        {
            active: false,
            key: "vehicle_name", 
            label: localizedStrings.vehicle, 
            type: "text",
            showSort: true,
        },
        {
            active: true, 
            key: "type_event_name", 
            label: localizedStrings.eventType, 
            type: "text",
            showSort: true,
        },
        {
            active: true, 
            key: "value_settings", 
            label: localizedStrings.configured, 
            type: "text",
            showSort: true,
        },
        {
            active: true, 
            key: "value", 
            label: localizedStrings.realized, 
            type: "text",
            showSort: true,
        },
        {
            active: true, 
            key: "driver_name", 
            label: localizedStrings.driver, 
            type: "text",
            showSort: true,
        },
    ];

    const hasZeroLength = total === 0 && !loadLoading && !loadFail;

    useEffect(() => {
        const newData = [];

        if (events && searchedGroup) {
            events.forEach(obj => {
                const {
                    setting: value_settings,
                    value,
                } = getEventInfo(obj, user_settings);

                const type_event_name = getEventType(obj.type_event_name)

                const real_date = new Date(obj?.time).getTime();

                const vehicleInformation = vehiclesInfo?.find(vehicle => vehicle?.vehicle_id === obj?.vehicle_id);

                const rowData = {
                    group_name: "",
                    id: obj.vehicle_id,
                    value,
                    value_settings,
                    type_event_name,
                    coords: {
                        lat: obj.lat,
                        lng: obj.lng
                    },
                    real_date,
                    time: obj.time,
                    hour: obj.time,
                    vehicle_name: obj?.vehicle_name,
                    plate_number: vehicleInformation?.plate_number,
                    year_manufacturer: vehicleInformation?.year_manufacturer,
                    vehicle_type: vehicleInformation?.vehicle_type,
                    vehicle_model: vehicleInformation?.vehicle_model,
                    vehicle_groups: vehicleInformation?.vehicle_groups,
                    driver_name: obj?.driver_name || localizedStrings.driverNotIdentified,
                }

                // eslint-disable-next-line
                searchedGroup.map((group, index) => {
                    const split = group.urn.split(':');
                    if (parseInt(split[split.length - 1]) === obj.vehicle_id) {
                        rowData.group_name += group.tagName + (index === searchedGroup.length - 1 ? '' : ', ');
                    }
                });


                newData.push(rowData);
            });
        }

        setVisibleRegisters(newData)
        setSearchTable(newData);
        // eslint-disable-next-line
    }, [events, searchedGroup]);



    return (
        <Card loading={loading} fail={fail} onFail={onFail}>
            <div style={{ display: "flex", flexDirection: "column" }}>

                <div>
                    <div>
                    {hasZeroLength && !initReport && (
                        <InitStateContainer
                            title={localizedStrings.initReportsStateTitle}
                            subtitle={localizedStrings.initReportStateSubtitle}
                        />
                    )}
                        {total !== 0 && !loadLoading && !loadFail && (
                            <VirtualizedTable
                                filterLocally
                                filterText={filterSerchText}
                                name={'events'}
                                data={searchTable}
                                columns={tableColumns}
                                onRowClick={onView}
                                onClickSortColumns={loadEventsBySort}
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
