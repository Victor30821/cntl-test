import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import {
  Col,
  BottomActionButtons,
  CardInput,
  Text,
  DateInput,
  Icon,
  
} from "components";
import { ExceptionCreation } from "./style";
import {
  searchZipCodeException,
  searchAddress,
  setServicePlace,
} from "store/modules";
import { isWithinInterval, startOfDay, endOfDay, format, parseISO } from "date-fns";
import { toast } from 'react-toastify';
import { utcToZonedTime } from "date-fns-tz";



export default function ExceptionForm({
  onCancel,
  stopPlaceException,
  exceptionEdit,
  exceptionToEdit,
  inputsConfig,
}) {
  
  const dispatch = useDispatch();

  const [originalException, setOriginalException] = useState("")

  const {
    selected,
    loading_exception,
    loading_exception_zipcode,
    place_exception,
    services_places,
  } = useSelector((state) => state.logisticsServices);

  const {
    user: {
        user_settings
    }
  } = useSelector(state => state.auth);

  const {
    overview_selected:{
      start_date_selected,
      end_date_selected
    }
  } = selected;

  const [period, setPeriod] = useState({
    start_date: start_date_selected ? new Date(start_date_selected) : new Date(),
    end_date: end_date_selected ? new Date(end_date_selected) : new Date(),
  });

  const { 
    stop_places: {
      exception_day_selected
    }
  } = selected;

  const { loadLoadingFromException } = useSelector((state) => state.map);
 
  const {
    loadSucessException,
  } = loading_exception;

  const {
    loadLoadingZipCodeException,
  } = loading_exception_zipcode;

  const zipcodeInputRef = useRef(null);

  const [modalErrors, setModalErrors] = useState({
    errors_modal: {
      period_exception: {
        has_error: false,
        message: "",
      },
      address1: {
        has_error: false,
        message: "",
      },
      address2: {
        has_error: false,
        message: "",
      },
      number: {
        has_error: false,
        message: "",
      },
      city: {
        has_error: false,
        message: "",
      },
    },
  });

  const { errors_modal } = modalErrors;

  useEffect(() => {
    if (loadSucessException) onCancel();
    // eslint-disable-next-line
  }, [loadSucessException]);

  const onZipcodeChange = (value) => {
    zipcodeInputRef?.current && clearTimeout(zipcodeInputRef?.current);

    zipcodeInputRef.current = setTimeout(() => {
      const hasCompletedZipcode =
        value?.length === localizedStrings.zipcodeMask.length;

      if (!hasCompletedZipcode) return;

      dispatch(
        searchZipCodeException({
          zipCode: value,
        })
      );
    }, 1000);
  };
  const setErrors = ({ property, value }) => {
    const has_property = property !== undefined;
    if (has_property === false) return;
    errors_modal[property].has_error = value;
    errors_modal[property].message = "";
    if (value) errors_modal[property].message = localizedStrings.fieldRequired;
    setModalErrors({ errors_modal });
  };

  const verifyErrors = ({
    setInputErrors = true
  }) => {
    const inputsValues = inputsConfig.getValues();

    const errors = ["address1", "address2", "number", "city"].map(property => {      
      const has_value = inputsValues?.[property]?.length > 0;

      if (!has_value) {  
        if (setInputErrors) setErrors({ property, value: true });
        return true
      }

      setErrors({ property, value: false });

      return false
    });

    const hasErrors = errors.some(Boolean);

    return !!hasErrors;
  }

  const onConfirmCreateException = async () => {
    const hasErrors = verifyErrors({});

    if (hasErrors) return;

    const {
      address1,
      number,
      neighborhood,
      city,
    } = inputsConfig?.getValues() || {};

    const validAddress = await dispatch(
      searchAddress({
        text: [
          address1,
          number,
          neighborhood,
          city,
        ].join(", "),
        fromException: true
      })
    );

    const thereIsValidAddresses = validAddress.addresses.length > 0;

    if(!thereIsValidAddresses) toast.error(localizedStrings.addressRouteNotFound);

    if(thereIsValidAddresses) {
      const has_addresses = validAddress?.addresses?.length > 0;
  
      const has_errors = verifyErrors({ setInputErrors: false, });
  
      if (has_addresses && !has_errors) {
  
        const [address = {}] = validAddress?.addresses;
  
        const values = inputsConfig.getValues() || {};
  
        saveSearchedAddress({
          zipcode: address?.zipcode || values?.zipcode,
          address1: address?.streetName,
          neighborhood: address?.extra?.neighborhood,
          city: address?.city,
          address2: values?.address2,
          number: values?.number,
          state: address?.state,
          lat: address.latitude,
          lng: address.longitude
        })
      }
    }
  };

  const setAddressSettings = () => {
    ["address1", "neighborhood", "city", "state"].forEach((propertys) => {
      inputsConfig.setValue(propertys, place_exception[propertys]);
    });
  };

  const searchLatLngFromAddress = () => {
    try {
      const { address1: address, city, neighborhood, state } = place_exception;

      dispatch(
        searchAddress({
          text: [address, neighborhood, city, state].join(", "),
        })
      );
    } catch (error) { }
  };

  useEffect(() => {
    setAddressSettings();

    searchLatLngFromAddress();
    // eslint-disable-next-line
  }, [place_exception]);
  const filterByPlaceException = service_place => service_place && (+service_place?.id === +stopPlaceException?.index);

  const saveSearchedAddress = ({
    zipcode,
    address1,
    neighborhood,
    city,
    address2,
    number,
    state,
    lat,
    lng,
  }) => {

    const has_start_date = typeof period?.start_date?.getHours === "function";
    const has_end_date = typeof period?.end_date?.getHours === "function";

    let start_date = period.start_date;
    let end_date = period.end_date;

    if (!has_start_date) start_date = new Date(start_date + "T06:00:00");

    if (!has_end_date) end_date = new Date(end_date + "T06:00:00");

    const format_default = 'yyyy-MM-dd';

    const formattedStartDate = format(start_date, format_default);

    const formattedEndDate = format(end_date, format_default);

    const startDateResult = startOfDay(parseISO(formattedStartDate));

    const endDateResult = endOfDay(parseISO(formattedEndDate));

    const exception = {
      version: "v1",
      start_date: startDateResult,
      end_date: endDateResult,
      zipcode,
      address1,
      address2,
      number,
      neighborhood,
      city,
      state,
      lat,
      lng,
    };

    const new_service_places = [];

    if(exceptionEdit) {

      const newException = {
        ...exception,
        type: stopPlaceException.type,
      }

      services_places
        .filter(filterByPlaceException)
        .forEach((service_place) => {

          service_place.address = address1;

          if (!Array.isArray(service_place?.place?.addresses)) service_place.place.addresses = [];

          service_place.place.addresses.unshift(exception)

          const oldExceptionIndex = service_place.place.exceptions
            .findIndex(ex => originalException === JSON.stringify(ex))

          if (oldExceptionIndex === -1) return;

          const oldException = service_place?.place?.exceptions?.[oldExceptionIndex] || {};

          const edditedException = {
            ...oldException,
            ...newException
          }

          const hasDate = edditedException?.start_date && edditedException?.end_date;

          const exceptionHasLatLng = !!edditedException.lng && !!edditedException.lat;

          if (!hasDate || !exceptionHasLatLng) return;

          const exceptionIsWithinPeriod = isWithinInterval(exception_day_selected, {
            start: new Date(edditedException.start_date),
            end: new Date(edditedException.end_date)
          });

          if (!exceptionIsWithinPeriod) {
            service_place.place.exceptions.push(edditedException);
            return;
          }

          service_place.place.exceptions.splice(oldExceptionIndex, 1, edditedException);

      });
    }

    if(exceptionEdit === false) {
      
      services_places.forEach((service_place, service_index) => {

        const basic_info = {
          ...service_place,
          address: service_place.address,
          id: service_place.id,
          name: service_place.name,
          place: {
            ...service_place.place,
            addresses: [],
          },
          type: service_place.type,
          typeText: service_place.typeText,
        }
        
        const has_index = service_index === stopPlaceException.index;

        if (has_index) {
          
          const has_exceptions =
            Array.isArray(service_place.place.exceptions) &&
            service_place.place.exceptions.length > 0;
          
          if (has_exceptions) {

            const expection_within_interval = isWithinInterval(exception_day_selected, {
              start: exception.start_date,
              end: exception.end_date,
            });

            basic_info.place.exceptions.push({ ...exception, type: stopPlaceException.type });

            if (expection_within_interval) {
              basic_info.address = exception.address1;
              basic_info.place.addresses.push(exception);
              basic_info.exception = true;
            }

          }

          if (!has_exceptions) {
            const expection_within_interval = isWithinInterval(exception_day_selected, {
              start: exception.start_date,
              end: exception.end_date,
            });

            basic_info.place.exceptions = [];
            basic_info.place.exceptions.push({ ...exception, type: stopPlaceException.type });
  
            if (expection_within_interval) {
              basic_info.address = exception.address1;
              basic_info.place.addresses.push(exception);
              basic_info.exception = true;
            }
          }
        }

        const has_addresses = Array.isArray(basic_info.place.addresses) && basic_info.place.addresses.length === 0;
        if(has_addresses) basic_info.place.addresses = service_place.place.addresses;
        
        new_service_places.push(basic_info);
      });

    }

    dispatch(setServicePlace({ services_places: exceptionEdit ? services_places : new_service_places }));
    onCancel();
  }

  const handleDate = (fields, data) => {

    const hasPeriod = data.startDate && data.endDate;
    
    const startDateUTC = utcToZonedTime(new Date(data.startDate), user_settings?.timezone)
    const start_date = new Date(startDateUTC.valueOf() + minutesToMilliseconds(startDateUTC.getTimezoneOffset()));

    const endDateUTC = utcToZonedTime(new Date(data.endDate), user_settings?.timezone)
    const end_date = new Date(endDateUTC.valueOf() + minutesToMilliseconds(endDateUTC.getTimezoneOffset()));

    if (hasPeriod) setPeriod({ start_date, end_date });

  };

  const setEditConfigs = () => {
    [      
    "zipcode",
    "address1",
    "address2",
    "number",
    "neighborhood",
    "city",
    "state",
   ].forEach((propertys) => {
      inputsConfig.getValues()[propertys] = exceptionToEdit[propertys];
      inputsConfig.setValue(propertys, inputsConfig.getValues()[propertys]);
    });
  }

  useEffect(() => {

    if (!exceptionEdit) return;
    
    setOriginalException(JSON.stringify(exceptionToEdit));
    
    setEditConfigs();

    const has_start_date = typeof exceptionToEdit.start_date.getHours === "function";
    const has_end_date = typeof exceptionToEdit.end_date.getHours === "function";

    if (has_start_date) exceptionToEdit.start_date = format(exceptionToEdit.end_date, 'yyyy-MM-dd');
    if (has_end_date) exceptionToEdit.end_date = format(exceptionToEdit.end_date, 'yyyy-MM-dd');

    const startDateUTC = utcToZonedTime(new Date(exceptionToEdit.start_date), user_settings?.timezone)
    const start_date = new Date(startDateUTC.valueOf() + minutesToMilliseconds(startDateUTC.getTimezoneOffset()));

    const endDateUTC = utcToZonedTime(new Date(exceptionToEdit.end_date), user_settings?.timezone)
    const end_date = new Date(endDateUTC.valueOf() + minutesToMilliseconds(endDateUTC.getTimezoneOffset()));
    
    setPeriod({start_date, end_date})
    // eslint-disable-next-line
  }, [exceptionEdit]);

  const minutesToMilliseconds = (minutes) =>  {
    const minutesToSeconds = minutes * 60
    return minutesToSeconds * 1000
  }

  useEffect(() => {

    const startDateUTC = utcToZonedTime(new Date(start_date_selected), user_settings?.timezone)
    const start_date = new Date(startDateUTC.valueOf() + minutesToMilliseconds(startDateUTC.getTimezoneOffset()));

    const endDateUTC = utcToZonedTime(new Date(end_date_selected), user_settings?.timezone)
    const end_date = new Date(endDateUTC.valueOf() + minutesToMilliseconds(endDateUTC.getTimezoneOffset()));
    
    setPeriod({start_date, end_date})

  }, [start_date_selected, end_date_selected])


  return (
    <ExceptionCreation>
      <Row>
        <Col xl="12" xxl="12" style={{display:"flex"}}>
          <Text
            fontFamily={"Roboto"}
            fontSize={"20px"}
            lineHeight={"24px"}
            color={"#505050"}
            fontWeight={"bold"}
          >
            {localizedStrings.logisticService.exception_create.header}
          </Text>
                <button
                  onClick={onCancel}
                >
                  {
                    <Icon
                      icon={"plus"}
                      width={"20px"}
                      height={"15px"}
                      color={"#1D1B84"}
                      cursor="pointer"
                      style={{ marginLeft: "13px", display: "flex", flexDirection: "row", transform: "rotate(45deg)",}}
                    />
                  }
                </button>
        </Col>
      </Row>
      <Row>
        <Col xl="2" xxl="2">
          <Text
            fontFamily={"Roboto"}
            fontSize={"16px"}
            lineHeight={"20px"}
            color={"#505050"}
            fontWeight={"bold"}
          >
            {localizedStrings.logisticService.exception_create.name}
          </Text>
        </Col>
        <Col xl="10" xxl="10">
          <Text
            fontFamily={"Roboto"}
            fontSize={"16px"}
            lineHeight={"20px"}
            color={"#1D1B84"}
            fontWeight={"bold"}
          >
            {stopPlaceException.name}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col xl="12" xxl="12">
          <Text
            fontFamily={"Roboto"}
            fontSize={"14px"}
            lineHeight={"16px"}
            color={"#666666"}
            fontWeight={"normal"}
          >
            {localizedStrings.logisticService.exception_create.orientation}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col xl="12" xxl="12" style={{ marginBottom: "0px" }}>
          <DateInput
            type={"dateRangePicker"}
            label={
              localizedStrings.logisticService.exception_create.utilizationPeriod
            }
            error={errors_modal.period_exception.has_error}
            errorText={errors_modal.period_exception.message}
            onChange={handleDate}
            name={"period"}
            id={"period"}
            placeholder={"dd/mm/aaaa"}
            value={[period.start_date, period.end_date]}
            hasDefaultValue
            defaultValue={[period.start_date, period.end_date]}
            buttonsSelections={false}
            calendar={{
              minDate: new Date(),
            }}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col xl="12" xxl="12" style={{ marginBottom: "0px" }}>
          <CardInput
            register={inputsConfig.register}
            onChange={(field, value) => {
              inputsConfig.setValue(field, value);
              if (!exceptionEdit) onZipcodeChange(value);
            }}
            inputs={[
              {
                label:
                  localizedStrings.logisticService.exception_create.zipcode,
                name: "zipcode",
                type: "zipcode",
                placeholder:
                  localizedStrings.logisticService.exception_create
                    .zipcodePlaceHolder,
                loading: loadLoadingZipCodeException,
                defaultValue: inputsConfig.getValues()?.zipcode
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col xl="12" xxl="12" style={{ marginBottom: "0px" }}>
          <CardInput
            onChange={inputsConfig.setValue}
            register={inputsConfig.register}
            inputs={[
              {
                label:
                  localizedStrings.logisticService.exception_create.address,
                name: "address1",
                type: "text",
                error: errors_modal.address1.has_error,
                errorText: errors_modal.address1.message,
                required: true,
                placeholder:
                  localizedStrings.logisticService.exception_create
                    .addressPlaceHolder,
                defaultValue: inputsConfig.getValues()?.address1,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col xl="12" xxl="12" style={{ marginBottom: "0px" }}>
          <CardInput
            onChange={inputsConfig.setValue}
            register={inputsConfig.register}
            inputs={[
              {
                label:
                  localizedStrings.logisticService.exception_create
                    .neighborhood,
                name: "neighborhood",
                type: "text",
                placeholder:
                  localizedStrings.logisticService.exception_create
                    .neighborhoodPlaceHolder,
                defaultValue: inputsConfig.getValues()?.neighborhood,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col xl="12" xxl="12" style={{ marginBottom: "0px" }}>
          <CardInput
            onChange={inputsConfig.setValue}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.logisticService.exception_create.city,
                name: "city",
                type: "text",
                error: errors_modal.city.has_error,
                errorText: errors_modal.city.message,
                required: true,
                placeholder:
                  localizedStrings.logisticService.exception_create
                    .cityPlaceHolder,
                defaultValue: inputsConfig.getValues()?.city,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col xl="12" xxl="12" style={{ marginBottom: "0px" }}>
          <CardInput
            onChange={inputsConfig.setValue}
            register={inputsConfig.register}
            inputs={[
              {
                label: localizedStrings.logisticService.exception_create.number,
                name: "number",
                type: "text",
                error: errors_modal.number.has_error,
                errorText: errors_modal.number.message,
                required: true,
                defaultValue: inputsConfig.getValues()?.number,
                placeholder:
                  localizedStrings.logisticService.exception_create
                    .numberPlaceHolder,
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col xl="12" xxl="12" style={{ marginBottom: "0px" }}>
          <CardInput
            onChange={(field, value) => {
              inputsConfig.setValue(field, value);
            }}
            register={inputsConfig.register}
            inputs={[
              {
                label:
                  localizedStrings.logisticService.exception_create.complement,
                name: "address2",
                type: "text",
                error: errors_modal.address2.has_error,
                errorText: errors_modal.address2.message,
                required: true,
                defaultValue: inputsConfig.getValues()?.address2,
                placeholder:
                  localizedStrings.logisticService.exception_create
                    .complementPlaceHolder,
              },
            ]}
          />
        </Col>
      </Row>
      <hr width={"95%"} style={{ marginLeft: "6px", marginBottom: "0px" }} />
      <BottomActionButtons
        loading={loadLoadingFromException}
        saveText={exceptionEdit ? localizedStrings.logisticService.exception_create.editApply : localizedStrings.logisticService.exception_create.apply}
        onCancel={onCancel}
        onSave={onConfirmCreateException}
      />
    </ExceptionCreation>
  );
}
