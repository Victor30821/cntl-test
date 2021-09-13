import React from 'react';
import VehicleItem from './mapVehicleItem';
import VehicleDetails from './mapVehicleDetails';
import {
	ColorfulListStyle,
	NoVehicleFoundContainer,
	NoVehicleFoundTitle,
	NoVehicleFoundSubtitle,
	NoVehicleFoundImageContainer
} from './style.js';
import { useSelector } from "react-redux";
import "react-virtualized/styles.css";
import { List } from "react-virtualized";
import noVehicleFoundImage from 'assets/no-vehicle-found.svg';
import { localizedStrings } from 'constants/localizedStrings';

const height = window.outerHeight;

export default function MapVehicleList({
    vehicles = [],
    onVehicleClick,
    setSelectedGroups,
    ...options
}) {
    const adjustElementsScreen = () => {
        const width = window.outerWidth;
        const sizeScreen = (width < 1480 && 'first_monitor') || (width >= 1480 && 'second_monitor');
        const cssAdjusting = {
            'first_monitor': {
                rowHeight: 170
            },
            'second_monitor': {
                rowHeight: 150
            }
        }

        return cssAdjusting[sizeScreen];
    };

    const {
        showIndividualVehicle,
    } = useSelector(state => state.map);

    const {
        organization: { country }
    } = useSelector((state) => state.organization);

    return (
        <ColorfulListStyle {...options}>
            {
                showIndividualVehicle ?
                <VehicleDetails
                    setSelectedGroups={setSelectedGroups}
                /> : vehicles.length ?
                <List
                    width={515}
                    rowCount={vehicles.length}
                    height={(height - 250)}
                    rowHeight={adjustElementsScreen().rowHeight + 10}
                    style={{
                        padding: "0px",
                        width: "100%",
                        maxHeight:'98%',
                        flexDirection: 'row'
                    }}
                    rowRenderer={({
                        key, // Unique key within array of rows
                        index, // Index of row within collection
                        style, // Style object to be applied to row (to position it)
                    }) => (
                            <VehicleItem
                                country={country}
                                style={style}
                                onVehicleClick={onVehicleClick}
                                location={vehicles[index]}
                                key={key} />
                        )}
                /> :
				<NoVehicleFoundContainer>
					<NoVehicleFoundTitle>
						{localizedStrings.noResultsFound}
					</NoVehicleFoundTitle>
					<NoVehicleFoundSubtitle>
						{localizedStrings.checkVehicleNameOrDriverIsCorrect}
					</NoVehicleFoundSubtitle>
					<NoVehicleFoundImageContainer>
						<img src={noVehicleFoundImage} />
					</NoVehicleFoundImageContainer>
				</NoVehicleFoundContainer>
            }
        </ColorfulListStyle>
    );
}
