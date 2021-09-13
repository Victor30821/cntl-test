
import React, { memo, useState } from "react";
import { Icon, Text } from 'components';
import { 
    faChevronRight, 
    faCloudUploadAlt,
    faRoad,
    faCalendarAlt,
    faClock,
    faTachometerAlt,
    faUser,
    faSortNumericUp
} from '@fortawesome/free-solid-svg-icons';
import { 
    VehicleListLineContainer,
    VehicleListLineIconList,
    VehicleListLineIcon
} from './style.js';
import { localizedStrings } from "constants/localizedStrings";
import { VEHICLES_EDIT_PATH } from "constants/paths.js";

function VehiclesListLine({
    history,
    data,
    ...option
}) {
    const DISABLE_GRAY = "#BBBBBB";
    const CONTELE_BLUE = "#1D1B84";

    const vehicleInformation = {
        vehicleId: data?.vehicleId || 0,
        vehicleName: data?.vehicleName || "",
        hasOdometer: data?.hasOdometer,
        hasDriver: data?.hasDriver,
        hasSpeedEvent: data?.hasSpeedEvent,
        hasIdleEvent: data?.hasIdleEvent,
        hasSchedule: data?.hasSchedule,
        hasKmEvent: data?.hasKmEvent,
        hasDocs: data?.hasDocs,
    };

    const iconsList = [
        {
            icon: faSortNumericUp,
            text: localizedStrings.odometer,
            checked: vehicleInformation.hasOdometer,
        },
        {
            icon: faUser,
            text: localizedStrings.driver,
            checked: vehicleInformation.hasDriver,
        },
        {
            icon: faTachometerAlt,
            text: localizedStrings.maxSpeedShort,
            checked: vehicleInformation.hasSpeedEvent,
        },
        {
            icon: faClock,
            text: localizedStrings.motor,
            checked: vehicleInformation.hasIdleEvent,
        },
        {
            icon: faCalendarAlt,
            text: localizedStrings.reportsExport.fullHour,
            checked: vehicleInformation.hasSchedule,
        },
        {
            icon: faRoad,
            text: localizedStrings.reachedKM,
            checked: vehicleInformation.hasKmEvent,
        },
        {
            icon: faCloudUploadAlt,
            text: localizedStrings.document,
            checked: vehicleInformation.hasDocs,
        },
        {
            icon: faChevronRight, 
            checked: true
        }, 
    ];

    const iconColor = (checked) => {
        return(checked ? CONTELE_BLUE : DISABLE_GRAY);
    }

    const handleVehicle = () => {
        history.push(`${VEHICLES_EDIT_PATH}?vehicle_id=${vehicleInformation.vehicleId}`);
    }

    return (
        <VehicleListLineContainer 
            onClick={handleVehicle}
            style={option.style}
        >
            <Text style={{
                fontSize: '16px',
                lineHeight: '20px',
            }}>
                {vehicleInformation.vehicleName}
            </Text>
            <VehicleListLineIconList>
                {iconsList.map((icon, index) => (
                    <VehicleListLineIcon key={index}>
                        <Icon
                            useFontAwesome
                            icon={icon?.icon} 
                            width={'14px'} 
                            height={'14px'} 
                            color={iconColor(icon?.checked)}
                            style={{ marginRight: '8px' }}
                        />
                        {icon?.text &&
                            <Text style={{
                                fontSize: '12px',
                                lineHeight: '14px',
                                color: iconColor(icon?.checked),
                                marginRight: '26px'
                            }}>
                                {icon?.text}
                            </Text>
                        }
                    </VehicleListLineIcon>
                ))}
            </VehicleListLineIconList>
        </VehicleListLineContainer>
    )
}

export default memo(VehiclesListLine);