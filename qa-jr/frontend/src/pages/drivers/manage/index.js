import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  MenuWithLogoBar,
  DescriptionPageHeader,
  VirtualizedTable,
  TableHeader,
  BottomPagination,
  EmptyStateContainer,
  FailStateContainer
} from "containers";
import {
  Button,
  Card,
  FilterInput,
  PerPageSelector,
  Text,
  Checkbox,
  ButtonWithIcon,
  Col,
  Link,
  Modal, 
  XLSXExport,
  HelpIconWithTooltip
} from "components";
import { useDispatch, useSelector } from "react-redux";
import { deleteDrivers, loadDrivers, updateDrivers } from "store/modules";
import "react-virtualized/styles.css";
import { localizedStrings } from "constants/localizedStrings";
import { getUrlParam, setUrlParam } from "utils/params";
import { DRIVERS_CREATE_PATH, DRIVERS_EDIT_PATH } from "constants/paths";
import { verifyUserAccess } from "utils/verifyUserAccess";
import { ExportXLSX } from "exports/xlsx/xlsx-report-driver.js";
import { APPLE_STORE_DRIVER_LINK, PLAY_STORE_DRIVER_LINK } from "constants/environment";
import { APP_DRIVER_LINK } from "constants/environment";
import { loadTableByUrlParams } from 'helpers/loadTableByUrlParams';
import { stringify } from "qs";
import { toast } from "react-toastify";

export default function DriversManage({ history, title, subtitle, icon }) {
  const dispatch = useDispatch();
  const inputTimeout = useRef(null);
  const listLengths = ["50", "100", "500"];
  const [visibleDrivers, setVisibleDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    Number(getUrlParam("page")) || 1
  );
  const [filterText, setFilterText] = useState(getUrlParam("search"));
  const getPerPageFromUrl = perPage =>
    listLengths.includes(perPage) ? perPage : listLengths[0];

  const [maxLengthOfList, setMaxLengthOfList] = useState(
    getPerPageFromUrl(getUrlParam("perPage"))
  );
  const [
    selectedActiveDriversCheckbox,
    setSelectedActiveDriversCheckbox
  ] = useState(true);


  const {
    updateLoading,
    loadLoading,
    loadFail,
    total,
    drivers
  } = useSelector(state => state.drivers);

  const tableColumns = useMemo(
    () => {
      const driversList = visibleDrivers || [];
      const hasKey = !!driversList
        .filter(driver => driver?.identification_driver_key)
        .length
        
      return [
        { active: true, showSort: true, key: "name", label: localizedStrings.completeName, type: "text" },
        { active: true, showSort: true, key: "nickname", label: localizedStrings.nickname, type: "text" },
        { active: true, showSort: true, key: "identifyCode", label: localizedStrings.codeId, type: "text" },
        { 
          active: true, 
          showSort: true, 
          key: "pin", 
          label: localizedStrings.pin, 
          type: "text", 
          hasCustomElement: true,
          style: () => ({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row-reverse",
          }),
          buttons: [
            {
              name: "copy", 
              className: "pinCopy", 
              color: "#1D1B84", 
              onClick: driver => driver?.pin && onCopyPinClick(driver),
              style: driver => ({
                cursor: driver?.pin ? "pointer" : "default",
                color: !driver?.pin && "#868E96",
                width: "18px",
                height: "18px",
                margin: "12px"
              })
            },
          ]},
        { active: true, showSort: true, key: "email", label: localizedStrings.email, type: "text" },
        {
          active: true,
          showSort: true,
          key: "NaN",
          label: localizedStrings.expireDriverLicense,
          type: "text"
        },
        hasKey && { key: "identification_driver_key", label: localizedStrings.keyId, type: "text" },
        {
          active: true,
          showSort: true,
          key: "created",
          label: localizedStrings.creationDate,
          type: "date",
          dateFormat: "yyyy-MM-dd"
        },
        { active: false, showSort: false, key: "device_attached", label: localizedStrings.deviceActive, type: "text", fallbackText: localizedStrings.noDeviceAttached },
        { active: false, showSort: false, key: "version_app", label: localizedStrings.versionApp, type: "text", fallbackText: "-" },
        {
          active: false,
          showSort: true,
          key: "status",
          label: localizedStrings.activateDriver,
          type: "switch",
          onChange: (...values) => onChangeSwitch(...values),
          onTrue: localizedStrings.activated,
          onFalse: localizedStrings.desactivated
        },
        {
          active: true,
          showSort: false,
          key: "actions",
          label: localizedStrings.actions,
          type: "buttons",
          buttons: [
            {
              name: "whatsapp", 
              tooltipText: "WhatsApp", 
              className: "whatsapp", 
              color: "#24b3a4", 
              onClick: driver => driver?.phone && driver?.pin && onWhatsAppClick(driver),
              style: driver => ({
                cursor: driver?.phone ? "pointer" : "default",
                color: !driver?.phone && "#868E96",
                width: "20px",
                height: "20px",
              })
            },
            {
              name: "mail", 
              tooltipText: "E-mail", 
              color: "#24b3a4", 
              onClick: driver => driver?.email && onEmailClick(driver),
              style: driver => ({
                cursor: driver?.email ? "pointer" : "default",
                color: !driver?.email && "#868E96",
                width: "15px",
                height: "15px",
              })
            },
            {
              name: "trash",
              onClick: (driver, event, driverIndex) => deleteDriver(driver, driverIndex),
              style: () => ({
                  cursor: "pointer",
                  color: "#FD3995",
                  width: "18px",
                  height: "18px",
                  marginLeft: "5px",
                  
              })
              
            },
          ]
        }
      ].filter(Boolean)
    },
    // eslint-disable-next-line
    [visibleDrivers?.length, updateLoading]
  )

  const [statusSuccessXLSX, setStatusSuccessXLSX] = useState({ notFound: false, success: false });

  const [docXlsx, setDocXlsx] = useState([]);

  const [openXLSXModal, setOpenXLSXModal] = useState(false);

  const currentOffset = maxLengthOfList * currentPage - maxLengthOfList;

;

  const {
    user: {
      organization_id,
      role_id,
    }
  } = useSelector(state => state.auth);

  const userHasDriverCreationAccess = useMemo(
    () => {

      const {
        access
      } = verifyUserAccess({
        role_id,
        path: DRIVERS_CREATE_PATH
      });

      return access;
    }, [role_id])

  const searchTerm = term => {
    setUrlParam("search", term);
    setFilterText(term);
  };

  const resetPage = (defaultPage = 1) => {
    setUrlParam("page", defaultPage);
    setCurrentPage(defaultPage);
  };

  const loadOrganizationDrivers = ({searchParam, sort = ""}) => {

    const {
      has_query_sort = false,
      sortBy = "",
      sortDirection = "",
  } = loadTableByUrlParams({sort});

    if(has_query_sort) {
      dispatch(
        loadDrivers({
          limit: maxLengthOfList,
          offset: currentPage === 1 ? undefined : currentOffset,
          search_term: searchParam || "",
          organization_id,
          status: selectedActiveDriversCheckbox
            ? 1
            : [1, 0],
          sort: `${sortBy}:${String(sortDirection).toLowerCase()}`,
        })
      );      
      return;
    }

    dispatch(
      loadDrivers({
        limit: maxLengthOfList,
        offset: currentPage === 1 ? undefined : currentOffset,
        search_term: searchParam || "",
        organization_id,
        status: selectedActiveDriversCheckbox
          ? 1
          : [1, 0],
        sort
      })
    );
  };

  const onEdit = driver =>
    history.push(DRIVERS_EDIT_PATH, { driver });

  const formatPhone = (phone) => {
      phone = phone.replace("+","")
      if(phone.length === 13) return phone; 
      return "55" + phone;
  }

  const formatMessage = (pin = "") =>{
    const driverAppDownload = [
      `${localizedStrings.downloadDriverAppFullTextOneLink} ${APP_DRIVER_LINK}`,/////////////
      `${localizedStrings.userAccess}: ${pin}`
    ].join(", ");
    return driverAppDownload
  } 
  
  const onWhatsAppClick = ({ phone = "" , pin = ""}) => {
    window.open(`https://api.whatsapp.com/send?phone=${formatPhone(phone)}&text=${formatMessage(pin)}`, "_blank");
  };

  const onCopyPinClick =({pin = ""}) => {
    navigator.clipboard.writeText(formatMessage(pin))
    toast.success(localizedStrings.pinSuccess)
  }

  const onEmailClick = ({ email = "" }) => {
    window.open("mailto:" + email, "_blank");
  };

  const deleteDriver = async (driver, driverIndex) => {
    if (updateLoading) return;
    await dispatch(
      deleteDrivers({
        driver,
        driverIndex
      })
    );
  };
  const onChangeSwitch = async (event, driver) => {
    event.preventDefault();
    event.stopPropagation();
    if (updateLoading) return;
    await dispatch(
      updateDrivers({
        id: driver.id,
        name: driver.name,
        status: !driver.status,
        pin: driver.pin,
        created: driver.created,
        organization_id
      })
    );
  };

  const perPageSelect = (page, resetPage = 1) => {
    setUrlParam("page", resetPage);
    setCurrentPage(resetPage);
    if (listLengths.includes(page)) {
      setMaxLengthOfList(page);
      setUrlParam("perPage", page);
      return;
    }
    setUrlParam("perPage", listLengths[0]);
  };

  useEffect(() => {
    const reloadToNotBreakCSS = () =>{
      const isFirstLoad = localStorage.getItem('firstLoad')
      
      if(!isFirstLoad){
        localStorage.setItem('firstLoad',true)
        return window.location.reload()
       
      }  
      localStorage.removeItem('firstLoad');
    }
    reloadToNotBreakCSS()
    const hasPageFilterOnLoad = currentPage > 1;

    if (hasPageFilterOnLoad) setSelectedActiveDriversCheckbox(false)
    // eslint-disable-next-line
  }, []);

  useEffect(() => {

    loadOrganizationDrivers({searchParam: filterText});
    // eslint-disable-next-line
  }, [maxLengthOfList, currentPage, filterText, selectedActiveDriversCheckbox]);

  useEffect(() => {

    setVisibleDrivers(drivers);

    // eslint-disable-next-line
  }, [drivers]);

  const onFilterInputChange = (nameToFilter = false) => {
    nameToFilter = nameToFilter ? nameToFilter.toLowerCase() : "";
    inputTimeout != null &&
      inputTimeout.current &&
      clearTimeout(inputTimeout.current);
    inputTimeout.current = setTimeout(() => {
      if (nameToFilter === filterText) return;
      searchTerm(nameToFilter || "");
      resetPage();
    }, 1000);
  };

  const hasZeroLength =
    visibleDrivers?.length === 0 && !loadLoading && !loadFail;

  const onLoadFail = () => {
    return (
      <FailStateContainer
        title={localizedStrings.noDriverFound}
        titleError={localizedStrings.noDriverFound}
        subtitleError={
          <Text withLink>
            {localizedStrings.pleaseTryAgain}{" "}
            <Link onClick={() => window.location.reload()}>
              {localizedStrings.clickingHere}
            </Link>
          </Text>
        }
      />
    );
  };

  const XLSXexportJSX = () => {
    const emptyArray = []
    return (
        <XLSXExport
            document={emptyArray}
            fileName={`relatorio-motoristas`}
            successStatus={statusSuccessXLSX.success} />
    )
  };

  const exportReport = (type) => {
    const typeExport = {
        xlsx: () => {
            setOpenXLSXModal(openXLSXModal => openXLSXModal = true)
            setStatusSuccessXLSX({ success: false });
            ExportXLSX({
                setStatusSuccessXLSX,
                setDocXlsx,
                organization_id
            });
        }
    }
    return typeExport[type]();
};

  return (
    <MenuWithLogoBar history={history}>
      <DescriptionPageHeader
        pagePath={false}
        title={title}
        pageName={subtitle}
        icon={icon}
        description={localizedStrings.createDriverDesc}
        linkUrl={localizedStrings.helpLink.drivers}
        linkText={localizedStrings.learnMore}
      />
      <Card
        loading={loadLoading}
        fail={loadFail}
        onFail={onLoadFail}
        id="driverManage"
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TableHeader>
            {
              <ButtonWithIcon
                title={localizedStrings.createDriver}
                icon={"plus"}
                onClick={(e) => {
                  e.persist();
                  history.push(DRIVERS_CREATE_PATH);
                }}
              />
            }
            <Col
              md="3"
              className="md-3"
              style={{ margin: "0px 15px 0px 15px", padding: "0px" }}
            >
              <FilterInput
                margin={"0px"}
                width={"100%"}
                height={"100%"}
                hasHelpText={false}
                defaultValue={filterText}
                onChange={onFilterInputChange}
              />
            </Col>
            <Checkbox
              title={localizedStrings.showOnlyActiveDrivers}
              checked={selectedActiveDriversCheckbox}
              onChange={() =>
                setSelectedActiveDriversCheckbox(!selectedActiveDriversCheckbox)
              }
            />
            {!hasZeroLength && (
              <Col style={{ margin: "0px", padding: "0px" }}>
                <PerPageSelector
                  styleDiv={{ height: "100%", float: "right" }}
                  maxLengthOfList={maxLengthOfList}
                  listLengths={listLengths}
                  onClose={(index) =>
                    maxLengthOfList !== listLengths[index] &&
                    perPageSelect(listLengths[index])
                  }
                />
                <Modal
                    open={openXLSXModal}
                    setOpen={setOpenXLSXModal}
                    header={XLSXexportJSX()} />
                <Button
                    hasIcon={true}
                    onClick={() => exportReport('xlsx')}
                    iconConfig={{
                        icon: "xlsx",
                        width: "15px",
                        color: "#192379",
                    }}
                    backgroundColor="#fff"
                    border="1px solid #E5E5E5"
                    width="41px"
                    minWidth="41px"
                    height="41px"
                    padding="0"
                    marginLeft="5px"
                    marginRight="5px"
                    float="right"
                    hover={{
                        backgroundColor: "#F5F5FF"
                    }}
                    as={"a"} >
                </Button>
              </Col>
            )}
          </TableHeader>
          <div>
            <div>
              {visibleDrivers?.length !== 0 && !loadLoading && !loadFail && (
                <VirtualizedTable
                  name={'drivers'}
                  onRowClick={onEdit}
                  data={visibleDrivers}
                  columns={tableColumns}
                  onClickSortColumns={loadOrganizationDrivers}
                />
              )}
            </div>
            {hasZeroLength && !loadLoading && !loadFail && (
              <EmptyStateContainer
                title={localizedStrings.noDriverFound}
                subtitle={localizedStrings.createADriverToBegin}
              />
            )}
          </div>
        </div>
      </Card>
      {!loadLoading && !loadFail && (
        <BottomPagination
          list={visibleDrivers}
          page={currentPage}
          setPage={setCurrentPage}
          perPage={maxLengthOfList}
          total={total}
        />
      )}
    </MenuWithLogoBar>
  );
}
