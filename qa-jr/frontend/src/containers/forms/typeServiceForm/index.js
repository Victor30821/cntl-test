import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { logisticsChangeSelected, createTypeService } from "store/modules";
import {  Select, Col, BottomActionButtons, CardInput, Text } from "components";
import { ServiceTypeCreation } from './style';
import { useForm } from "react-hook-form";

export default function TypeServiceForm({ onCancel }) {
    
  const dispatch = useDispatch();

  const {
    selectors,
    selected,
    loading_type_service
  } = useSelector(state => state.logisticsServices);

  const {
    loadLoadingTypeService,
    loadSucessTypeService
  } = loading_type_service;

  const { register, setValue, getValues } = useForm({
    defaultValues: {
        name: "",
    }
});

  const [modalErrors, setModalErrors] = useState({ errors_modal: {
    type_service_name: {
      has_error: false,
      message: "",
    },
    idle_time: {
      has_error: false,
      message: "",
    },
  } });

  const {
    errors_modal
  } = modalErrors;

  const {
    overview_selectors: {
      selector_wating_time,
    }
  } = selectors;

  const {
    overview_selected: {
      type_service_selected_modal
    },
  } = selected;

  const {
    user: {
      organization_id
    }
  } = useSelector(state => state.auth);

  useEffect(() => {
    errors_modal.type_service_name.has_error = false;
    errors_modal.type_service_name.message = ""
    errors_modal.idle_time.has_error = false;
    errors_modal.idle_time.message = ""
    setModalErrors({ errors_modal });
    dispatch(logisticsChangeSelected({
      selected: { overview_selected: { ...selected.overview_selected, type_service_selected_modal: {}, } }
    }))
    setValue("");
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(loadSucessTypeService) onCancel();
  // eslint-disable-next-line
  }, [loadSucessTypeService]);

  const onConfirmCreateTypeService = () => {
    const { name } = getValues();
    errors_modal.type_service_name.has_error = false;
    errors_modal.idle_time.has_error = false;
    setModalErrors({ errors_modal });
    const hasName = !!name && name.length > 0;
    const hasIdleTime = !!type_service_selected_modal.value && type_service_selected_modal?.value > 0;
    if(hasName === false) {
      errors_modal.type_service_name.has_error = true;
      errors_modal.type_service_name.message = localizedStrings.fieldRequired;
      setModalErrors({ errors_modal });
    }
    if(hasIdleTime === false) {
      errors_modal.idle_time.has_error = true;
      errors_modal.idle_time.message = localizedStrings.fieldRequired;
      setModalErrors({ errors_modal });
    }
    if(hasName && hasIdleTime) {
      errors_modal.idle_time.has_error = false;
      errors_modal.type_service_name.has_error = false;
      setModalErrors({ errors_modal });
      dispatch(createTypeService({ name: name, idle_time: type_service_selected_modal.value, organization_id }));
    }
  }

    return (
      <ServiceTypeCreation>
          <Row>
            <Col xl="12" md="12" style={{paddingLeft: "0px"}}>
               <Text fontFamily={"Roboto"} fontSize={"13px"} lineHeight={"18px"} color={"#666"} fontWeight={"bold"}>
               { localizedStrings.logisticService.service_create.addTypeService }
              </Text>
              <hr width={"126%"} style={{marginLeft: '-40px',}} />
            </Col>
          </Row>
          <Row>
            <Col xl="12" md="12" style={{marginBottom:"24px"}}>
              <CardInput
              register={register}
              onChange={setValue}
              style={{margin: "0px"}}
              inputs={[
                {
                  label: localizedStrings.logisticService.service_create.typeServiceName,
                  name: "name",
                  type: "text",
                  maxLength: 100,
                  required: true,
                  placeholder: localizedStrings.logisticService.service_create.typeServiceNamePlaceholder,
                  error: errors_modal.type_service_name.has_error,
                  errorText: errors_modal.type_service_name.message,
                }
              ]}
            />
            </Col>
            </Row>
          <Row>
          <Col xl="12" md="12">
            <Select
            title={localizedStrings.logisticService.service_create.timeDepartureReturn}
            required={true}
            options={selector_wating_time}
            placeholder={localizedStrings.logisticService.service_create.timeDepartureReturnPlaceholder}
            onChange={(item) => {
              dispatch(logisticsChangeSelected({
                selected: { overview_selected: { ...selected.overview_selected, type_service_selected_modal: item, } }
              }))
            }}
            value={type_service_selected_modal || {}}
            error={errors_modal.idle_time.has_error}
            errorText={errors_modal.idle_time.message}
          />
            </Col>
          </Row>
          <BottomActionButtons
              loading={loadLoadingTypeService}
              saveText={localizedStrings.add}
              onCancel={onCancel}
              onSave={onConfirmCreateTypeService}
          />
      </ServiceTypeCreation>
  );
}