import React, { useEffect, useMemo } from 'react';
import { DetailsContainer, RouteDetailsWrapper, RouteDetails, RouteButtons, DataRow, ContainerVehicleName } from './style.js';
import { Text, IconsRow, Link, Icon } from 'components';
import { localizedStrings } from 'constants/localizedStrings.js';
import { useSelector } from "react-redux";
import { ButtonWithIcon, Button } from 'components/buttons';
import { format, parseISO } from 'date-fns';
import { formatCostToCard, formatSpeedToCard, formatDistanceToCard, formatTimeToCard } from 'helpers/ReportCardsCalc';
import { convertUserMaskToDateFns } from 'utils/convert.js';
import populateSelects from "constants/populateSelects";
import HelpIconWithTooltip from "./../helpIconWithTooltip";
import { faList, faMapSigns } from '@fortawesome/free-solid-svg-icons'
import { MAP, REPORT_ROUTES_DETAILED_PATH } from "constants/paths";
import { getUrlParam } from 'utils/params.js';

export default function MapRoutesDetails({
  reload,
  setShowBestRoute,
  setOnDetails,
  nextRoute,
  goBack,
  previousRoute,
  history,
  mapControlsVisible,
  setMapControlsVisible,
  setShowOsrmRoute = () => { },
  ...options
}) {
	
  const {
    user: {
      user_settings: {
        thousand_separator: thousandSeparator,
        decimal_separator: decimalSeparator,
        currency,
        short_date_format,
        short_time_format,
        distance_unit,
      }
    },
  } = useSelector(state => state.auth);

  const {
    last_positions = [],
    route = {},
  } = useSelector((state) => state.routesReports);

  const {
    vehicle_name,
    driver_name,
    start_date,
    end_date,
    total_distance,
    distance,
    total_cost,
    cost,
    time,
    average_speed,
    max_speed,
  } = route || {}

  const {
    previousBtnEnabled,
    nextBtnEnabled
  } = useMemo(() => {

	const current_index = +getUrlParam("current_index");
	
	const has_current_index = Number.isInteger(current_index);

	const routes_length = history.location.state?.reports_next_back?.length || 0;
	
	const has_routes_length = routes_length > 0;
	
	if(has_current_index && has_routes_length){

		const [
			previousButtonDisabled,
			nextButtonEnabled,
		] = [
			  Number.isInteger(current_index) && current_index - 1 >= 0,
			  Number.isInteger(routes_length) && current_index + 1 < routes_length
		];

		return {
			previousBtnEnabled: previousButtonDisabled,
			nextBtnEnabled: nextButtonEnabled,
		}
	}

	return {
		previousBtnEnabled: false,
		nextBtnEnabled: false,
	}

  }, [])


  const formattedCost = useMemo(() => {
    const value = total_cost || cost
    if (!value) return "";
    let costFormatted = ""
    try {
      const unit = populateSelects.currency.find(money => money.value === currency)?.unit;

      costFormatted = formatCostToCard({ money: value, thousandSeparator, decimalSeparator, unit });

    } catch (error) {
      costFormatted = value
    }
    return costFormatted;
  }, [
    total_cost,
    cost,
  ])

  const getDateWithUserDateMask = (date) => {
    if (!date) return "";
    let formattedDate = "";
    try {
      const dateMaskFromConfiguration = convertUserMaskToDateFns({ mask: short_date_format, timeMask: short_time_format });
      formattedDate = format(
        parseISO(
          date,
          "yyyy-MM-dd T hh:mm:ss",
          new Date()
        ),
        dateMaskFromConfiguration
      );
    } catch (error) {
      formattedDate = date
    }
    return formattedDate;
  }

  const {
    start_date: startDateWithUserMask,
    end_date: endDateWithUserMask
  } = useMemo(() => {
    const startDate = getDateWithUserDateMask(start_date)
    const endDate = getDateWithUserDateMask(end_date)

    return {
      start_date: startDate,
      end_date: endDate
    }
  }, [
    start_date,
    end_date
  ])

  const showDetails = () => {
    setOnDetails(({ on }) => ({ on: !on, routes: last_positions }));
  };

	useEffect(() => {
		if (route.onGoing) {
			setOnDetails({ on: true, routes: last_positions });
		}
	}, [route]);

  const showOsrmRoute = () => setShowOsrmRoute(showOsrmRoute => showOsrmRoute = !showOsrmRoute);
  const showBestRoute = () => setShowBestRoute(showBestRoute => showBestRoute = !showBestRoute);

  return (
		<DetailsContainer>
			<RouteDetailsWrapper {...options}>
				<ContainerVehicleName
					title={localizedStrings.routeOnGoing}
					className={route.onGoing ? 'animated-live' : ''}>
					<Text
						fontWeight="bold"
						fontSize="19px"
						as={"span"}
						whiteSpace="nowrap"
						width="145px"
						paddingTop="10px"
						overflow="hidden"
						textOverflow="ellipsis"
						marginLeft={
							route.onGoing ? "30px" : "0px"
						}
						title={vehicle_name}
					>
						{vehicle_name}
					</Text>
					<Button
						title={localizedStrings.close}
						onClick={() => goBack(false)}
						width="auto"
						customBackgrounddivor={"transparent"}
						background={"transparent ! important"}
						border={"1px solid #FD3939"}
						maxHeight="30px"
						style={{ display: "flex" }}
						position={"relative"}
						textConfig={{
							color: "#FD3939",
							whiteSpace: "none",
							fontSize: "16px",
						}}
					/>
				</ContainerVehicleName>
				{
					(previousBtnEnabled || nextBtnEnabled) &&
				<RouteButtons>
					<ButtonWithIcon
						title={localizedStrings.next}
						icon={"left"}
						marginRight={"12px"}
						customBackgroundColor={"#fff"}
						customIconColor={"#1A237A"}
						onClick={previousRoute}
						border={
							previousBtnEnabled ? "1px solid #1A237A" : "1px solid #1A237A70"
						}
						minWidth={"auto"}
						disabled={!previousBtnEnabled}
						textOptions={{
							fontSize: "15px",
							margin: "0 0 0 10px",
							whiteSpace: "none",
							color: "#1A237A",
						}}
					/>
					<ButtonWithIcon
						title={localizedStrings.previous}
						icon={"right"}
						customBackgroundColor={"#fff"}
						customIconColor={"#1A237A"}
						onClick={nextRoute}
						border={
							nextBtnEnabled ? "1px solid #1A237A" : "1px solid #1A237A70"
						}
						width="auto"
						disabled={!nextBtnEnabled}
						minWidth={"auto"}
						textOptions={{
							fontSize: "15px",
							margin: "0 0 0 10px",
							whiteSpace: "none",
							color: "#1A237A",
						}}
					/>
				</RouteButtons>
				}
				<RouteDetails>
					<DataRow>
						<Text
							font-weight="bold"
							font-size="19px"
							line-height="19px"
							margin={"5px 0 10px 0px"}
							display={"flex"}
						>
							{localizedStrings.driver}:
							</Text>
						{driver_name?.length > 0 ?
							driver_name
							:
							<div style={{ display: 'flex' }}>
								<Icon
									icon={"driver"}
									width={"16px"}
									height={"16px"}
									color="#1A237A"
								/>
								{localizedStrings.driverNotIdentified}
							</div>
						}
						<Text
							font-weight="bold"
							font-size="19px"
							line-height="19px"
							margin={"5px 0 10px 0px"}
							display={"flex"}
						>
							{localizedStrings.startDate}:
							</Text>
						{(start_date) &&
							" " + startDateWithUserMask}
						<Text
							font-weight="bold"
							font-size="19px"
							line-height="19px"
							margin={"5px 0 10px 0px"}
						>
							{localizedStrings.endDate}:
							</Text>
						<div style={{
							display: "flex",
							flexDirection: "row"
						}}>
						{(end_date) &&
							" " + endDateWithUserMask}
							{
								route.onGoing &&
								<HelpIconWithTooltip
									text={[
										localizedStrings.vehicleIsOnRoute
									]}
								/>
							}
						</div>
					</DataRow>
					<DataRow>
						<Text>
							<Text as={"span"}>{localizedStrings.totalDistance + ":"}</Text>
							{formatDistanceToCard(
								total_distance || distance,
								0,
								distance_unit
							)}
						</Text>
						<Text>
							<Text as={"span"} style={{ display: "flex" }}>
								{localizedStrings.totalCost + ":"}
								<HelpIconWithTooltip
									text={[
										localizedStrings.tooltipHelpTexts.drivers.routesTotalCost.text,
										<Link
											href={
												localizedStrings.tooltipHelpTexts.drivers.routesTotalCost.link
											}
											target={"_blank"}
										>
											{" "}
											{
												localizedStrings.learnMore
											}
										</Link>,
									]}
								/>
							</Text>
							{formattedCost}
						</Text>
						{time !== null && time !== undefined && (
							<Text>
								<Text as={"span"}>{localizedStrings.totalDuration + ":"}</Text>
								{formatTimeToCard(time, "h:i")}
							</Text>
						)}
						<Text>
							<Text as={"span"}>{localizedStrings.averageSpeed + ":"}</Text>
							{formatSpeedToCard(
								average_speed,
								2,
								distance_unit + "/h",
								0,
								true
							)}
						</Text>
						<Text>
							<Text as={"span"}>{localizedStrings.maxSpeed + ":"}</Text>
							{formatSpeedToCard(
								max_speed,
								0,
								distance_unit + "/h",
								0,
								true
							)}
						</Text>
					</DataRow>
				</RouteDetails>
				<IconsRow
					width="100%"
					show={mapControlsVisible}
					onMouseEnter={() => setMapControlsVisible(true)}
					icons={[
						{
							icon: "route",
							text: localizedStrings.bestRoute,
							onClick: () => showBestRoute(),
						},
						!route.onGoing &&
						{
							icon: "location",

							text: localizedStrings.showDetails,
							onClick: () => showDetails(),
						},
						{
							useFontAwesome: true,
							icon: faList,
							text: localizedStrings.seeReport,
							onClick: () => history.push(REPORT_ROUTES_DETAILED_PATH + '?returnTo=' + getUrlParam('returnTo'), {
							route
							}),
						},
						route.onGoing &&
						{
							icon: "reload",
							text: localizedStrings.update,
							onClick: () => reload(),
						},
						route.onGoing &&
						{
							icon: "map_pointer",
							text: localizedStrings.showOnMap,
							onClick: () => history.push(MAP + "?vehicle_id=" + getUrlParam("vehicle_id")),
						},
						// TODO: remove url param
						getUrlParam("rota") && {
							useFontAwesome: true,
							icon: faMapSigns,
							text: localizedStrings.ocrmRoute,
							onClick: () => showOsrmRoute(),
						}
					].filter(Boolean)}
				/>
			</RouteDetailsWrapper>
		</DetailsContainer>
	);
}
