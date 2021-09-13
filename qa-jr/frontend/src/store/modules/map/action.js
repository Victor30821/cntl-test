
import {
    SET_MAP_CONFIGURATION,
    SET_INDIVIDUAL_VEHICLE,
    SET_SEARCHED_ADDRESS,
    SET_SEARCHED_ADDRESS_LATLNG,
    SET_ROUTE,
    SET_ROUTES,
    SET_VEHICLE_ADDRESS,
    MAP_CHANGE_OPERATION_STATES,
    SET_BEST_ROUTE,
    INITIAL_STATE,
    SET_SEARCHED_ALL_ADDRESS_LATLNG,
    SET_ADDRESS_INFO_WINDOW
} from './reducer';
import { proxyApi, mapApi, api } from 'services/api';
import { API_KEY_MAP_GEOCODE, API_KEY_MAP_DIRECTIONS, HTTP_STATUS, geocodeAccuracyThreshold, API_URL_PROXY } from 'constants/environment.js'
import { localizedStrings } from 'constants/localizedStrings';
import storage from "redux-persist/lib/storage";
import capitalize from 'helpers/capitalize';

export function changeMapConfiguration({
    reset = false, ...configuration
}) {
    let payload;
    if (reset) payload = { ...INITIAL_STATE };
    else payload = { ...configuration };
    return {
        type: SET_MAP_CONFIGURATION,
        payload
    };
}
export function mapChangeOperationStates({
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
    addressLoading = false,
    addressFail = false,
    addressSuccess = false,
    loadLoadingFromException = false,
}) {
    return {
        type: MAP_CHANGE_OPERATION_STATES,
        payload: {
            loadLoading,
            loadSuccess,
            loadFail,
            addressLoading,
            addressFail,
            addressSuccess,
            loadLoadingFromException
        }
    };
}
export function setVehicle({
    vehicle = {}
}) {
    return {
        type: SET_INDIVIDUAL_VEHICLE,
        payload: {
            vehicle
        }
    };
}
export function setMapRoute(routeObj = false, linkOnRoute) {
    return {
        type: SET_ROUTE,
        payload: {
            url: linkOnRoute,
            route: routeObj
        }
    };
}
export function setMapRoutes({ allRoutes = false, currentRoute = false }) {
    return {
        type: SET_ROUTES,
        payload: {
            routes: {
                allRoutes,
                currentRoute,
            }
        }
    };
}
export function setVehicleAddress({ location }) {
    return {
        type: SET_VEHICLE_ADDRESS,
        payload: {
            vehicleAddress: location
        }
    };
}
export function setSearchedAddress({ location }) {
    return {
        type: SET_SEARCHED_ADDRESS,
        payload: {
            searchedAddress: location
        }
    };
}
export function setSearchedAddressLatLng({ location, clear }) {
    return {
        type: SET_SEARCHED_ADDRESS_LATLNG,
        payload: {
            searchedAddressLatLng: location,
            clear: clear
        }
    };
}

export function setSearchedAllAddressLatLng({ location, clear }) {
    return {
        type: SET_SEARCHED_ALL_ADDRESS_LATLNG,
        payload: {
            searchedAddressLatLng: location,
            clear
        }
    }
}

export function setBestRoute({ coordinates, start_location, end_location, waypoint_order, legs  }) {
    return {
        type: SET_BEST_ROUTE,
        payload: {
            coordinates,
            start_location,
            end_location,
            waypoint_order,
            legs
        }
    };
}

export function setAddressInfoWindow({ infoWindowAddress }) {
    return {
        type: SET_ADDRESS_INFO_WINDOW,
        payload: {
            infoWindowAddress
        }
    }
}

const filterCoordinates = coordinate => !!coordinate?.length;

const extractCorrectLatAndLng = (arrayOfCoordinates = []) => {
    arrayOfCoordinates.reverse();
    const [lat, lng] = arrayOfCoordinates;
    return { lat, lng };
}

export const getBestRoute = ({
    latLng = {},
    waypoints = "",
}) => async dispatch => {
    try {
        const UrlDirections = "/api/directions/json?key=" + API_KEY_MAP_DIRECTIONS;

        const directionsParams = {
            "geometries": "geojson",
            "travelMode": window?.google?.maps?.TravelMode?.DRIVING,
            "origin": "" + [latLng.origin?.lat, latLng.origin?.lng],
            waypoints,
            "destination": "" + [latLng.destination?.lat, latLng.destination?.lng],
            "optimize": true
        }

        const {
            data
        } = await proxyApi.get(UrlDirections, { params: directionsParams });

        const dataHasProblems = data?.status !== window?.google?.maps?.DirectionsStatus?.OK;

        if (dataHasProblems) throw localizedStrings.errorWhenLoadingRoute;

        const { routes: [ route ] } = data;

        const { geometry: { coordinates = [] }, legs: [ info ], waypoint_order = [] } = route;

        const { start_location, end_location } = info;

        dispatch(setBestRoute({
            start_location: extractCorrectLatAndLng(start_location?.lat),
            end_location: extractCorrectLatAndLng(end_location?.lat),
            coordinates: coordinates.filter(filterCoordinates).map(extractCorrectLatAndLng),
            waypoint_order,
            legs: route.legs
        }))
    } catch (error) {
        console.log('[error] get best route: ' + error);
    }
};

export const searchAddressToRoute = ({
    text = "",
    latLng = {},
    language = "pt",
    route = {},
    showRoute,
}) => async dispatch => {
    try {
        const newRoute = JSON.parse(JSON.stringify({
            coordinates: [],
            ...route,
            addresses: [],
            distance: 0,
            duration: 0,
            showRoute,
        }));
        const createOrigin = JSON.parse(JSON.stringify(newRoute.coordinates)).shift();
        const getOrigin = JSON.parse(await storage.getItem("origin"));
        const origin = (!createOrigin?.lat && !createOrigin?.lng && getOrigin?.origin) || createOrigin;

        if(origin?.lat && origin?.lng) await storage.setItem("origin", JSON.stringify({ origin: origin }));

        let bestResult = false;
        if (text) {
            const UrlGeocode = `/api/geocode/json?res=format&key=${API_KEY_MAP_GEOCODE}&source=google`;

            const geocodeParams = [
                "language=" + language,
                "address=" + text
            ].join("&");

            const {
                data: { results }
            } = await proxyApi.get(UrlGeocode + geocodeParams);

            bestResult = results.shift();
            newRoute.addresses.push(bestResult);
        }

        if (latLng?.lat && latLng?.lng) {
            const UrlGeocode = "/api/geocode/json?res=format&key=" + API_KEY_MAP_GEOCODE + "&";

            const geocodeParams = [
                "language=" + language,
                // eslint-disable-next-line
                "latlng=" + `${latLng.lat},${latLng.lng}`
            ].join("&");

            const {
                data: { results }
            } = await proxyApi.get(UrlGeocode + geocodeParams);

            bestResult = results.shift();
            newRoute.addresses.push(bestResult);
        }

        if (!bestResult || newRoute.addresses) newRoute.coordinates = [];

        const linkOnRoute = `https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&origin=${origin?.lat},${origin?.lng}&destination=${bestResult?.latitude},${bestResult?.longitude}`;

        if (!showRoute) return dispatch(setMapRoute(newRoute, linkOnRoute));

        const destination = {
            lat: bestResult?.latitude,
            lng: bestResult?.longitude,
        };


        const hasRoute = origin?.lat?.toString() && origin?.lng?.toString() && destination?.lat?.toString() && destination?.lng?.toString();

        if (!hasRoute) return dispatch(setMapRoute(newRoute, linkOnRoute));

        const UrlDirections = "/api/directions/json?key=" + API_KEY_MAP_DIRECTIONS;

        const directionsParams = {
            "geometries": "geojson",
            "travelMode": window?.google?.maps?.TravelMode?.DRIVING,
            "origin": "" + [origin?.lat, origin?.lng],
            "destination": "" + [destination?.lat, destination?.lng],
        }

        const {
            data
        } = await proxyApi.get(UrlDirections, { params: directionsParams });

        const dataHasProblems = data?.status !== window?.google?.maps?.DirectionsStatus?.OK;

        if (dataHasProblems) throw localizedStrings.errorWhenLoadingRoute;

        const [routeObj] = data.routes;


        newRoute.coordinates = [
            ...newRoute.coordinates,
            ...routeObj.geometry.coordinates
                .filter(filterCoordinates)
                .map(extractCorrectLatAndLng),
        ];

        routeObj.legs.forEach(leg => {
            newRoute.distance += leg?.distance?.value ?? 0;
            newRoute.duration += leg?.duration?.value ?? 0;
        });

        dispatch(setMapRoute(newRoute,linkOnRoute))
        // onFinish(route);
    } catch (error) {
        console.log(error);
    }
}
export const setRoute = ({
    origin = {},
    destination = {},
    travelMode = window.google.maps.TravelMode.DRIVING,
    waypoints,
    onFinish = () => { },
    onError = () => { },
}) => async dispatch => {
    try {

        const hasRoute = origin?.lat?.toString() && origin?.lng?.toString() && destination?.lat?.toString() && destination?.lng?.toString();

        if (!hasRoute) return dispatch(setMapRoute())
        const URL = "/api/directions/json?key=" +
        API_KEY_MAP_DIRECTIONS;
        const params = {
            "geometries": "geojson",
            "travelMode": travelMode,
            "waypoints": waypoints,
            "origin": origin.lat + "," + origin.lng,
            "destination": destination.lat + "," + destination.lng,
        }
        const {
            data
        } = await proxyApi.get(URL, { params });

        const dataHasProblems = data?.status !== window?.google?.maps?.DirectionsStatus?.OK;

        if (dataHasProblems) throw localizedStrings.errorWhenLoadingRoute;

        const [routeObj] = data.routes;

        const linkOnRoute = `https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&origin=${origin?.lat},${origin?.lng}&destination=${destination?.lat},${destination?.lng}`;

        const route = {
            coordinates: routeObj.geometry.coordinates
                .filter(filterCoordinates)
                .map(extractCorrectLatAndLng),
            distance: 0,
            duration: 0,
            addresses: [{
                formattedAddress: destination?.address,
                latitude: destination.lat,
                longitude: destination.lng,
            }],
            showRoute: true
        }

        routeObj.legs.forEach(leg => {
            route.distance += leg?.distance?.value ?? 0;
            route.duration += leg?.duration?.value ?? 0;
        })

        dispatch(setMapRoute(route, linkOnRoute))
        onFinish(route);
    } catch (error) {
        console.log(error);
        onError({ result: error })
        return dispatch(setMapRoute())
    }
}
export const searchAddressLatLng = ({ coordinates, onFinish, clear = false }) => async dispatch => {
    dispatch(mapChangeOperationStates({ loadSuccess: false }));
	const locations = [];
    if (typeof coordinates === 'object' && coordinates.length > 0) {
		const data = [];
		coordinates.forEach((coord) => {
			if (coord?.lat && coord?.lng) {
				data.push({
					url:"/api/geocode/json?latlng=" + coord.lat + "," + coord.lng + "&key=" + API_KEY_MAP_GEOCODE + "&language=pt-BR&channel=contele-gv&sensor=&client=gme-contelesolucoestecnologicas&res=format&mode=1"
				})
			}
		});

		const params = {
			method: 'POST',
			body: JSON.stringify({data}),
		};

		const response = await fetch(API_URL_PROXY + 'api/multi_requests/', params);
		const { content = [] } = await response?.json();
		locations.push(...content);
    }
	locations.forEach(location => {
		dispatch(setSearchedAddressLatLng({ location, clear }));
	})
    dispatch(mapChangeOperationStates({ loadSuccess: true }));
    onFinish && onFinish();
}

const searchAddressSmart = async ({
    text,
    language,
}) => {

    const googleSourceFlag = {
        source: "google"
    }

    const URL = "/api/geocode/json";

    const params = {
        language: language,
        address: text,
        res: "format",
        key: API_KEY_MAP_GEOCODE
    }

    const address = {
        result: [],
    };

    if (!text) return address;

    const {
        data: {
            results: cheapestResult = []
        }
    } = await proxyApi.get(URL, { params });

    address.result = cheapestResult;

    const [firstResult] = address.result;

    const isInaccurate = +firstResult?.accuracy < +geocodeAccuracyThreshold;

    if (isInaccurate) {

        const {
            data: {
                results: bestResult = []
            }
        } = await proxyApi.get(URL, {
            params: {
                ...params,
                ...googleSourceFlag
            }
        });

        address.result = bestResult;
    }

    return address;
}
export const searchAddress = ({
    text,
    language = "pt",
    fromException = false
}) => async dispatch => {
    try {
        if (!text) return;
        if (fromException) dispatch(mapChangeOperationStates({ loadLoadingFromException: true }))

        const address = await searchAddressSmart({
            language,
            text,
        })

            const route = {
                showRoute: false,
                addresses: address?.result?.map(result => ({
                    ...result,
                    formatted_address: result?.formattedAddress,
                    latitude: result?.latitude,
                    longitude: result?.longitude,
                })),
            }

            if (fromException) dispatch(mapChangeOperationStates({ loadLoadingFromException: false }))

            dispatch(setMapRoute(route))
            return route;
        } catch (error) {
            console.log(error);
        }
    }

export const searchMultiAddresses = ({
    texts,
    language = "pt"
}) => async dispatch => {
    try {
        const hasTexts = Array.isArray(texts) && texts.length > 0;

        if (!hasTexts) return;

        const addresses = [];



        for (let index = 0; index < texts.length; index++) {
            const address = await searchAddressSmart({
                language,
                text: texts[index],
            })
            addresses.push(address);
        }

        dispatch(setSearchedAddress({ location: addresses }))
    } catch (error) {
        console.log(error);
    }
}
export const searchVehicleAddress = ({
    lat,
    lng,
    language = "pt",
}) => async dispatch => {
    try {
        if (!lat || !lng) return;
        const URL = "/api/geocode/json?res=format&key=" + API_KEY_MAP_GEOCODE + "&";

        const params = [
            "language=" + language,
            "latlng=" + [lat, lng],
        ].join("&");

        const {
            data: { results }
        } = await proxyApi.get(URL + params);

        const [bestResult] = results;

        dispatch(setVehicleAddress({ location: {
			...bestResult,
			capitalizedFormattedAddress: capitalize(bestResult?.formattedAddress)
		}}));
    } catch (error) {
        console.log(error);
    }
}
export const getRoutesByFileId = (data, onFinish = () => { }) => async dispatch => {
    try {
        dispatch(mapChangeOperationStates({ loadLoading: true }))
        if (!data?.vehicle_id || (!data.onGoing && !data?.file_route_id)) return;
        let URL = "/api/v1/last-break-route-point/?";

		if (data.onGoing) {
			URL = "/api/v1/last-points/?limit=false&"
		}

        const params = [];
        const filters = {
            file_route_id: val => val && params.push("file_route_id=" + val),
            vehicle_id: val => val && params.push("vehicle_id=" + val),
        }
        Object.keys(data).forEach(filter => filters?.[filter]?.(data?.[filter] ?? false))
        URL += params.join("&")

        const {
            data: { last_points }
        } = await mapApi.get(URL);
        const routes = {
            ...data?.route,
            coordinates: [],
        }

		let lastPointArray = Array.isArray(last_points) ? last_points : [last_points];

        lastPointArray.forEach(points => {
            routes.coordinates = points.last_positions.map(point => {
                return {
                    lat: point?.lat,
                    lng: point?.lng,
                }
            });
            routes.points = points.last_positions;
        });

        dispatch(setMapRoutes({
            currentRoute: {
                ...routes
            }
        }));
        dispatch(mapChangeOperationStates({ loadSuccess: true }))
        onFinish(routes);
    } catch (error) {
        console.log(error);
        dispatch(mapChangeOperationStates({ loadFail: true }));
    }
}

export const searchAddreessFromZipCode = data => async dispatch => {

    dispatch(mapChangeOperationStates({ addressLoading: true }));
    const { zipCode } = data;
    const errorFlag = "<error>";

    const [viacep, widenet] = [0, 1];
    const URLs = {
        [viacep]: `https://viacep.com.br/ws/${zipCode}/json/`,
        [widenet]: `https://apps.widenet.com.br/busca-cep/api/cep/${zipCode}.json`,
    }


    const addressParser = (rawAddress, index) => {
        const parsedAddress = {
            address: null,
            neighborhood: null,
            city: null,
            state: null
        }

        const zipcodeApisParser = {
            [viacep]: rawAddress => {
                parsedAddress.address = rawAddress?.logradouro;
                parsedAddress.neighborhood = rawAddress?.bairro;
                parsedAddress.city = rawAddress?.localidade;
                parsedAddress.state = rawAddress?.uf;
                return true
            },
            [widenet]: rawAddress => {
                parsedAddress.address = rawAddress?.address;
                parsedAddress.neighborhood = rawAddress?.district;
                parsedAddress.city = rawAddress?.city;
                parsedAddress.state = rawAddress?.state;
                return true
            },
        }

        if (!zipcodeApisParser?.[index]?.(rawAddress)) return dispatch(mapChangeOperationStates({ addressFail: true }));

        dispatch(mapChangeOperationStates({ addressSuccess: true }));
        dispatch(setSearchedAddress({ location: parsedAddress }))
        return;
    }



    const getAddress = async (url = false, index) => {
        try {
            if (!url) throw errorFlag;

            const result = await api.get(url);

            if (!result || result?.data?.status === HTTP_STATUS.NOT_FOUND || result?.data?.erro) return getAddress(URLs[index + 1], index + 1);

            addressParser(result?.data ?? {}, index);

        } catch (error) {
            dispatch(mapChangeOperationStates({ addressFail: true }));
            dispatch(setSearchedAddress({}))
        }
    }
    getAddress(URLs[viacep], viacep);

};


export const searchAllAddressLatLng = ({ coordinates, clear = false }) => async dispatch => {
    try {
        dispatch(mapChangeOperationStates({ loadSuccess: false }));
        if (clear) {
            dispatch(setSearchedAddressLatLng({ location: [], clear }));
        }
        if (typeof coordinates === 'object' && coordinates.length > 0) {

            const coordinates_promise = coordinates.map(async (coord) => {
                try {
                    const url = "/api/geocode/json?latlng=" + coord.lat + "," + coord.lng + "&key=" + API_KEY_MAP_GEOCODE + "&language=pt-BR&channel=contele-gv&sensor=&client=gme-contelesolucoestecnologicas&res=format&mode=1";
                    const { data: { results = [] } } = await proxyApi.get(url);
                    const has_results = Array.isArray(results) && results?.length > 0;
                    if(has_results) {
                        const [result={}] = results;
                        return {...result, lat: coord.lat, lng: coord.lng};
                    }
                    return undefined;
                } catch (error) {
                    console.log(error);
                    return undefined;
                }
            }, []);

            const location = await Promise.all(coordinates_promise);
            dispatch(setSearchedAllAddressLatLng({ location, clear }));
        }
        dispatch(mapChangeOperationStates({ loadSuccess: true }));
    } catch (error) {
        console.error(error);
        dispatch(setSearchedAllAddressLatLng({ location: [], clear }));
        dispatch(mapChangeOperationStates({ loadFail: true }));
    }
}

export const searchAddressInfoWindow = ({
    lat,
    lng,
    language = "pt",
}) => async dispatch => {
    try {
        if (!lat || !lng) {
            dispatch(setAddressInfoWindow({ infoWindowAddress: "" }));
            return;
        };
        const URL = "/api/geocode/json?res=format&key=" + API_KEY_MAP_GEOCODE + "&";

        const params = [
            "language=" + language,
            "latlng=" + [lat, lng],
        ].join("&");

        const {
            data: { results }
        } = await proxyApi.get(URL + params);

        const [bestResult] = results;
        
        dispatch(setAddressInfoWindow({ infoWindowAddress: bestResult }));
    } catch (error) {
        console.log(error);
    }
}
