
import React, { memo, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Link, Select } from 'components'
import { Changelogfy } from 'containers'
import { IconMapBarDivMain, IconMapBarDiv, IconMapBarArrowController, IconMapBarContainer, IconMapBarDivContent } from './style.js';
import { localizedStrings } from 'constants/localizedStrings';
import { setUrlParam } from 'utils/params';
import { faChevronLeft, faChevronRight, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import {
    setRoute,
    changeMapConfiguration,
    setVehicle,
    loadMapVehicles,
    loadGroups,
} from 'store/modules'
import {
    CHANGELOGFY_APP_ID,
} from "constants/environment";

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

function HeaderIconMapBar({
    history,
	menuIsVisible,
	setMenuIsVisible,
    ...option
}) {
    const dispatch = useDispatch();

    const [visibleGroups, setVisibleGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');

    const { filters } = useSelector((states) => states.map);

    const {
        user: {
          role_id,
          userVehicles: allowedVehiclesIds,
          organization_id
        },
    } = useSelector((state) => state.auth);

    const {
        groups,
        loadLoading
    } = useSelector((state) => state.groups);

    const handleVisibleMenu = (initialState = false) => {
        const generalStorage = window.localStorage.getItem("general");
        const general = generalStorage ? JSON.parse(generalStorage) : null;
        if(initialState === true){
            const initialX = (general === null || general?.mapHeaderBarVisible === true);
            setMenuIsVisible(initialX);
            return
        }
        setMenuIsVisible(!menuIsVisible);
        const headerBar = {
            mapHeaderBarVisible: !menuIsVisible
        };
        window.localStorage.setItem("general", JSON.stringify({ ...general, ...headerBar }));
    };

    const goToSelectedGroup = (group) => {
        const groupValue = group.value || '';

        handleVisibleMenu();

        setSelectedGroup(groupValue ? group : groupOptions[0]);
        groupValue ? setUrlParam("groups", groupValue) : setUrlParam("groups");
        setUrlParam("vehicle_id");
        setUrlParam("status")
        dispatch(
          changeMapConfiguration({
            showIndividualVehicle: false,
            filters: {
              ...filters,
              groups: groupValue,
            },
          })
        );
        dispatch(setRoute({}));
        dispatch(setVehicle({}));
        dispatch(loadMapVehicles({
          role_id,
          organization_id,
          limit: true,
          vehicle_id: allowedVehiclesIds
      }))
    };

    const loadOrganizationGroups = () => {
        dispatch(loadGroups({
            organization_id,
            entity: "vehicle"
        }))
    };

    const groupOptions = useMemo(() => {
        const groupsList = [{
            label: localizedStrings.allGroups,
            value: '',
        }];

        visibleGroups.forEach(group => {
            const groupOption = {
                label: group.tagName || '',
                value: group.tagName || '',
            }
            groupsList.push(groupOption);
        });

        return groupsList;
    }, [visibleGroups]);

    useEffect(() => {
        handleVisibleMenu(true);
        loadOrganizationGroups();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(!loadLoading && Array.isArray(groups) && groups?.length > 0){
            setVisibleGroups(groups);
        }
    // eslint-disable-next-line
    }, [groups]);

    return (
        <IconMapBarContainer active={menuIsVisible}>
            <IconMapBarArrowController
                onClick={handleVisibleMenu}
            >
                <Icon
                    useFontAwesome
                    icon={menuIsVisible ? faChevronRight : faChevronLeft}
                    width={'20px'}
                    height={'20px'}
                    color='#1D1B84'
                />
            </IconMapBarArrowController >
            <IconMapBarDivMain >
                <IconMapBarDivContent >
                    <IconMapBarDiv >
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
                    </IconMapBarDiv>
                    <>
                        <Select
                            style={{
                                minWidth: "200px",
                                marginRight: "10px",
                                marginLeft: "10px",
                            }}
                            required={true}
                            placeholder={localizedStrings.selectAGroup}
                            title={false}
                            value={selectedGroup}
                            options={groupOptions}
                            onChange={(group) => goToSelectedGroup(group)}
                            emptyStateText={localizedStrings.noGroupCreated}
                        />
                    </>
                </IconMapBarDivContent>
            </IconMapBarDivMain>
        </IconMapBarContainer>
    )

}
export default memo(HeaderIconMapBar);
