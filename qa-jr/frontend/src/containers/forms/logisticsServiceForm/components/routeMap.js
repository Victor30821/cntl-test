import React, { useState, useEffect, useRef } from "react";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, Col, DateInput,Pin, ErrorBoundary, Link, HelpIconWithTooltip, Text } from "components";
import { DivServiceLogistic, InputDateLogistic, TabLogistic } from "../style";
import { LogisticDetailRouteForm } from "containers/forms";
import { setDriverDay, getBestRoute, setPlaces, getProgressLogisticsService, setServicePlace, loadRouteMapVehicle, logisticsChangeSelected } from "store/modules";
import { Marker, InfoWindow, Polyline } from '@react-google-maps/api'
import pinStart from 'assets/start.png';
import pinEnd from 'assets/finish.png';
import { addSeconds, format } from 'date-fns';
import { DEFAULT_NULL_VALUE } from "constants/environment";

const colors = {
  pending: "#EFA947",
  driverWaiting: "#1EB2E0",
  cancelled: "#EC4F47",
  embarked: "#3ECE44",
  arrived: "#447D93"
}
const time_get_vehicle_last_positions = 15000;
const time_get_logistics_progress = 15000;
export default function RouteMap({ inputsConfig, onChanges, errors }) {

  const dispatch = useDispatch();

  const {
    services_drivers,
    services_places,
    selected,
    status_service,
    service_id,
    progress,
    execute_fit_bounce,
    map_vehicle
  } = useSelector(state => state.logisticsServices);

  const {
    overview_selected,
  } = selected;
  
  const {
    vehicles,
  } = useSelector(state => state.vehicles);

  const [statePeriod, setStatePeriod] = useState({
    going: false,
    back: false
  })

  const {
    routes
  } = useSelector(state => state.map);

  let [inicialDestiny, setInicialDestiny] = useState({});

  let [endDestiny, setEndDestiny] = useState({});

  const [vehicleIcon, setVehicleIcon] = useState("");

  const {
    overview_selected: {
      inicial_destiny_selected,
      end_destiny_selected,
      hour_going_selected, 
      type_selected,
      start_date_selected,
      end_date_selected,
      vehicles_selected,
    },
    stop_places
  } = selected;

  const { exception_day_selected } = stop_places;

  const mapControls = useRef(null);

  const mapRef = useRef(null);

  const [mapControlsVisible, setMapControlsVisible] = useState(false);

  // eslint-disable-next-line

  const toggleControlsVisibility = () => {

    if (mapControls?.current) {

        setMapControlsVisible(false)

        clearTimeout(mapControls.current);

        mapControls.current = null
    }
    mapControls.current = setTimeout(() => {
        if (mapControlsVisible) return;

        setMapControlsVisible(true)

    }, 1500);
}

const handleDate = (val, date) => {

  const { target: { value = "" } } = date;

  const selectedDate = new Date(value + 'T06:00:00.000Z')
  
  dispatch(logisticsChangeSelected(({
    selected: {
        stop_places: {
            ...stop_places,
            exception_day_selected: selectedDate || new Date()
        },
    },
  })));

  const days = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
  };

  const day_selected = new Date(value + 'T06:00:00.000Z').getDay();

  const day_convert = days[day_selected];

  const has_drivers = Array.isArray(services_drivers) && services_drivers?.length > 0;

  if(has_drivers) {

    const drivers = services_drivers?.filter(service_driver => service_driver[day_convert] === "Sim");

    const found_driver = Array.isArray(drivers) &&  drivers.length > 0;

    if(found_driver) {
      
      const [driver={}] = drivers;

      const total_drivers = drivers.length - 1;

      const driver_name = driver.name;

      dispatch(setDriverDay({ driver_day: {name: total_drivers > 0 ? driver_name + " +" + total_drivers : driver.name}}));

    }

    if (found_driver === false) dispatch(setDriverDay({ driver_day: [{ name: DEFAULT_NULL_VALUE }] }));

  }

  const has_status_finished =
    !!status_service && 
    status_service.length > 0 && 
    status_service === "finished";


  if(has_status_finished) {

    const limit = services_places.length;

    const date = format(new Date(value + 'T06:00:00.000Z'), 'yyyy-MM-dd');

    dispatch(getProgressLogisticsService({ limit, service_id, date }));

  }

}

const setMarkersOnMap = () => {

  const has_inicial_destiny_selected = inicialDestiny?.value !== undefined;

  const has_end_destiny_selected = endDestiny?.value !== undefined;

  const has_services_places = Array.isArray(services_places) && services_places?.length > 0;

  if(has_inicial_destiny_selected && has_end_destiny_selected && has_services_places) {

    if(type_selected) {
      const [addressInicial = {}] = inicial_destiny_selected?.value?.addresses || [];
      setInicialDestiny({ value: inicial_destiny_selected.value, label: inicial_destiny_selected.label, address: addressInicial });
      const [addressEnd = {}] = end_destiny_selected?.value?.addresses || [];
      setEndDestiny({ value: end_destiny_selected.value, label: end_destiny_selected.label, address: addressEnd });
    }
    //TODO: caso tenha volta no mesmo servico logistico descomentar essa linha.
    // if(!type_selected) {
    //   const [addressEnd={}] = end_destiny_selected?.value?.addresses;
    //   setInicialDestiny({ value: end_destiny_selected.value, label: end_destiny_selected.label, address: addressEnd });
    //   const [addressInicial={}] = inicial_destiny_selected?.value?.addresses;
    //   setEndDestiny({ value: inicial_destiny_selected.value, label: inicial_destiny_selected.label, address: addressInicial });
    // }

    const [originAddress = {}] = inicialDestiny?.value?.addresses || [];

    const origin = {
      lat: originAddress.lat || 0,
      lng: originAddress.lng || 0,
    }

    const [destinationAddress = {}] = endDestiny?.value?.addresses || [];

    const destination = {
      lat: destinationAddress.lat || 0,
      lng: destinationAddress.lng || 0,
    }
    
    // eslint-disable-next-line
    const waypoints = services_places.
      map(place => {
        const [address={}] = place?.place?.addresses;
        const coordinates = String(address?.lat + ',' + address?.lng);
        return coordinates;
      })
      .join("|");
      
      dispatch(getBestRoute({ latLng: {origin , destination}, waypoints }));
    }
}

const setSecondaryInicialEndDestiny = () => {
  const has_inicial_destiny_selected = inicial_destiny_selected?.value !== undefined;
  const has_end_destiny_selected = end_destiny_selected?.value !== undefined;

  if(has_inicial_destiny_selected) {
    const { value = {}, label = "" } = inicial_destiny_selected || {};
    const [address = {}] = inicial_destiny_selected?.value?.addresses || [];
    inicialDestiny = { value, label, address };
    setInicialDestiny(inicialDestiny);
  }

  if(has_end_destiny_selected) {
    const { value = {}, label = "" } = end_destiny_selected || {};
    const [address = {}] = end_destiny_selected?.value?.addresses || [];
    endDestiny = { value, label, address }
    setEndDestiny(endDestiny);
  }
}

useEffect(() => {
  
  setSecondaryInicialEndDestiny();

  setMarkersOnMap();
  // eslint-disable-next-line
}, [inicial_destiny_selected, end_destiny_selected, JSON.stringify(services_places), type_selected]);

const fitBoundsOnMap = (latLngArray = []) => {
  try {
      if (!mapRef.current) throw new Error('Map has not initiazed');

      const latlngbound = new window.google.maps.LatLngBounds();
      
      latLngArray
          .filter(coord => Number.isInteger(Number(Math.abs(coord.lat).toFixed(0))) && Number.isInteger(Number(Math.abs(coord.lng).toFixed(0))))
          .forEach(coord => {
            const place = new window.google.maps.LatLng(coord.lat, coord.lng);
            latlngbound.extend(place);
          });

      mapRef.current.fitBounds(latlngbound);

  } catch (error) {
      console.log(error);
  }
}

useEffect(() => {

  const has_inicial_destiny_selected = Array.isArray(inicial_destiny_selected?.value?.addresses) && inicial_destiny_selected?.value?.addresses.length > 0;

  const has_end_destiny_selected = Array.isArray(end_destiny_selected?.value?.addresses) && end_destiny_selected?.value?.addresses.length > 0;

  const has_coordinates = Array.isArray(routes.coordinates) && routes.coordinates.length > 0;
  
  if(has_inicial_destiny_selected && has_end_destiny_selected && has_coordinates) {

    const [originAddress = {}] = inicial_destiny_selected?.value?.addresses || [];

    const origin = {
      lat: originAddress.lat || 0,  
      lng: originAddress.lng || 0,
    }
    
    const [destinationAddress = {}] = end_destiny_selected?.value?.addresses || [];

    const destination = {
      lat: destinationAddress.lat || 0,
      lng: destinationAddress.lng || 0,
    }

    // eslint-disable-next-line
    const waypoints = services_places.
    map(place => {
      const [address={}] = place?.place?.addresses;
      return {
        lat: address?.lat,
        lng: address?.lng
      };
    });
    
    if(execute_fit_bounce) {
      const has_map_vehicle = Number.isInteger(map_vehicle?.first_position?.vehicle_id);
      if(has_map_vehicle) {
        const vehicle_point = map_vehicle?.first_position?.lat && {
          lat: map_vehicle?.first_position?.lat || 0,
          lng: map_vehicle?.first_position?.lng || 0
        }
        fitBoundsOnMap([
          origin,
          waypoints,
          vehicle_point,
          destination
        ]
          .filter(Boolean)
          .flat()
        );
      }
      if(has_map_vehicle === false) fitBoundsOnMap([origin, waypoints, destination].flat());
    }
  }
  // eslint-disable-next-line
}, [inicial_destiny_selected, end_destiny_selected, services_places ,services_places.length, routes.coordinates, routes.coordinates.length, execute_fit_bounce]);

useEffect(() => {
  setMarkersOnMap(statePeriod);
  // eslint-disable-next-line
}, [statePeriod]);


useEffect(() => {
  dispatch(setPlaces({places:services_places || []}));
  // eslint-disable-next-line
}, [services_places]);

  const constructTimeBetweenPoints = ({ index, hour_going_return }) => {

    const all_times_between_points = getAllTimesBetweenPoints();

  const time_between_points = all_times_between_points[index];
  
  const [ hour, ] = hour_going_return.label.split('h');

  const date = new Date();
  
  const time = addSeconds(new Date(date.getFullYear(), date.getMonth(), date.getDay(), hour, 0, 0, 0),time_between_points);

  const time_format = ('0' + time.getHours()).slice(-2) + 'h ' + ('0' + time.getMinutes()).slice(-2) + 'min';

  return time_format;

}

  const tripDurationBetweenPoints = ({ index }) => {

  const has_legs = Array.isArray(routes.legs) && routes.legs.length > 0;

    const duration_between_points = DEFAULT_NULL_VALUE;

  try {

    if(has_legs) {

      const has_hour_going_selected = hour_going_selected.value !== undefined;

      if(has_hour_going_selected) {

        const hour_going_return = hour_going_selected;

        const time_between_points = constructTimeBetweenPoints({ index, hour_going_return });

        return time_between_points;
        
      }

      return duration_between_points;

    }
    
  } catch (error) {
    console.log('error ', error);
    return duration_between_points;
  }

}
  const sumArrayValues = (time, currentTime) => time + currentTime;

  const getAllTimesBetweenPoints = (legsArray = routes.legs) => {
    const hasLegs = Array.isArray(legsArray) && legsArray.length > 0;

    if (!hasLegs) return [];

    return legsArray
      .map(leg => +leg?.duration?.value || 0)
      .map((leg, index, allLegs) => {

        const allTimesUntilThisPoint = allLegs
          .slice(0, index)
          .reduce(sumArrayValues, 0);

        return leg + allTimesUntilThisPoint
      }) || [];
  }

  useEffect(() => {

    const has_waypoint_order = Array.isArray(routes.waypoint_order) && routes.waypoint_order.length > 0;

    if (has_waypoint_order) {

      const order_services_places = services_places
        .map((place, order) => ({ ...place, order, }));

      const order_by_best_route = routes.waypoint_order.map((best_order, index) => {

        const best_route_order_places = order_services_places.find(place => place.order === best_order);
          
        const has_departure_time = best_route_order_places?.departure && best_route_order_places?.departure.length > 0;
        if(has_departure_time) return {
          ...best_route_order_places,
          duration_between_points: best_route_order_places?.departure,            
        }

        return {
          ...best_route_order_places,
          duration_between_points: DEFAULT_NULL_VALUE,
        }

      });
      dispatch(setPlaces({places:order_by_best_route || []}));

  }
  // eslint-disable-next-line
} , [routes.waypoint_order, hour_going_selected]);

useEffect(() => {
  const vehicle = vehicles.find(vehicle => vehicle.id === vehicles_selected.value);
  const has_vehicle = vehicle !== undefined;
  if(has_vehicle) setVehicleIcon(vehicle?.icon || "");
  // eslint-disable-next-line
}, [vehicles_selected]);

useEffect(() => {

  const is_status_in_progress = 
    !!status_service && 
    status_service.length > 0 && 
    status_service === "in_progress";

  const has_services_places = 
    Array.isArray(services_places) &&
    services_places.length > 0;

    if(is_status_in_progress && has_services_places) {

      const get_progress_time = setInterval(() => {

        const limit = services_places.length;

        dispatch(getProgressLogisticsService({ limit, service_id }));

      }, time_get_logistics_progress);

      return () => clearInterval(get_progress_time);

    }
    // eslint-disable-next-line  
}, [status_service, services_places]);

  useEffect(() => {

    const is_status_in_progress =  status_service === "in_progress";

    const hasSelectedVehicle = !!overview_selected.vehicles_selected.value;

    if (hasSelectedVehicle && is_status_in_progress) dispatch(loadRouteMapVehicle({ vehicle_id: overview_selected.vehicles_selected.value, limit: 0 }));
    // eslint-disable-next-line
  }, [overview_selected.vehicles_selected.value]);

  useEffect(() => {

    const is_status_in_progress =  status_service === "in_progress";

    const limit = services_places.length;

    const hasPlaces = limit > 0;

    if (hasPlaces && is_status_in_progress) dispatch(getProgressLogisticsService({ limit, service_id }));
    // eslint-disable-next-line
  }, [services_places?.length])

  useEffect(() => {

const has_progress = Array.isArray(progress) && progress.length > 0;
const has_services_places = Array.isArray(services_places) && services_places.length > 0;
const has_status_in_progress = 
  !!status_service && 
  status_service.length > 0 && 
  status_service === "in_progress";

  const has_status_finished = 
  !!status_service && 
  status_service.length > 0 && 
  status_service === "finished";

if(has_progress && has_services_places && has_status_in_progress) {

  const services_places_with_order = services_places.map((place, i) => {
    return {
      ...place,
      order: i
    }
  });

  services_places.forEach((service_place, i) => {

    service_place.border_color = colors.pending;

    const progress_places = progress?.filter?.(pro => pro.place_id === service_place?.place?.id) || [];

    const placeHasCancelled = progress_places.some(p => p?.type_departure === 'place');
    
    const placeHasArrived = progress_places.length && !placeHasCancelled && (progress_places.length % 2 === 0) && service_place.type === 'out';

    const has_progress_place = !!progress_places.length && !placeHasCancelled && service_place.type === 'in';

    if (placeHasArrived) service_place.border_color = colors.arrived;

    if (placeHasCancelled) service_place.border_color = colors.cancelled;
    
    if (has_progress_place) service_place.border_color = colors.embarked;

    return {
      ...service_place,
      order: i,
    }
  });

  const progress_services_places = routes?.waypoint_order?.map?.((best_order, index) => {

    const best_route_order_places = services_places_with_order?.find?.(service => service.order === best_order) || {};

    best_route_order_places.border_color = colors.pending;

    const progress_places = progress?.filter?.(pro => pro.place_id === best_route_order_places?.place?.id) || [];

    const placeHasCancelled = progress_places.some(p => p?.type_departure === 'place');
    
    const placeHasArrived = progress_places.length && !placeHasCancelled && (progress_places.length % 2 === 0) && best_route_order_places?.type === 'out';

    const has_progress_place = !!progress_places.length && !placeHasCancelled && best_route_order_places?.type === 'in';

    if (placeHasArrived) best_route_order_places.border_color = colors.arrived;

    if (placeHasCancelled) best_route_order_places.border_color = colors.cancelled;
    
    if (has_progress_place) best_route_order_places.border_color = colors.embarked;
      
      const has_departure_time = best_route_order_places?.departure && best_route_order_places?.departure.length > 0;
      if(has_departure_time) return {
        ...best_route_order_places,
        duration_between_points: best_route_order_places?.departure,
        order: index            
      }

      return {
        ...best_route_order_places,
        duration_between_points: DEFAULT_NULL_VALUE,
        order: index
      }
  });

  const filterByWaitingStatus = place => place.border_color === colors.pending;

  const next_stop = progress_services_places?.filter?.(filterByWaitingStatus);

  const has_next_stop = Array.isArray(next_stop) && next_stop.length > 0;

  if(has_next_stop) {
    const [next={}] = next_stop;
    services_places.forEach(service_place => {
      const is_next_stop = service_place.place.id === next.place.id && service_place.type === next.type;
      if (is_next_stop) service_place.border_color = colors.driverWaiting;
    });

    progress_services_places.forEach(progress => {
      const is_next_stop = progress.place.id === next.place.id && progress.type === next.type;
      if (is_next_stop) progress.border_color = colors.driverWaiting;
    })
  }

  dispatch(setServicePlace({ services_places }));
  dispatch(setPlaces({places: progress_services_places || []}));

}

if(has_progress && has_services_places && has_status_finished) {

  const services_places_with_order = services_places.map((place, i) => {
    return {
      ...place,
      order: i
    }
  });

  services_places.forEach((service_place, i) => {

    service_place.border_color = colors.pending;

    const progress_place = progress.find(pro => pro.place_id === service_place?.place?.id);
    
    const placeHasCancelled = progress_place?.type_departure === 'place';

    const has_progress_place = !!progress_place && !placeHasCancelled && progress_place?.type === 'in';

    if (has_progress_place) service_place.border_color = colors.embarked;

    if (placeHasCancelled) service_place.border_color = colors.cancelled;

    return {
      ...service_place,
      order: i,
    }
  });

  const progress_services_places = routes.waypoint_order.map((best_order, i) => {

    const best_route_order_places = services_places_with_order.find(service => service.order === best_order);

    best_route_order_places.border_color = colors.pending;

    const progress_place = progress.find(pro => pro.place_id === best_route_order_places?.place?.id);
    
    const placeHasCancelled = progress_place?.type_departure === 'place';

    const has_progress_place = !!progress_place && !placeHasCancelled && progress_place?.type === 'in';

    if (has_progress_place) best_route_order_places.border_color = colors.embarked;

    if (placeHasCancelled) best_route_order_places.border_color = colors.cancelled;

    return {
      ...best_route_order_places,
      duration_between_points: DEFAULT_NULL_VALUE,
      order:i
    }
  });

  dispatch(setServicePlace({ services_places }));
  dispatch(setPlaces({places: progress_services_places || []}));

}
// eslint-disable-next-line
}, [progress]);

useEffect(() => {

  const has_vehicles = Array.isArray(vehicles) && vehicles.length > 0;

  const has_vehicles_selected = overview_selected.vehicles_selected.value !== undefined;

  const is_status_in_progress = 
    !!status_service && 
    status_service.length > 0 && 
    status_service === "in_progress";

  if(has_vehicles && has_vehicles_selected && is_status_in_progress) {

    const vehicle = vehicles?.find(vehicle => vehicle.id === overview_selected.vehicles_selected.value);

    const has_found_vehicle = vehicle !== undefined;

    if(has_found_vehicle) {

      const get_vehicle_last_positions = setInterval(() => {

        dispatch(loadRouteMapVehicle({ vehicle_id: vehicle.id, limit: 0 }));

      }, time_get_vehicle_last_positions);

      return () => clearInterval(get_vehicle_last_positions);

    }

  }
  // eslint-disable-next-line
}, [overview_selected.vehicles_selected, vehicles.length > 0]);

useEffect(() => {
  const has_map_vehicle = Number.isInteger(map_vehicle?.vehicle?.id);
  if(has_map_vehicle) {
    dispatch(logisticsChangeSelected({
      selected: {
          overview_selected: {
              ...overview_selected,
              vehicles_selected: {label: map_vehicle.vehicle.name, value: map_vehicle.vehicle.id},
          },
      },
  }))
  }
  // eslint-disable-next-line
}, [map_vehicle]);

const [dateSelected, setDateSelected] = useState(null);

useEffect(() => {

  const has_start_date_selected = typeof start_date_selected === 'string' && start_date_selected.length > 0;
  const has_end_date_selected = typeof end_date_selected === 'string' && end_date_selected.length > 0;

  if(has_start_date_selected === false && has_end_date_selected === false) {

    const start = format(start_date_selected, "yyyy-MM-dd");
    const end = format(end_date_selected, "yyyy-MM-dd");

    setDateSelected(setDate({ start, end }));
  }

  if(has_start_date_selected && has_end_date_selected) setDateSelected(setDate({ start: start_date_selected, end: end_date_selected }));

  // eslint-disable-next-line
}, [start_date_selected, end_date_selected, exception_day_selected]);


const setDate = ({ start, end }) => {
  return (
    <DateInput
      style={{ marginTop: "12px", marginRight: "12px" }}
      type={"calendar"}
      label={""}
      onChange={handleDate}
      name={"period"}
      id={"period"}
      placeholder={"dd/mm/aaaa"}
      value={exception_day_selected}
      hasDefaultValue
      defaultValue={exception_day_selected}
      calendar={{
        minDate: new Date(start + "T06:00:00Z"),
        maxDate: new Date(end + "T06:00:00Z"),
      }}
      buttonsSelections={false}
      icon={
        <HelpIconWithTooltip
          text={[
            localizedStrings.logisticService.inputDateInfo,
            <Link
              href={localizedStrings.logisticService.inputDateInfoLink}
              target={"_blank"}
            >
              {" "}
              {localizedStrings.learnMore}
            </Link>,
          ]}
        />
      }
      required
    />
  );
};

  return (
    <>
      <Row>
        <Col xl="8" xxl="8" style={{ padding: "0 0 0 14px", margin: "0" }}>
          <MapContainer
            mapElementStyle={{ minHeight: "500px" }}
            onMapLoad={({ map }) => {
              mapRef.current = map;
              map.setZoom(4);
              const brazilCoords = {
                lat: -14.760824585367107,
                lng: -54.98130527770911,
              };
              map.setCenter(brazilCoords);
            }}
            onZoomChanged={toggleControlsVisibility}
            onDrag={() => {
              toggleControlsVisibility();
            }}
          >
            {routes?.coordinates?.length > 0 && (
              <Polyline
                path={[routes?.start_location, routes?.coordinates].flat()}
                options={{
                  fillColor: "transparent",
                  strokeColor: "#1D1B84",
                  strokeOpacity: 0.5,
                  strokeWeight: 5,
                }}
              />
            )}
            {Array.isArray(services_places) &&
              services_places?.length > 0 &&
              services_places?.map((place, index) => {

                const {
                  place: { addresses = [] },
                } = place;

                const [address = {}] = addresses;

                const showPassenger = true;

                const location = {
                  name: place?.name || "",
                  lat: address?.lat,
                  lng: address?.lng,
                  icon: "female_solid",
                  border_color: place?.border_color !== undefined ? place?.border_color : "#FAA628",
                  icon_background_color: "#FFF",
                };

                return (
                  <ErrorBoundary>
                    <Marker
                      title={location?.name}
                      icon={
                        showPassenger && {
                          url: "",
                        }
                      }
                      draggable={false}
                      position={{ lat: location?.lat, lng: location?.lng }}
                    >
                      {showPassenger && (
                        <InfoWindow>
                          <Pin
                            title={location?.name || ""}
                            iconOptions={{ marginLeft: "4px", top: "0px" }}
                            width={"28px"}
                            height={"28px"}
                            icon={location?.icon}
                            name={location?.name}
                            backgroundColor={location?.icon_background_color}
                            borderColor={location?.border_color || "#FF3D3D"}
                            textOptions={true}
                            position={"relative"}
                            optionsIcons={{ height: "18px", width: "22px" }}
                            cursor={"default"}
                          />
                        </InfoWindow>
                      )}
                    </Marker>
                  </ErrorBoundary>
                );
              })}
            {inicialDestiny?.value && (
              <ErrorBoundary>
                <Marker
                  title={inicialDestiny?.label}
                  icon={{ url: pinStart }}
                  draggable={false}
                  position={{
                    lat: inicialDestiny.address?.lat,
                    lng: inicialDestiny.address?.lng,
                  }}
                ></Marker>
              </ErrorBoundary>
            )}
            {endDestiny?.value && (
              <ErrorBoundary>
                <Marker
                  title={endDestiny?.label}
                  icon={{ url: pinEnd }}
                  draggable={false}
                  position={{
                    lat: endDestiny.address?.lat,
                    lng: endDestiny.address?.lng,
                  }}
                ></Marker>
              </ErrorBoundary>
            )}
            {
              map_vehicle !== undefined &&
              Number.isInteger(map_vehicle?.vehicle?.id) &&
              map_vehicle?.first_position?.lat &&
              map_vehicle?.first_position?.lng &&
              <ErrorBoundary>
                <Marker
                  title={map_vehicle?.vehcle?.name}
                  icon={{ url: "", }}
                  draggable={false}
                  position={{ lat: map_vehicle?.first_position?.lat, lng: map_vehicle?.first_position?.lng }}
                >
                  <InfoWindow>
                    <Pin
                      iconOptions={{ marginLeft: "-1px", top: "0px" }}
                      width={"28px"}
                      height={"28px"}
                      icon={map_vehicle?.vehicle?.icon || "carro-frente-1"}
                      name={map_vehicle?.vehicle?.name}
                      backgroundColor={"#FFF"}
                      borderColor={"#1DC9B7"}
                      position={"relative"}
                      optionsIcons={{ height: "18px", width: "22px" }}
                      cursor={"default"}
                    />
                  </InfoWindow>
                </Marker>
              </ErrorBoundary>
            }
            {Array.isArray(map_vehicle?.last_positions) &&
              map_vehicle?.last_positions.length > 0 &&
              (
                <Polyline
                  path={map_vehicle?.last_positions}
                  options={{
                    fillColor: "transparent",
                    strokeColor: "#1D1B84",
                    strokeOpacity: 0.5,
                    strokeWeight: 5,
                  }}
                />
              )}
          </MapContainer>
        </Col>
        <Col xl="4" xxl="4" style={{ padding: "0 0 0 0px", margin: "0" }}>
          <DivServiceLogistic>
            <InputDateLogistic>
              {dateSelected}
            </InputDateLogistic>
            <hr style={{ marginBottom: "0px" }}></hr>
            <TabLogistic>
              <LogisticDetailRouteForm setStatePeriod={setStatePeriod} />
            </TabLogistic>
          </DivServiceLogistic>
        </Col>
      </Row>
      <Row style={{ margin: "14px 0" }}>
        <Col xl="8" xxl="8" style={{ display: "flex", alignItems: "center" }}>

          <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
            <Pin
              iconOptions={{ marginLeft: "5px", top: "1px" }}
              width={"20px"}
              height={"20px"}
              icon={"female_solid"}
              borderWidth={"2px"}
              name={""}
              backgroundColor={"#FFF"}
              borderColor={colors.pending}
              textOptions={true}
              position={"relative"}
              optionsIcons={{ height: "12px", width: "11px" }}
              optionsArrow={{ bottom: "-10px" }}
              cursor={"default"}
            />
            <Text
              whiteSpace="normal"
              marginTop="4px"
              marginLeft="8px"
              marginRight="4px"
              font="normal normal normal 12px/16px Roboto"
              letterSpacing="0.1px"
              color="#444444"
            >
              {localizedStrings.logisticService.wating}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
            <Pin
              iconOptions={{ marginLeft: "5px", top: "1px" }}
              width={"20px"}
              height={"20px"}
              icon={"female_solid"}
              borderWidth={"2px"}
              name={""}
              backgroundColor={"#FFF"}
              borderColor={colors.embarked}
              textOptions={true}
              position={"relative"}
              optionsIcons={{ height: "12px", width: "11px" }}
              optionsArrow={{ bottom: "-10px" }}
              cursor={"default"}
            />
            <Text
              whiteSpace="normal"
              marginTop="4px"
              marginLeft="8px"
              marginRight="4px"
              font="normal normal normal 12px/16px Roboto"
              letterSpacing="0.1px"
              color="#444444"
            >
              {localizedStrings.logisticService.shipped}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
            <Pin
              iconOptions={{ marginLeft: "5px", top: "1px" }}
              width={"20px"}
              height={"20px"}
              icon={"female_solid"}
              borderWidth={"2px"}
              name={""}
              backgroundColor={"#FFF"}
              borderColor={colors.arrived}
              textOptions={true}
              position={"relative"}
              optionsIcons={{ height: "12px", width: "11px" }}
              optionsArrow={{ bottom: "-10px" }}
              cursor={"default"}
            />
            <Text
              whiteSpace="normal"
              marginTop="4px"
              marginLeft="8px"
              marginRight="4px"
              font="normal normal normal 12px/16px Roboto"
              letterSpacing="0.1px"
              color="#444444"
            >
              {localizedStrings.logisticService.arrived}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
            <Pin
              iconOptions={{ marginLeft: "5px", top: "1px" }}
              width={"20px"}
              height={"20px"}
              icon={"female_solid"}
              borderWidth={"2px"}
              name={""}
              backgroundColor={"#FFF"}
              borderColor={colors.cancelled}
              textOptions={true}
              position={"relative"}
              optionsIcons={{ height: "12px", width: "11px" }}
              optionsArrow={{ bottom: "-10px" }}
              cursor={"default"}
            />
            <Text
              whiteSpace="normal"
              marginTop="4px"
              marginLeft="8px"
              marginRight="4px"
              font="normal normal normal 12px/16px Roboto"
              letterSpacing="0.1px"
              color="#444444"
              >
              {localizedStrings.logisticService.notShipped}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
            <Pin
              iconOptions={{ marginLeft: "5px", top: "1px" }}
              width={"20px"}
              height={"20px"}
              icon={"female_solid"}
              borderWidth={"2px"}
              name={""}
              backgroundColor={"#FFF"}
              borderColor={colors.driverWaiting}
              textOptions={true}
              position={"relative"}
              optionsIcons={{ height: "12px", width: "11px" }}
              optionsArrow={{ bottom: "-10px" }}
              cursor={"default"}
            />
            <Text
              whiteSpace="normal"
              marginTop="4px"
              marginLeft="8px"
              marginRight="4px"
              font="normal normal normal 12px/16px Roboto"
              letterSpacing="0.1px"
              color="#444444"
            >
              {localizedStrings.logisticService.nextStop}
            </Text>
          </div>
          {
            status_service !== undefined &&
            status_service === "in_progress" &&
            <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
              {
                vehicleIcon.length > 0 &&
                <Pin
                  iconOptions={{ marginLeft: "0px", top: "1px" }}
                  width={"20px"}
                  height={"20px"}
                  borderWidth={"2px"}
                  icon={vehicleIcon}
                  name={""}
                  backgroundColor={"#FFF"}
                  borderColor={colors.driverWaiting}
                  textOptions={true}
                  position={"relative"}
                  optionsIcons={{ height: "16px", width: "117x" }}
                  optionsArrow={{ bottom: "-10px" }}
                  cursor={"default"}
                />
              }
              {
                vehicleIcon.length === 0 &&
                <Pin
                  iconOptions={{ marginLeft: "0px", top: "1px" }}
                  width={"20px"}
                  height={"20px"}
                  borderWidth={"2px"}
                  icon={"carro-frente-1"}
                  name={""}
                  backgroundColor={"#FFF"}
                  borderColor={colors.driverWaiting}
                  textOptions={true}
                  position={"relative"}
                  optionsIcons={{ height: "16px", width: "117x" }}
                  optionsArrow={{ bottom: "-10px" }}
                  cursor={"default"}
                />
              }
              <Text
                whiteSpace="normal"
                marginTop="4px"
                marginLeft="8px"
                font="normal normal normal 12px/16px Roboto"
                letterSpacing="0.1px"
                color="#444444"
              >
                {localizedStrings.logisticService.driverOnTheWay}
              </Text>
            </div>
          }
          <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
            <img style={{ height: "20px" }} src={pinStart} alt="Inicio" />
            <Text
              whiteSpace="normal"
              marginTop="4px"
              marginLeft="8px"
              marginRight="4px"
              font="normal normal normal 12px/16px Roboto"
              letterSpacing="0.1px"
              color="#444444"
            >
              {localizedStrings.logisticService.begining}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
            <img style={{ height: "20px" }} src={pinEnd} alt="Fim" />
            <Text
              whiteSpace="normal"
              marginTop="4px"
              marginLeft="8px"
              marginRight="4px"
              font="normal normal normal 12px/16px Roboto"
              letterSpacing="0.1px"
              color="#444444"
            >
              {localizedStrings.logisticService.end}
            </Text>
          </div>
        </Col>
      </Row>
    </>
  );
}