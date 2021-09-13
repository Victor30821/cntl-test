import React, { useState } from "react";
import { MapControlsStyle } from "../style";
import { ErrorBoundary, Icon, MapRoutesDetails } from 'components';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUrlParam } from "utils/params";
import { toast } from "react-toastify";
import { localizedStrings } from "constants/localizedStrings";
import { RouteOnGoingContainer, RouteOnGoingTextDiv, RouteOnGoingTooltip } from './style.js';
import RouteOnGoingTooltipImg from 'assets/route_on_going_tooltip_img.svg';

export default function MapControls({
    reload = () => { },
    setShowBestRoute,
    setOnDetails,
    mapControlsVisible,
    setMapControlsVisible,
    changeRoute = () => { },
    setShowOsrmRoute = () => { },
}) {
    const [showOngoingTooltip, setShowOngoingTooltip] = useState(true);

    const history = useHistory()

	
	const {
		route = {},
	} = useSelector((state) => state.routesReports);

    const nextRoute = () => {
        changeRoute(1);
        setOnDetails({on: false, routes: []});
    }
    const previousRoute = () => {
        changeRoute(-1);
        setOnDetails({on: false, routes: []});
    }
    const goBack = () => {
        const returnTo = getUrlParam("returnTo")
        history.push(atob(returnTo));
    };

    return (
        <>
			<MapControlsStyle style={{width: "320px"}} display="flex" >
				<ErrorBoundary
					onError={() => {
						toast.error(localizedStrings.errorWhenLoadingRoute);
						goBack();
					}}
				>
				<MapRoutesDetails
						goBack={goBack}
						reload={reload}
					setShowBestRoute={setShowBestRoute}
					setOnDetails={setOnDetails}
					history={history}
					mapControlsVisible={mapControlsVisible}
					setMapControlsVisible={setMapControlsVisible}
					onMouseEnter={() => setMapControlsVisible(true)} show={mapControlsVisible}
					nextRoute={nextRoute}
					previousRoute={previousRoute}
					setShowOsrmRoute={setShowOsrmRoute}
				/>
				</ErrorBoundary>
			</MapControlsStyle>
			{route.onGoing && (
				<RouteOnGoingContainer onClick={() => setShowOngoingTooltip((state) => !state)}>
					<RouteOnGoingTextDiv>
						<Icon icon='ongoing-marker' width={'16px'} height={'16px'} />
						<p>{localizedStrings.thisRouteIsOnGoing}</p>
					</RouteOnGoingTextDiv>
					<RouteOnGoingTooltip showOngoingTooltip={showOngoingTooltip}>
						<img src={RouteOnGoingTooltipImg} alt={localizedStrings.thisRouteIsOnGoing} />
						<p>{localizedStrings.routeOnGoing} <br /><span>{localizedStrings.mayContainRetainedPoints}</span></p>
					</RouteOnGoingTooltip>
				</RouteOnGoingContainer>
			)}
        </>
    );
}
