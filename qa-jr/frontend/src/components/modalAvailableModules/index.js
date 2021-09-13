import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Loading, Text } from 'components';
import { FilterInput } from 'components/inputs';
import { localizedStrings } from 'constants/localizedStrings';
import { VirtualizedTable } from 'containers';
import { useDispatch, useSelector } from 'react-redux'
import { loadTrackers } from 'store/modules';
import { MAX_LIMIT_FOR_SELECTORS } from 'constants/environment';
const height = window.outerHeight
function ModalAvailableModules({
    onModuleClick,
    MySwal,
    divOptions = {},
}) {
    const dispatch = useDispatch();
    const inputTimeout = useRef(null)
    const [filterText, searchTerm] = useState("")

    const tableColumns = [
        { active: true, key: "serial_number", label: localizedStrings.module, type: "text" },
        { active: true, key: "organization_name", label: localizedStrings.currentOrg, type: "text" },
    ];

    const onFilterInputChange = (nameToFilter = false) => {
        nameToFilter = nameToFilter ? nameToFilter.toLowerCase() : "";
        inputTimeout != null && inputTimeout.current && clearTimeout(inputTimeout.current);
        inputTimeout.current = setTimeout(() => {
            if (nameToFilter === filterText) return;
            searchTerm(nameToFilter || "");
        }, 1000);
    }


    const {
        trackers = [],
        loadLoading,
    } = useSelector(state => state.trackers);

    useEffect(() => {
        const {
            organizations = []
        } = JSON.parse(window.localStorage.getItem("@associated_organization")) || { organizations: [] };

        const organization_ids = organizations.map(organization => organization.id);

        dispatch(loadTrackers({
            limit: MAX_LIMIT_FOR_SELECTORS,
            organization_id: organization_ids,
            status: 1
        }))
    }, []);

    const modulesWithoutVehicles = useMemo(() => trackers.filter(tracker => tracker.vehicle_id === null), [trackers])


    return (
        <div {...divOptions}>
            <Text
                fontFamily="Roboto"
                fontStyle="normal"
                fontWeight="bold"
                fontSize="28px"
                lineHeight="26px"
                textAlign="left"
                letterSpacing="0.1px"
                color="#505050"
                padding="16px 16px 8px"
            >
                {localizedStrings.moduleValidation}
				</Text>
            <Text
                fontFamily="Roboto"
                fontStyle="normal"
                fontWeight="normal"
                fontSize="14px"
                lineHeight="22px"
                letterSpacing="0.1px"
                color="#505050"
                textAlign="left"
                marginLeft="20px"
                whiteSpace="normal"
            >
                {localizedStrings.moduleAvaliableDescription}
				</Text>
            {
                !loadLoading &&
                <FilterInput
                    margin={'0px'}
                    width={'100%'}
                    height={'100%'}
                    defaultValue={filterText}
                    padding="20px 20px 0"
                    hasHelpText={false}
                    onChange={onFilterInputChange} />
            }
            {
                loadLoading
                    ? <Loading />
                    : <VirtualizedTable
                        name={'trackers_available'}
                        style={{ marginTop: "14px" }}
                        data={modulesWithoutVehicles}
                        onRowClick={onModuleClick}
                        columns={tableColumns}
                        showSelectColumns={false}
                        tableHeight={height * 0.6}
                        filterLocally
                        filterText={filterText}
                    />
            }
        </div>
    )
}

export default ModalAvailableModules
