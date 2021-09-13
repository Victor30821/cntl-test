import React, { useEffect, useState } from 'react';
import { Card, CardTitle, CardForm, CardInput, Select, Col, Checkbox } from 'components'
import { useDispatch, useSelector } from 'react-redux';
import { localizedStrings } from 'constants/localizedStrings'

import { loadVehicles } from 'store/modules'
import { MAX_LIMIT_FOR_SELECTORS } from 'constants/environment';
export default function GroupForm({ title, onSubmit, inputsConfig, formId, selectedVehicles, setSelectedVehicles, isAllVehiclesSelected }) {
    const dispatch = useDispatch();
    const [visibleVehicles, setVisibleVehicles] = useState([]);
    const {
        user: { organization_id }
     } = useSelector(state => state.auth);
    const {
        vehicles,
        loadLoading,
        loadFail
    } = useSelector(state => state.vehicles);
    const loadOrganizationVehicles = () => {
        dispatch(loadVehicles({
            organization_id,
            limit: MAX_LIMIT_FOR_SELECTORS,
        }))
    }
    const [checkbox, setCheckbox] = useState(isAllVehiclesSelected);

    const toggleCheckbox = (isChecked) => {
        setCheckbox(isChecked);
        if(isChecked) {
            setSelectDisabled(true);
            setSelectedVehicles([
                {
                    label: localizedStrings.allVehicles,
                    value: "all",
                },
            ]);
        }

        const has_selected_vehicles = 
        Array.isArray(selectedVehicles) &&
        selectedVehicles?.length > 0;

        if(has_selected_vehicles) {
            const [select_vehicle={}] = selectedVehicles;
            const is_value_all = select_vehicle?.value === "all";
            if(is_value_all) {
                setSelectDisabled(false);
                setSelectedVehicles([]);
            }
        }
    }

    useEffect(() => {
        loadOrganizationVehicles();
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        setVisibleVehicles(vehicles)
    }, [vehicles])

    const [selectedDisabled, setSelectDisabled] = useState(false);
    useEffect(() => setSelectDisabled(isAllVehiclesSelected), [isAllVehiclesSelected])
    useEffect(() => setCheckbox(isAllVehiclesSelected), [isAllVehiclesSelected])

    return (
        <Card >
            <CardTitle color={"#333"} fontWeight={"bold"} fontSize={"14px"} >
                {title}
            </CardTitle>
            <CardForm id={formId} onSubmit={onSubmit} flexDirection="row" display="flex" style={{ justifyContent: 'space-between' }}>
                <Col md="4" className="md-6" style={{ marginBottom: '0px' }}>
                    <CardInput
                        width={'100%'}
                        height={'100%'}
                        onChange={inputsConfig.onChange}
                        register={inputsConfig.register}
                        inputs={inputsConfig.inputs}
                        justifyContent="center"
                        style={{ justifyContent: "flex-start", margin: 0 }}
                        half />
                </Col>
                <Col md="4" className="md-6" style={{ marginBottom: '0px', flex: 1 }}>
                    <Select
                        style={{
                            minWidth: "200px",
                            marginRight: "10px"
                        }}
                        isMulti
                        error={loadFail}
                        loading={loadLoading}
                        title={localizedStrings.selectAVehicle}
                        required={true}
                        placeholder={localizedStrings.selectAVehicle}
                        value={selectedVehicles}
                        options={visibleVehicles?.map(vehicle => {
                            return {
                                label: vehicle.name,
                                value: vehicle.id
                            }
                        }) || []}
                        onChange={setSelectedVehicles}
                        emptyStateText={localizedStrings.noVehicleCreated}
                        disabled={selectedDisabled}
                        closeMenuOnSelect={false}
                    />
                </Col>
                <Col md="4" style={{ marginTop: '25px', flex: 1 }}>
                    <Checkbox
                    title={localizedStrings.allVehicles}
                    disabled={loadLoading || loadFail}
                    onChange={toggleCheckbox}
                    checked={checkbox}
                    />
                </Col>
            </CardForm>
        </Card>
    );
}
