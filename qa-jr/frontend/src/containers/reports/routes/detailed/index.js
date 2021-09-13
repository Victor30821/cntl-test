import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'components';
import { VirtualizedTable, EmptyStateContainer } from 'containers';
import { localizedStrings } from 'constants/localizedStrings';
import { getRoutesByFileId, getDriversAndAddresses, getDriversByIds } from 'store/modules';
import capitalize from 'helpers/capitalize';
import { getPreciseDistance } from 'geolib'

export default function RoutesReportsDetailedTable({
    onFail,
    currentRoute
}) {
    const dispatch = useDispatch();
    const [visibleRegisters, setVisibleRegisters] = useState({
        registers: [],
        listAddresses: [],
        driversIds: []
    });
    const {
        loadLoading,
        loadFail,
    } = useSelector(state => state.map);

    const {
        user
    } = useSelector(state => state.auth);

    const {
        driversByids
    } = useSelector(state => state.drivers);

    const loadRoutePoints = ({ file_route_id, vehicle_id, onGoing }) => {
        if (!vehicle_id || (!onGoing && !file_route_id)) return [];
        dispatch(getRoutesByFileId({ file_route_id, vehicle_id, onGoing }, tableData));
    }

    const loadDriversAndAddresses = () => {
        dispatch(getDriversAndAddresses({ coordinates: visibleRegisters.listAddresses, driver_ids: visibleRegisters.driversIds, onFinish: setDriversAndAnddresses }));
    }

    const hasZeroLength = visibleRegisters.registers.length === 0;

    const tableColumns = [
        {active: true, key: "date", label: localizedStrings.date, type: "date", showSort: true },
        {active: true, key: "time", label: localizedStrings.hour, type: "time" },
        {active: true, key: "ignition", label: localizedStrings.ignition, type: "text", showSort: true },
        {active: false, key: "rele", label: localizedStrings.rele, type: "text", showSort: true },
        {active: false, key: "sensors", label: localizedStrings.sensors, type: "text", showSort: true },
        {active: true, key: "speed", label: localizedStrings.speedKMH, type: "velocity", showSort: true },
        {active: true, key: "traveled_time", label: localizedStrings.traveledTime, type: "duration", showSort: true },
        {active: true, key: "odometer", label: localizedStrings.odometerInUserUnit(user?.user_settings?.distance_unit), type: "distance", distanceUnitAccuracy: 3, showSort: true },
        {active: true, key: "distance", label: localizedStrings.distance, type: "distance", showSort: true },
        {active: true, key: "driver_name", label: localizedStrings.driver, type: "text", fallbackText: localizedStrings.driverNotIdentified, showSort: true },
        {active: true, key: "address", label: localizedStrings.address, type: "text", showSort: true },
    ];

    const setDriversAndAnddresses = ({ locations }) => {
		const addresses = locations.flat();
		const PRECISION = 5;
		const newRegistersWithLocation = visibleRegisters.registers.map((reg) => {
			const lat = reg.lat?.toPrecision(PRECISION);
			const lng = reg.lng?.toPrecision(PRECISION);

			const addressObj = addresses.find(address =>
				address?.latitude?.toPrecision(PRECISION) === lat
				&& address?.longitude?.toPrecision(PRECISION) === lng);

			return {
                ...reg,
				address: capitalize(addressObj?.formattedAddress) ?? localizedStrings.addressRouteNotFound,
			};
		});

        const newRegistersWithLocationAndDrivers = newRegistersWithLocation.map((reg, index) => {
            reg.driver_name = driversByids.map(driver => driver.id === reg.driver_id ? driver.name : false);
            if(reg.driver_name.length === 0) reg.driver_name = currentRoute.driver_name;

            return reg;
        });

        setVisibleRegisters({ ...visibleRegisters, registers: newRegistersWithLocationAndDrivers });
    }

    const tableData = (data) => {
        const newData = [],
            hasRoutes = data?.points.length > 0,
            driversIds = [];

        let totalTraveledTime = 0,
            totalDistance = 0,
            lastOdometer = 0,
            listAddress = [];

        if (!hasRoutes) return [];
        // eslint-disable-next-line
        data.points.sort((a, b) => a.timestamp - b.timestamp).map((point, index) => {
            if (point?.driver_id && !driversIds.includes(point.driver_id)) {
                driversIds.push(point.driver_id);
            }

            const date = new Date(point.timestamp),
                traveledTime = index === 0 ? 0 : (date.getTime() - new Date(data.points[index - 1].timestamp).getTime()) / 1000;
            totalTraveledTime += traveledTime;

            const odometer = point.odometer / 1000,
                distance = index === 0 ? 0 : (odometer - lastOdometer) * 1000;

            totalDistance += distance;
            lastOdometer = odometer;

            if (point.lat && point.lng) {
                listAddress[index] = {
                    lat: point.lat,
                    lng: point.lng
                }
            }

            newData.push({
                driver_id: point.driver_id,
                date: point.timestamp,
                time: point.timestamp,
                ignition: +point.ignition === 1 ? localizedStrings.ignitionOn : localizedStrings.ignitionOff,
                rele: "-",
                sensors: point.sensor,
                speed: point.speed,
                traveled_time: totalTraveledTime,
                odometer: odometer,
                distance: totalDistance,
                driver_name: `${localizedStrings.loading}...`,
                address: `${localizedStrings.loading}...`,
				lat: point.lat,
				lng: point.lng,
            });
        });
        visibleRegisters.registers = newData;
        visibleRegisters.listAddresses = listAddress;
        visibleRegisters.driversIds = driversIds;
        setVisibleRegisters({ ...visibleRegisters });
        loadDriversAndAddresses();
    }

    const orderByDesc = (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()

    const fillTableData = ({
        current_route
    }) => {

        const table_data = current_route.trackings
            .sort(orderByDesc)
            .map((tracking, i, original_arr) => {
    
                const tracking_date = new Date(tracking.timestamp);

                const [first_tracking={}] = original_arr;

                const traveled_time = (tracking_date.getTime() - new Date(first_tracking.timestamp).getTime()) / 1000;

                const previous_coordinates = {
                    latitude: first_tracking.lat,
                    longitude: first_tracking.lng,
                };
    
                const current_coordinates = {
                  latitude: tracking.lat,
                  longitude: tracking.lng,
                };

                const distance = getPreciseDistance(previous_coordinates, current_coordinates);

                const vehicle_turned_on_vehicle = +tracking.ignition === 1;

                return {
                    driver_id: tracking?.driver_id || 0,
                    date: tracking.timestamp,
                    time: tracking.timestamp,
                    ignition: vehicle_turned_on_vehicle ? localizedStrings.ignitionOn : localizedStrings.ignitionOff,
                    rele: "-",
                    sensors: "-",
                    speed: tracking.speed,
                    traveled_time: traveled_time,
                    odometer: tracking.odometer,
                    distance: distance,
                    driver_name: tracking?.driver_name || `${localizedStrings.driverNotIdentified}`,
                    address: `${localizedStrings.loading}...`
                }
            });

        const list_addresses = current_route.trackings
            .sort(orderByDesc)
            .map(tracking => ({
                lat: tracking.lat,
                lng: tracking.lng
            }));

        visibleRegisters.registers = table_data;
        visibleRegisters.listAddresses = list_addresses;
        //visibleRegisters.driversIds = driversIds;
        setVisibleRegisters({ ...visibleRegisters });
        loadDriversAndAddresses();
        //loadDrivers();
    }

    useEffect(() => {

        const has_trackings = Array.isArray(currentRoute.trackings);

        if(has_trackings) {
            fillTableData({
                current_route: currentRoute
            });
            return;
        }

        loadRoutePoints(currentRoute || { file_route_id: null, vehicle_id: null, onGoing: false });
    // eslint-disable-next-line
    }, [currentRoute]);

    return (
        <Card display={"flex"} flexDirection={"column"} loading={loadLoading} fail={loadFail} onFail={onFail}>
            <div>
                <div>
                    {!hasZeroLength && !loadLoading && !loadFail && (
                        <VirtualizedTable
                            name={'routesDetailed'}
                            data={visibleRegisters.registers}
                            columns={tableColumns}
                        />
                    )}
                </div>
                {hasZeroLength && !loadLoading && !loadFail && (
                    <EmptyStateContainer
                        title={localizedStrings.noRoutesReportFound}
                        subtitle={localizedStrings.createARoute}
                    />
                )}
            </div>

        </Card>
    )
}
