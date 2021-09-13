import React, { useState, useEffect, useMemo } from "react";
import { localizedStrings } from "constants/localizedStrings";
import { Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {  Col, Modal, Icon, Text, DateInput } from "components";
import {  VirtualizedTable, EmptyStateContainer, DeleteConfirmationForm } from 'containers';
import { loadStopPlacesSelectors, logisticsChangeSelected, setServicePlace, getTaggingByFilters, setSwichManualDeparture } from "store/modules";
import { ExceptionForm, selectPlacesForm } from "containers/forms";
import { useForm } from "react-hook-form";
import { isWithinInterval, format } from "date-fns";
import { MAX_LIMIT_FOR_SELECTORS } from "constants/environment";

const vehicleRouteOnMapButtonStyle = {
  width: "auto",
  display: "flex",
  background: "#192379",
  flexDirection: "row",
  cursor: "pointer",
  alignItems: "center",
  border: "1px solid #1A237A",
  borderRadius: "4px",
  minWidth: "155px",
  backgroundColor: "#192379",
  justifyContent: "flex-end",
  padding: "10px",
  height: "36px",
};

const reorganizeStopPlacesStyle = {
  width: "auto",
  display: "flex",
  flexDirection: "row",
  cursor: "pointer",
  alignItems: "center",
  border: "1px solid #1A237A",
  borderRadius: "4px",
  minWidth: "109px",
  backgroundColor: "#192379",
  justifyContent: "flex-end",
  padding: "10px",
  height: "36px",
};

export default function StopPlaces({ inputsConfig, onChanges, errors }) {

  const dispatch = useDispatch();

  const [tableColumns, setTableColumns] = useState([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [openCreateExceptionService, setOpenCreateExceptionService ] = useState(false);

  const [openSelectStopPlacesForm, setOpenSelectStopPlacesForm ] = useState(false);

  const [stopPlaceException, setStopPlaceException] = useState({ id: 0, name: "" })

  const [servicePlacesDelete, setServicePlacesDelete] = useState({});

  const [exceptionEdit, setExceptionEdit] = useState(false);

  const [exceptionToEdit, setExceptionToEdit] = useState({});

  const [visibleTags, setVisibleTags] = useState([]);

  const [enableReorganize, setEnableReorganize] = useState(false);

  const [date, setDate] = useState({});

  const [typeOptions, setTypeOptions] = useState([
    {
      label: localizedStrings.logisticService.boarding,
      value: 'in',
    },
    {
      label: localizedStrings.logisticService.landing,
      value: 'out',
    }
  ]);

  const defaultValues = useMemo(
    () => ({
      zipcode: undefined,
      address1: undefined,
      address2: undefined,
      number: undefined,
      neighborhood: undefined,
      city: undefined,
      state: undefined,
    }), []
  );

  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
    matchFrom: 'any',
  };

  const { register, setValue, getValues, watch, reset } = useForm({ defaultValues, });

  const [erroClient, setErroClient] = useState({
    error: false,
    message: ""
  });

  const [erroPlace, setErroPlace] = useState({
    error: false,
    message: ""
  });

  const [erroIdentification, setErroIdentification] = useState({
    error: false,
    message: ""
  });

  const [erroTag, setErroTag] = useState({
    error: false,
    message: ""
  });

  const {
    selectors,
    selected,
    services_places
  } = useSelector(state => state.logisticsServices);

  const {
    searchedGroup,
  } = useSelector(state => state.groups);

const {
  user: {
    organization_id,
  },
} = useSelector(state => state.auth);

  const {
    stop_places: {
      selector_clients,
      selector_places,
      selector_identifications
    }
  } = selectors;

  const {
    overview_selected:{
      start_date_selected,
      end_date_selected
    },
    stop_places
  } = selected;

  const {
    client_selected,
    place_selected,
    tag_selected,
    identification_selected,
    exception_day_selected,
  } = stop_places

  useEffect(() => {
    dispatch(
      getTaggingByFilters({
        urn: "v0:cgv:place:" + organization_id + ":*",
      })
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {

    const has_searched_groups = searchedGroup && Array.isArray(searchedGroup) && searchedGroup?.length > 0;

    if (has_searched_groups) {
        const tagname_groupby_place_id = searchedGroup?.reduce((idx, group) => {

          const [, , , , place_id] = group.urn.split(":");

          const has_idx = idx[group.tagName] !== undefined;

          if(has_idx === false) {
            idx[group.tagName] = { label: group.tagName, value: [+place_id] };
            return idx;
          }

          idx[group.tagName].value.push(+place_id);

          return idx;
        }, {});

        setVisibleTags(Object.keys(tagname_groupby_place_id)?.map(items => ({label:tagname_groupby_place_id[items].label,value:[...new Set(tagname_groupby_place_id[items].value)]})));
    }

}, [searchedGroup]);

  useEffect(() => {
    const has_services_places = !!services_places && services_places.length >= 1
    
    if(has_services_places){
      
      const newServicesPlaces = services_places.reduce((acc, servicePlace) => {
        const { 
          place:{
            exceptions
          } 
        } = servicePlace
        
        const newServicePlace = JSON.parse(JSON.stringify(servicePlace))

        const hasException = Array.isArray(exceptions) && exceptions.length >= 1

        if(hasException === false){
          acc.push(newServicePlace)
          return acc
        }

        const [selectedException] = exceptions.filter(exception =>{
          const hasExceptionInThisDay = 
          isWithinInterval(exception_day_selected, {
            start: new Date(exception.start_date),
            end: new Date(exception.end_date)
          })

          if(hasExceptionInThisDay) return exception;
        })

        const hasSelectedException = !!selectedException
        
        if(hasSelectedException){
          newServicePlace.address = selectedException.address1;
          newServicePlace.place.addresses = [selectedException];
          newServicePlace.exception = true;
        }

        if(!hasSelectedException){

          const [originServicePlace] = selector_places.filter(selector => selector.place.identification === servicePlace.identification)          
          const {
            place:{
              addresses
            }
          } = originServicePlace

          const [defaultAddress] = addresses

          newServicePlace.address = defaultAddress.address1;
          newServicePlace.place.addresses = addresses;
          newServicePlace.exception = undefined;
        }
        acc.push(newServicePlace)
        return acc;
      },[]);

      dispatch(setServicePlace({ services_places: newServicesPlaces}));
    }
  }, [exception_day_selected])
  
  useEffect(() => {
    dispatch(loadStopPlacesSelectors({
      offset: 0,
      limit: MAX_LIMIT_FOR_SELECTORS,
    }));
    // eslint-disable-next-line
  },[]);

  const onClickDirectionUp = (place) => {
    const service_place = services_places?.find?.(service_place => service_place.id === (place.id - 1));
    const has_service_place = service_place !== undefined;
    if(has_service_place) {
      const item_up = Object.assign({},place);
      const item_down = Object.assign({}, service_place);
      const item_up_id = item_up.id;
      const item_down_id = item_down.id;

      services_places.splice(item_down_id, 1);
      services_places.splice(item_up_id, 0, item_down);
      services_places.forEach((service, i) => (service.id = i));
      dispatch(setServicePlace({ services_places }));
    }
  }

  const onClickDirectionDown = (place) => {
    const service_place = services_places?.find?.(service_place => service_place.id === (place.id + 1));
    const has_service_place = service_place !== undefined;
    if(has_service_place) {
      const item_up = Object.assign({},place);
      const item_down = Object.assign({}, service_place);
      const item_up_id = item_up.id;
      const item_down_id = item_down.id;

      services_places.splice(item_up_id, 1);
      services_places.splice(item_down_id, 0, item_up);
      services_places.forEach((service, i) => (service.id = i));
      dispatch(setServicePlace({ services_places }));
    }
  }

  const handleInOut = (e, data) => {

    e.preventDefault();

    e.stopPropagation();

    services_places.forEach(s_place => {
      if(s_place?.id === data?.id) {
        s_place.typeText = !s_place.typeText;
        s_place.type = s_place.typeText ? "in" : "out";
      }
    });

    dispatch(setServicePlace({ services_places }));

  }

  const onHandleDepartureChange = (e, data) => {

      services_places.forEach(s_place => {
        if(s_place?.id === data?.id) s_place.departure = e?.target?.value;
      });

      dispatch(setServicePlace({ services_places }));

  }

  useEffect(() => {
    const columns = [];
    columns.push({
      active: true,
      key: "name",
      label: localizedStrings.logisticService.name,
      type: "text",
      style: place => ({
        display: enableReorganize ? "inline-flex" : "contents",
      }),
      buttons: [{
        customElement: (rowData, props) => (
          <Text
            color="#444444"
            fontWeight="700"
            fontSize="12px"
            padding="5px"
            textAlign="center"
            background="#EDEDF0"
            borderRadius="4px"
            minWidth="25px"
            marginRight="10px"
          >
            {+props.rowIndex + 1}
          </Text>
        ),
      },
      {
        name: "star",
        color: "#FFC241",
        tooltipText: localizedStrings.specialPlace,
        styleButton: reg => ({
          display: +reg?.place?.has_restriction ? "" : "none",
        }),
        style: reg => ({
          display: +reg?.place?.has_restriction ? "" : "contents",
      })
      },{
        name: "arrow-up-2",
        color: "#1D1B84",
        onClick: onClickDirectionUp,
        styleButton: reg => ({
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "#1d1b84",
          borderRadius: "4px",
          background: "#fff",
          marginRight: "4px",
          display: reg.id !== 0 && enableReorganize ? "" : "none",
        }),
        style: reg => ({
          display: reg.id !== 0 && enableReorganize ? "" : "contents",
          marginRight: "0px",
      })
      },{
        name: "arrow-down-2",
        color: "#1D1B84",
        onClick: onClickDirectionDown,
        styleButton: reg => ({
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "#1d1b84",
          borderRadius: "4px",
          background: "#fff",
          marginRight: "4px",
          display: (reg.id + 1) !== services_places.length  && enableReorganize ? "" : "none",
        }),
        style: reg => ({
          display: (reg.id + 1) !== services_places.length && enableReorganize ? "" : "contents",
          marginRight: "0px",
      })
      },{
        name: "warning",
          color: "#FF9B05",
          tooltipText: localizedStrings.logisticService.inOutTheSame,
        style: place => ({
          display: Array.isArray(services_places) &&
            services_places.length > 1 &&
            services_places
              ?.filter(service_place => service_place.id !== place.id)
              ?.some(service_place => {
                const hasSameAddress = place.address === service_place.address;

                const hasSameId = +place?.place?.id === +service_place.place?.id;

                return (hasSameAddress && hasSameId)
              }) ? "" : "none"
        })
      }]
    },
    {
      active: true,
      key: "identification",
      label: localizedStrings.logisticService.identification,
      type: "text",
    },
    {
      active: true,
      key: "address",
      label: localizedStrings.logisticService.address,
      type: "text",
      style: place => ({
        display: place?.exception !== undefined ? "inline-flex" : "contents",
    }),
      buttons:[{
        name: "location",
        color: "#1D1B84",
        onClick: onClickEditException,
        style: reg => ({
          display: reg?.exception !== undefined ? "" : "contents",
      })
      }]
    },
    {
      active: true,
      label: localizedStrings.logisticService.inout,
      key: "typeText",
      type: "switch",
      onChange: handleInOut,
      onTrue: localizedStrings.logisticService.boarding,
      onFalse: localizedStrings.logisticService.landing,
    },
    {
      active: true,
      key: "departure",
      label: localizedStrings.logisticService.hour,
      showTooltip: true,
      tooltipMessage: [
        localizedStrings.logisticService.manualDepartureInfoOne,
        localizedStrings.logisticService.caution,
        localizedStrings.logisticService.manualDepartureInfoTwo
      ],
      type: "input",
      onChange: onHandleDepartureChange,
      propsInput: {
        mask: "time",
        noMask: true,
        showMask: true,
        type: "time",
        error: errors.stop_places.places_depature.error,
      }
    },
    {
      active: true,
      label: localizedStrings.logisticService.actions, type: "buttons",
       buttons:[{
        name: "location",
        color: "#1D1B84",
        onClick: onClickException,
       },
       {
        name: "trash",
        color: "#FD3995",
        onClick: onClickDeleteServicePlaces,
    },]
   });
    setTableColumns(columns);
    // eslint-disable-next-line
  }, [enableReorganize, services_places, exceptionEdit]);

  const has_services_places = Array.isArray(services_places) && services_places.length > 0;

  const placeLimit = ({
    is_place = true
  }) => {
    is_place ? setErroPlace({
      error: true,
      message: localizedStrings.logisticService.placeLimit,
    }) : setErroIdentification({
      error: true,
      message: localizedStrings.logisticService.placeLimit,
    });
  }

  const addIdentification = () => {

    setErroIdentification({
      error: false,
      message: "",
    });

    const has_place_selected = identification_selected?.place !== undefined &&
    Array.isArray(identification_selected?.place?.addresses) &&
    identification_selected?.place?.addresses?.length > 0;

    const place_limit =
      Array.isArray(services_places) &&
      services_places?.length === 200;

    if(has_place_selected && place_limit === false) {


      const place_found = services_places.filter(service_place => service_place.place.id === identification_selected?.place?.id);
      const has_place_found = Array.isArray(place_found) && place_found?.length > 0;

      if(has_place_found) {

          const [address = {}] = identification_selected?.place?.addresses.reverse();

          services_places.push({
            id: identification_selected?.place?.id,
            name: identification_selected?.place?.name,
            address: address.address1,
            identification: identification_selected?.place?.identification || "",
            has_restriction: identification_selected?.place?.has_restriction || 0,
            type: "out",
            typeText: localizedStrings.logisticService.landing,
            place: {...identification_selected.place, addresses: [address]},
            departure: "",
          })

      }

      if(has_place_found === false) {

        const [address = {}] = identification_selected?.place?.addresses;

        services_places.push({
          id: identification_selected?.place?.id,
          name: identification_selected?.place?.name,
          address: address.address1,
          identification: identification_selected?.place?.identification || "",
          has_restriction: identification_selected?.place?.has_restriction || 0,
          type: "in",
          typeText: localizedStrings.logisticService.boarding,
          place: {...identification_selected.place, addresses: [address]},
          departure: "",
        })
      }

      dispatch(setServicePlace({ services_places }));
      dispatch(logisticsChangeSelected({
        selected: { stop_places: { ...selected.stop_places, identification_selected: {} } }
      }));
    }

    if(place_limit) {
      placeLimit({
        is_place: false,
      });
    }

    if(has_place_selected === false) {
      setErroIdentification({
        error: true,
        message: localizedStrings.fieldRequired,
      });
    }
  }

  const addPlace = () => {

    setErroPlace({
      error: false,
      message: "",
    });

    const has_place_selected = place_selected?.place !== undefined &&
    Array.isArray(place_selected?.place?.addresses) &&
    place_selected?.place?.addresses?.length > 0;

    const place_limit =
      Array.isArray(services_places) &&
      services_places?.length === 200;

    if(has_place_selected && place_limit === false) {

        const [address = {}] = place_selected?.place?.addresses;

        services_places.push({
          id: place_selected?.place?.id,
          name: place_selected?.place?.name,
          address: address.address1,
          identification: place_selected?.place?.identification || "",
          has_restriction: place_selected?.place?.has_restriction || 0,
          type: "in",
          typeText: true,
          place: {...place_selected.place, addresses: [address]},
          departure: "",
        });

        dispatch(setServicePlace({ services_places }));
        dispatch(logisticsChangeSelected({
          selected: { stop_places: { ...selected.stop_places, place_selected: {} } }
        }));
        return;
    }

    if(place_limit) {
      placeLimit({
        is_place: true
      });
    }

    if(has_place_selected === false) {
      setErroPlace({
        error: true,
        message: localizedStrings.fieldRequired,
      });
    }
  }

  const addClient = () => {

    setErroClient({
      error: false,
      message: ""
    });

    const has_client_selected = client_selected.value !== undefined &&
    client_selected.value.place !== undefined;

    const place_limit =
    Array.isArray(services_places) &&
    services_places?.length === 10;

    if(has_client_selected && place_limit === false) {
      const has_places = Array.isArray(client_selected.value.place) && client_selected.value.place.length > 0;
      if(has_places === false) {
        setErroClient({
          error: true,
          message: localizedStrings.logisticService.notFoundClientPlaces
        });
        return;
      }
      // eslint-disable-next-line
      client_selected.value.place.forEach(place => {

          const [address ={}] = place.addresses;

          services_places.push({
            id: place.id,
            name: place.name,
            type: "in",
            typeText: true,
            identification: place?.identification || "",
            has_restriction: place?.has_restriction || 0,
            address: address.address1 || "",
            place: { ...place, addresses: [address]},
            departure: "",
          });

      });

      dispatch(setServicePlace({ services_places }));
      dispatch(logisticsChangeSelected({
        selected: { stop_places: { ...selected.stop_places, client_selected: {} } }
      }));

      return;
    }

    if(place_limit) {
      placeLimit();
    }

    if(has_client_selected === false) {
      setErroClient({
        error: true,
        message: localizedStrings.fieldRequired
      });
    }

  }

  const addTag = () => {

    setErroTag({
      error: false,
      message: ""
    });

    const place_limit =
      Array.isArray(services_places) &&
      services_places?.length === 200;

    const has_tag_selected = Array.isArray(tag_selected.value) && tag_selected.value.length > 0;

    if(has_tag_selected && place_limit === false) {

        const services_places_to_insert = tag_selected?.value?.reduce((idx, place_id) => {

          const { place }  = selector_places?.find(selector => selector.place.id === place_id);

          const has_place = place !== undefined;

          if(has_place) {

              const [address ={}] = place?.addresses;

              idx.push({
                id: place?.id,
                name: place?.name || "",
                type: "in",
                typeText: true,
                identification: place?.identification || "",
                has_restriction: place?.has_restriction || 0,
                address: address?.address1 || "",
                place: {...place, addresses: [address]} || {},
                departure: "",
              });

            return idx;

          }

          return idx;

        }, []);

        const has_places_to_insert = Array.isArray(services_places_to_insert) && services_places_to_insert.length > 0;

        if(has_places_to_insert && place_limit === false) {

          services_places_to_insert.forEach(place => services_places.push({ id: place?.id, name: place?.name, address: place?.address || "", place: place?.place || {} }));

          dispatch(setServicePlace({ services_places }));

          dispatch(logisticsChangeSelected({
            selected: { stop_places: { ...selected.stop_places, tag_selected: {} } }
          }));

          return;
        }

        if(place_limit) {
          placeLimit();
        }

        if(has_places_to_insert === false) {
          setErroTag({
            error: true,
            message: localizedStrings.logisticService.notFoundTagPlaces
          });
        }

    }

    if(has_tag_selected === false) {
      setErroTag({
        error: true,
        message: localizedStrings.fieldRequired
      });
    }

  }

  const handleDate = (val, date) => {
    const { target: { value = "" } } = date;
  
    const selectedDate = new Date(value + 'T06:00:00.000Z')
  
    dispatch(logisticsChangeSelected(({
      selected: {
          stop_places: {
              ...stop_places,
              exception_day_selected: selectedDate || new Date()
          },
      },
    })));
  }

  const onClickDeleteServicePlaces = (value) => {
    setServicePlacesDelete(value);
    setOpenDeleteModal(true);
  }

  const onCancelDelete = () => setOpenDeleteModal(false);

  const onConfirmDelete = () => {
    const newServicePlaces = services_places.filter(service_place => service_place.id !== servicePlacesDelete.id);

    const editPlaceIndex = newServicePlaces.findIndex(service_place => +service_place.place.id === +servicePlacesDelete?.place?.id);

    if (editPlaceIndex !== -1) {

      const placeToEdit = newServicePlaces[editPlaceIndex];

      newServicePlaces.splice(editPlaceIndex, 1, {
        ...placeToEdit,
        type: "in",
        typeText: true,
      })
    }

    dispatch(setServicePlace({ services_places: newServicePlaces }));
    setOpenDeleteModal(false);
  }

  const setReorganize = ({ value }) => setEnableReorganize(value);

  const enableReorganizeStopPlace = () => setReorganize({ value: !enableReorganize });

  const onCancelException = () => {
    setOpenCreateExceptionService(false);
    setException(false);
  }

  const onCancelSelecPlacesForm = () => setOpenSelectStopPlacesForm(false)

  const setException = (value) => setExceptionEdit(value)

  const onClickException = (place) => {
    setException(false);
    setStopPlaceException({ id: place.place.id, name: place.name, type: place.type, index: place.id });
    setOpenCreateExceptionService(true);
  };

  const onClickEditException = (stop_place) => {
    setException(true);

    stop_place.place.addresses.forEach((address) => {

      const exceptions_by_address = stop_place?.place?.exceptions?.filter?.(ex => ex.zipcode === address.zipcode && ex.type === stop_place.type);

      const has_exceptions_by_address = Array.isArray(exceptions_by_address) && exceptions_by_address.length > 0;

      if(has_exceptions_by_address) {
        const exception_within_filter = exceptions_by_address.filter(ex => isWithinInterval(new Date(), {start: new Date(ex.start_date), end: new Date(ex.end_date)}));

        const has_exception_within_filter = Array.isArray(exception_within_filter) && exception_within_filter.length > 0;

        if(has_exception_within_filter){
          const [exception={}] = exception_within_filter;
          setExceptionToEdit(exception);
        }
      }

    });

    setStopPlaceException({ id: stop_place.place.id, name: stop_place.name, type: stop_place.type });
    setOpenCreateExceptionService(true);
  }

  useEffect(() => {
    const start = typeof start_date_selected === 'string' ?
      start_date_selected + "T06:00:00Z":
      format(start_date_selected, "yyyy-MM-dd") + "T06:00:00Z";

    const end = typeof end_date_selected === 'string' ?
      end_date_selected + "T06:00:00Z":
      format(end_date_selected, "yyyy-MM-dd") + "T06:00:00Z";

    setDate({start, end})
  }, [start_date_selected, end_date_selected])

  return (
    <>
      <Modal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
          header={DeleteConfirmationForm({ onCancel: onCancelDelete, onConfirm: () => onConfirmDelete(), })} />
      <Modal
        height={"100%"}
        width={"388px"}
        left={"none"}
        right={"0"}
        top={"none"}
        transform={"none"}
        paddingTop={"10px"}
        marginTop={"0px"}
        marginRight={"0px"}
        open={openCreateExceptionService}
        setOpen={setOpenCreateExceptionService}
        header={ExceptionForm({ onCancel: onCancelException, inputsConfig: {setValue,register,getValues,watch,reset}, stopPlaceException, exceptionEdit, exceptionToEdit })}
         />
      <Modal
        height={"100%"}
        width={"388px"}
        left={"none"}
        right={"0"}
        top={"none"}
        transform={"none"}
        paddingTop={"10px"}
        marginTop={"0px"}
        marginRight={"0px"}
        open={openSelectStopPlacesForm}
        setOpen={setOpenSelectStopPlacesForm}
        header={selectPlacesForm({
          onCancel: onCancelSelecPlacesForm,
          addTag,
          addPlace,
          addClient,
          addIdentification,
          erroClient,
          erroPlace,
          erroTag,
          erroIdentification,
	        dispatch,
          selector_clients,
          selector_places,
          selector_identifications,
          client_selected,
          place_selected,
          tag_selected,
          identification_selected,
          visibleTags,
          selected
        })}
      />
        <button
              style={vehicleRouteOnMapButtonStyle}
              onClick={() => {
                setOpenSelectStopPlacesForm(true);
              }} >
              <Icon icon={"plus"} width={'20px'} height={'16px'} color='#fff' divProps={{ margin: "0px 5px" }} />
              <Text color={"#fff"} fontSize={"13px"} >
                  {localizedStrings.addANewStopPlace}
              </Text>
          </button>
     <div>
          <hr></hr>
          <div>
          <Row>
              {
                has_services_places &&
                <Col xl="2" xxl="2">
                    <button
                        style={{...reorganizeStopPlacesStyle, background: enableReorganize ? "#1D1B84" : "#FFFFFF",}}
                        onClick={() => enableReorganizeStopPlace()} >
                        <Text color={ enableReorganize ? "#fff" : "#1D1B84"} fontSize={"13px"} >
                            {localizedStrings.logisticService.reorganizeStopPlace}
                        </Text>
                    </button>
                  </Col>
              }
              <Col xxl="3" style={{marginLeft: '55%'}}>
                <DateInput
                  type={"calendar"}
                  label={""}
                  onChange={handleDate}
                  name={"period"}
                  id={"period"}
                  placeholder={"dd/mm/aaaa"}
                  value={exception_day_selected}
                  calendar={{
                    minDate: new Date(date.start),
                    maxDate: new Date(date.end),
                  }}
                  hasDefaultValue={false}
                  buttonsSelections={false}
                  required
                />
              </Col>
            </Row>
              {
                has_services_places &&
                  <VirtualizedTable
                      name={'stopPlaces'}
                      style={{ marginTop: "14px" }}
                      data={JSON.parse(JSON.stringify(services_places))}
                      columns={tableColumns}
                  />
              }
          </div>
          {
              (!has_services_places) &&
              <EmptyStateContainer
                  style={{ marginTop: "14px" }}
                  title={localizedStrings.logisticService.noServiceStopPlacesFound}
              />
          }
      </div>
    </>
  );
}

