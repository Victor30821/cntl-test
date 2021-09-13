
import React, { memo } from "react";
import { Icon, Text, Link, Select } from 'components'
import { Changelogfy } from 'containers'
import { IconBarDivMain, IconBarDiv } from './style.js';
import { localizedStrings } from 'constants/localizedStrings';
import { useSelector } from 'react-redux';
import getLastPoints from '../../utils/requests/getLastPoints';
import { MAP } from 'constants/paths';
import {
    PLAY_STORE_APP_LINK,
    APPLE_STORE_APP_LINK,
    CHANGELOGFY_APP_ID,
    MAX_LIMIT_FOR_SELECTORS,
    manager
} from "constants/environment";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import Fuse from 'fuse.js'
const iconStyles = {
    padding: "9px 4px 9px 10px",
    display: "flex",
    justifyContent: "center",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    boxSizing: "border-box",
    borderRadius: "4px",
    boxShadow: "0px 1px 4px #00000010",
}

function HeaderIconBar({
    history,
    ...option
}) {
    const {
        user: { role_id, vehicles: vehiclesByUser }
    } = useSelector(state => state.auth);

    const [visibleVehicles, setVisibleVehicles] = React.useState([]);
    const [selectedVehicle, setSelectedVehicle] = React.useState({ value: 0, label: localizedStrings.searchVehicleOnMap });
    const [lastPoint ,setLastPoint] = React.useState([]);

    const goMap = async (vehicle) => {
        setSelectedVehicle(vehicle)
        const pointVehicle = lastPoint.find(point => point.vehicle_id === vehicle?.value);
        pointVehicle?.vehicle?.id && history.push(MAP, { vehicle: { vehicle_id: vehicle?.value, vehicle_name:vehicle?.label, pointVehicle } });
    }

    React.useEffect(() => {
        const init = async () => {
            try {
                const { lastPoints } = await getLastPoints({
                    vehicle_id: role_id !== manager && vehiclesByUser,
                    limit: MAX_LIMIT_FOR_SELECTORS
                });
                const validPoints = lastPoints.filter(point => point.lat);
                // eslint-disable-next-line
                setVisibleVehicles(role_id !== manager &&  validPoints.map(point => point.vehicle).filter(vehicle =>  vehiclesByUser.includes(vehicle.id)) || validPoints.map(point => point.vehicle));
                setLastPoint(validPoints);
            } catch (error) {
                console.log(error)
            }
        }
        init();
        // eslint-disable-next-line
    }, [])

    return (
        <IconBarDivMain >
            <IconBarDiv>
                <Link target="_blank" href={"https://exclusivo.contelerastreador.com.br/indique-e-ganhe-gv"}  title={localizedStrings.helperIndicate}>
                    <Icon divProps={iconStyles} icon={'gift'} width={'16px'} height={'16px'} color='#868E96' cursor="pointer" style={{ marginRight: "8px" }} />
                </Link>
                <Link target="_blank" rel="noopener noreferrer" href={"https://help.contelerastreador.com.br/"} title={localizedStrings.helperHelp}>
                    <Icon divProps={iconStyles} icon={'help'} width={'16px'} height={'16px'} color='#868E96' cursor="pointer" style={{ marginRight: "8px" }} />
                </Link>
                <Link target="_blank" rel="noopener noreferrer" href={"https://blog.contelerastreador.com.br/curso-contele-gestor"} title={localizedStrings.helperCertifications}>
                    <Icon divProps={iconStyles} icon={'courses'} width={'30px'} height={'16px'} color='#868E96' cursor="pointer" style={{ marginLeft: "-8px", marginRight: "4px" }} />
                </Link>
                <Link target="_blank" id={"changelogfy-widget"} rel="noopener noreferrer" title={localizedStrings.helperNew}>
                    <Icon divProps={iconStyles} icon={'feed'} width={'16px'} height={'16px'} color='#868E96' cursor="pointer" style={{ marginRight: "8px" }} />
                </Link>
                <Link target="_blank" rel="noopener noreferrer" href={"https://docs.google.com/forms/d/e/1FAIpQLSeVXR7mnADZChsZsPGuEBFQhib5ZOTSU7vPYtliw_q-o8R18g/viewform"} title={localizedStrings.registerYourIdea}>
                    <Icon useFontAwesome divProps={iconStyles} icon={faLightbulb} width={'16px'} height={'16px'} color='#868E96' cursor="pointer" style={{ marginRight: "8px" }} />
                </Link>
                <Changelogfy
                    app_id={CHANGELOGFY_APP_ID}
                    selector={"#changelogfy-widget"}
                />
            </IconBarDiv>
            <IconBarDiv>
                <Text fontWeight={"bold"}
                    fontSize={"13px"} lineHeight={"19px"}
                    color={"#858E95"} >{localizedStrings.downloadOurApp}
                </Text>
                <Link target="_blank" rel="noopener noreferrer" href={PLAY_STORE_APP_LINK} title={localizedStrings.googlePlay} >
                    <Icon divProps={{ ...iconStyles, padding: "9px 7px 9px 3px", marginLeft: "9px" }} icon={'playstore'} width={'16px'} height={'16px'} color='#1A237A' cursor="pointer" style={{ marginLeft: "8px" }} />
                </Link>
                <Link target="_blank" rel="noopener noreferrer" href={APPLE_STORE_APP_LINK} title={localizedStrings.appStore} >
                    <Icon divProps={{ ...iconStyles, padding: "9px 10px 9px 3px" }} icon={'apple'} width={'16px'} height={'16px'} color='#1A237A' cursor="pointer" style={{ marginLeft: "8px" }} />
                </Link>
            </IconBarDiv>
            <>
                <Select
                    style={{
                        minWidth: "200px",
                        marginRight: "10px"
                    }}
                    required={true}
                    placeholder={localizedStrings.searchVehicleOnMap}
                    title={false}
                    value={selectedVehicle}
                    options={visibleVehicles?.map(vehicle => {
                        return {
                            label: vehicle.name,
                            value: vehicle.id,
                            plate: vehicle.plate_number,
                            serial_number: vehicle.serial_number
                        }
                    }) || []}
                    onChange={(vehicle) => goMap(vehicle)}
                    filterOption={(option, inputValue) => {
                        const { data } = option;

                        if (!inputValue) return true

                        const fuse = new Fuse([data], {
                            keys: Object.keys(data), // keys to index
                            isCaseSensitive: false,
                            ignoreLocation: true, // ignore where the match is
                            shouldSort: true, // sort by highest score
                            threshold: 0.2, // 0 for a perfect match, 1 for any match
                            useExtendedSearch: true, // advanced search
                        })

                        return fuse.search(inputValue).some(({ item }) => item)
                    }}
                    emptyStateText={localizedStrings.noVehicleCreated}
                />
            </>
        </IconBarDivMain>
    )

}
export default memo(HeaderIconBar)


