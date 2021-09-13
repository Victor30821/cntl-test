import {
	formatCostToCard,
	formatDistanceToCard,
	formatTimeToCard,
	formatSpeedToCard,
} from "helpers/ReportCardsCalc";
import populateSelects from "constants/populateSelects";
import { format, parseISO, startOfDay,endOfDay } from "date-fns";
import { api, apiRoutes } from "services/api";
import { convertUserMaskToDateFns } from "utils/convert.js";
import { localizedStrings } from "constants/localizedStrings";
import {
	API_URL,
	API_URL_PROXY,
	API_URL_MAP,
	API_KEY_MAP_GEOCODE,
	DEFAULT_NULL_VALUE,
	PER_PAGE_LENGTHS,
} from "constants/environment";
import worker_script from "utils/workerGetAddress";
import loadVehiclesWithGroupsReports from "../vehicles/getVehiclesWithGroupsReports"
import { canUseNewApi } from 'utils/contractUseNewApi';
import { removeOldApiReportsUntil } from 'utils/removeOldApiReportsUnti';
import { validateDateNewApi } from 'utils/validateDateNewApi';

const getRegistersByOffSet = ({ registers }) => {
	if (registers.length === 0) return { registers, listAddresses: [] };
	const attributes = ["start", "end"];
	const customLength = Math.ceil(registers.length * attributes.length);
	const addressList = new Array(customLength).fill(undefined);
	return {
		// eslint-disable-next-line
		listAddresses: addressList.map((data, index) => {
			const registerIndex = index === 0 ? 0 : Math.floor(index / 2);
			const currentRegister = registers[registerIndex];
			const [isStart, isEnd] = [index % 2 === 0, index % 2 === 1];
			if (isStart)
				return {
					lat: currentRegister?.start_lat,
					lng: currentRegister?.start_lng,
				};
			if (isEnd)
				return {
					lat: currentRegister?.end_lat,
					lng: currentRegister?.end_lng,
				};
		}),
	};
};

const getAddress = ({ listAddress }) => {
	return new Promise((resolve, reject) => {
		if (listAddress.length > 0) {
			const worker = new Worker(worker_script);
			worker.postMessage({
				listAddress,
				urls: { API_URL, API_URL_MAP, API_URL_PROXY },
				token: "",
				maps_key: API_KEY_MAP_GEOCODE,
			});
			worker.addEventListener("message", (e) => {
				try {
					const response = e.data;
					const data = {};
					for (let i = 1; i < response?.length; i++) {
						const [address] = response?.[i] || [{}];
						const key =
							(address?.latitude &&
								address?.longitude &&
								`${address?.latitude.toFixed(
									3
								)},${address?.longitude.toFixed(3)}`) ||
							false;
						if (!key) continue;
						data[key] = address;
					}
					resolve(data);
				} catch (error) {
					reject([]);
					console.log(error);
				}
			});
		}
	});
};

const reportRoutesOldApi = async ({
	filters,
	showAddress
}) => {

	const URL = "/routes/v1/?";

	const params = {
		vehicle_id: filters.vehicle_id,
		organization_id: filters.organization_id || "",
		start_date: startOfDay(new Date(filters.start_date.split('-'))),
		end_date: endOfDay(new Date(filters.end_date.split('-'))),
		type: !filters?.type ? null : filters.type,
		limit: filters.limit || PER_PAGE_LENGTHS[0],
	};

	const {
		data: {
			routes
		}
	} = await api.get(URL, { params });

	const has_routes = Array.isArray(routes) && routes.length > 0;

	if(has_routes === false) return {
		routes: [],
	}

	if (showAddress) {

		const { listAddresses = [] } = getRegistersByOffSet({
			registers: routes,
		});
		
		const address = await getAddress({
			listAddress: listAddresses,
		});

		const routes_formatted = routes.reduce((acc, reg, index) => {
			acc.push({
				...reg,
				id: index,
				coords: {
					start_lat: reg?.start_lat,
					start_lng: reg?.start_lng,
					end_lat: reg?.end_lat,
					end_lng: reg?.end_lng,
				},
				real_date: reg.start_date,
				time: reg.time,
				date: reg?.start_date,
				init: reg?.start_date,
				end: reg?.end_date,
				average_speed: reg.average_speed,
				max_speed: reg.max_speed,
				distance: reg.distance,
				cost: reg.cost,
				driver_name: reg.driver_name,
				address_start: address[`${reg.start_lat?.toFixed(3)},${reg.start_lng.toFixed(3)}`]?.formattedAddress || localizedStrings.loading,
				address_end: address?.[`${reg.end_lat?.toFixed(3)},${reg.end_lng?.toFixed(3)}`]?.formattedAddress || localizedStrings.loading,
				organization_id: reg.organization_id,
				file_route_id: reg?.file_route_id,
				vehicle_id: reg.vehicle_id,
			});
			return acc;
		},[]);

		return {
			routes: routes_formatted
		}
		
	  }

	  const routes_formatted = routes.reduce((acc, reg, index) => {
		acc.push({
			...reg,
			id: index,
			coords: {
				start_lat: reg?.start_lat,
				start_lng: reg?.start_lng,
				end_lat: reg?.end_lat,
				end_lng: reg?.end_lng,
			},
			real_date: reg.start_date,
			time: reg.time,
			date: reg?.start_date,
			init: reg?.start_date,
			end: reg?.end_date,
			average_speed: reg.average_speed,
			max_speed: reg.max_speed,
			distance: reg.distance,
			cost: reg.cost,
			driver_name: reg.driver_name,
			address_start: "",
			address_end: "",
			organization_id: reg.organization_id,
			file_route_id: reg?.file_route_id,
			vehicle_id: reg.vehicle_id,
		});
		return acc;
	},[]);

	  return {
		  routes: routes_formatted,
	  }
}

const reportRoutesNewApi = async ({
	filters,
	showAddress
}) => {
	try {

		const vehicles = await loadVehiclesWithGroupsReports({
			organizationId: filters.organization_id,
			vehiclesIds: [filters?.vehicle_id],
		});

		const [vehicle={}] = vehicles;

		const {
			serial_number: imei,
		} = vehicle;

		const {
			is_authorized
		} = canUseNewApi({ organization_id: +filters?.organization_id, last_points: [{vehicle}], vehicle_id: filters?.vehicle_id });

		if(is_authorized === false) return {
			new_report_routes: [],
			is_authorized
		}

		const {
			start_date,
			end_date
		} = validateDateNewApi({
			start_date: `${filters.start_date}T03:00:00`,
			end_date: `${filters.end_date}T23:59:59`
		})

		const params = {
			vehicle_id: filters.vehicle_id,
			imei,
			start_date,
			end_date,
			limit: filters.total,
			offset: 0,
			includes_trackings: false,
			real_time_trackings: false
		};

		const URL_ROUTE = '/api/v1/routes-reports'
		
		const {
			data: {
				report_routes,
			}
		} = await apiRoutes.get(URL_ROUTE, { params });

		const has_report_routes = Array.isArray(report_routes) && report_routes.length > 0;

		if(has_report_routes === false) return {
			new_report_routes: [],
			is_authorized
		}

		if(showAddress) {

			const {
				listAddresses = [],
			} = getRegistersByOffSet({ registers: report_routes });
	
			const address = await getAddress({ listAddress: listAddresses });
	
			const new_report_routes = report_routes.reduce((acc, route, index) => {
	
				const keyAcessAdressStart = `${route?.start_lat?.toFixed(3)},${route?.start_lng?.toFixed(3)}`;
				const keyAcessAdressEnd = `${route?.end_lat?.toFixed(3)},${route?.end_lng?.toFixed(3)}`;
				const address_start = address?.[keyAcessAdressStart]?.formattedAddress || localizedStrings.addressRouteNotFound;
				const address_end = address?.[keyAcessAdressEnd]?.formattedAddress|| localizedStrings.addressRouteNotFound;
	
				acc.push({
					...route,
					id: index,
					coords: {
						start_lat: route?.start_lat,
						start_lng: route?.start_lng,
						end_lat: route?.end_lat,
						end_lng: route?.end_lng,
					},
					real_date: route.start_date,
					time: route.time,
					date: route?.start_date,
					init: route?.start_date,
					end: route?.end_date,
					average_speed: route.average_speed,
					max_speed: route.max_speed,
					distance: route.distance,
					cost: route.cost,
					driver_name: route.driver_name,
					organization_id: route.organization_id,
					file_route_id: null,
					vehicle_id: route.vehicle_id,
					address_start,
					address_end,
				})
				
				return acc;
	
			}, []);
	
			return {
				new_report_routes,
				is_authorized
			}

		}

		const new_report_routes = report_routes.reduce((acc, route, index) => {
	
			const address_start = "";
			const address_end = "";

			acc.push({
				...route,
				id: index,
				coords: {
					start_lat: route?.start_lat,
					start_lng: route?.start_lng,
					end_lat: route?.end_lat,
					end_lng: route?.end_lng,
				},
				real_date: route.start_date,
				time: route.time,
				date: route?.start_date,
				init: route?.start_date,
				end: route?.end_date,
				average_speed: route.average_speed,
				max_speed: route.max_speed,
				distance: route.distance,
				cost: route.cost,
				driver_name: route.driver_name,
				organization_id: route.organization_id,
				file_route_id: null,
				vehicle_id: route.vehicle_id,
				address_start,
				address_end,
			})
			
			return acc;

		}, []);

		return {
			new_report_routes,
			is_authorized
		}
		
	} catch (error) {
		console.log(error)
		return {
			new_report_routes: []
		}
	}
}

const parseValues = (reg, distance_unit, thousandSeparator, decimalSeparator, dateFormat, currency) => {
	const time = formatTimeToCard(reg.time, "obj");

	let startDate =
		reg?.date && format(parseISO(reg.date), "dd/MM/yyyy");
	let cost = "";

	try {
		const dateMaskFromConfiguration = convertUserMaskToDateFns({
			mask: dateFormat,
		});

		startDate = format(
			parseISO(reg?.date, "dd/MM/yyyy", new Date()),
			dateMaskFromConfiguration
		);
	} catch (error) {
		console.debug(error);
	}

	try {
		const unit = populateSelects.currency.find(
			(money) => money.value === currency
		)?.unit;

		cost = formatCostToCard({
			money: reg.cost,
			thousandSeparator,
			decimalSeparator,
			unit,
		});
	} catch (error) {
		console.debug(error);
	}

	return {
		start_date: startDate,
		init:
			(reg?.date && format(parseISO(reg.date), "HH:mm")) ||
			"00:00",
		end:
			(reg?.end && format(parseISO(reg.end), "HH:mm")) ||
			"00:00",
		time:
			time?.h === undefined ? "00:00" : time.h + ":" + time.i,
		distance: formatDistanceToCard(
			reg.distance,
			0,
			distance_unit
		),
		cost,
		average_speed: formatSpeedToCard(
			reg.average_speed,
			2,
			distance_unit + "/h",
			0,
			true
		),
		max_speed: formatSpeedToCard(
			reg.max_speed,
			2,
			distance_unit + "/h",
			0,
			true
		),
		address_start: reg?.address_start || DEFAULT_NULL_VALUE,
		address_end: reg?.address_end || DEFAULT_NULL_VALUE,
		vehicle_name: reg?.vehicle_name || DEFAULT_NULL_VALUE,
		model: reg?.model || DEFAULT_NULL_VALUE,
		plate_number: reg?.plate_number || DEFAULT_NULL_VALUE,
		year_manufacturer: reg?.year_manufacturer || DEFAULT_NULL_VALUE,
		type_vehicle_name: reg?.type_vehicle_name || DEFAULT_NULL_VALUE,
	};
};

const getRouteReport = async ({
	filters,
}) => {
	try {

		const showAddress =
			!!filters?.columnsResponse &&
			filters?.columnsResponse?.includes("address_start") ||
			filters?.columnsResponse?.includes("address_end");

		const hasPeriod = !!filters.start_date && !!filters.end_date;

		if(hasPeriod === false) return [];

		const [
			{
				routes = [],
			},
			{
				new_report_routes = [],
				is_authorized = false,
			}
		] = await Promise.all([
			reportRoutesOldApi({
				filters,
				showAddress
			}),
			reportRoutesNewApi({
				filters,
				showAddress
		  })
		]);

		const {
			routes_period_removed = []
		} = removeOldApiReportsUntil({
			routes,
			is_authorized
		})
		
	  	const all_routes = [... routes_period_removed, ... new_report_routes].sort((a,b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
		
		const {
			distance_unit,
			thousand_separator: thousandSeparator,
			decimal_separator: decimalSeparator,
			short_date_format: dateFormat,
			currency,
		} = filters.user_settings;		
		
		const routes_formatted_by_user = all_routes.reduce((acc, reg) => {
			acc.push({
				...parseValues(reg, distance_unit, thousandSeparator, decimalSeparator, dateFormat, currency),
				driver_name:
					(!reg.driver_name &&
						localizedStrings.driverNotIdentified) ||
					reg.driver_name,
			})
			return acc;
		}, [])
		
		return routes_formatted_by_user;

	} catch (error) {
		console.log(error);
	}
};

export default getRouteReport;
