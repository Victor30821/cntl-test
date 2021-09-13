import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card } from "components";
import {
  VirtualizedTable,
  EmptyStateContainer,
  InitStateContainer,
} from "containers";
import { AttachDriverForm } from "containers/forms";
import { Modal } from "components";
import { localizedStrings } from "constants/localizedStrings";
import {
  REPORT_ROUTES_DETAILED_PATH,
  MAP_ROUTES_PATH,
  SOLICITATIONS_MANAGE_PATH,
} from "constants/paths";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

export default function RoutesReportsTable({
  history,
  loading,
  fail,
  onFail,
  visibleRegisters,
  initReport,
  filterText,
  loadTable = () => {},
}) {
    const {
        loadLoading,
        loadFail,
        total,
    } = useSelector(state => state.routesReports);

  const {
    loadLoading: vehicleLoading,
  } = useSelector(state => state.vehicles);

  const [openAttachDriverForm, setopenAttachDriverForm] = useState(false);

  const [routeSelected, setRouteSelected] = useState({})

  const openAttachModal = (route) => {
    setRouteSelected({...route });
    setopenAttachDriverForm(true)
  };

  // eslint-disable-next-line
  const [tableColumns, setTableColumns] = useState([
    {
      key: "start_date",
      label: localizedStrings.date,
      type: "date",
      active: true,
      showSort: true,
    },
    {
      key: "init",
      label: localizedStrings.init,
      type: "time",
      active: true,
      showSort: false,
    },
    {
      key: "end",
      label: localizedStrings.end,
      type: "time",
      active: true,
      showSort: false,
    },
    {
      key: "time",
      label: localizedStrings.time,
      type: "duration",
      active: true,
      showSort: true,
    },
    {
      key: "year_manufacturer",
      label: localizedStrings.reportsExport.year_manufacturer,
      type: "text",
      active: false,
      showSort: true,
	  tableSort: true,
    },
    {
      key: "vehicle_groups",
      label: localizedStrings.reportsExport.vehicle_groups,
      type: "text",
      active: false,
      showSort: true,
	  tableSort: true,
    },
    {
      key: "type_vehicle_name",
      label: localizedStrings.reportsExport.vehicle_type,
      type: "text",
      active: false,
      showSort: true,
	  tableSort: true,
    },
    {
      key: "model",
      label: localizedStrings.reportsExport.vehicle_model,
      type: "text",
      active: false,
      showSort: true,
    },
    {
      key: "distance",
      label: localizedStrings.totalDistanceShort,
      type: "distance",
      active: false,
      showSort: true,
    },
    { key: "cost",
      label: localizedStrings.cost,
      type: "cost",
      active: false,
      showSort: true,
    },
    {
      key: "max_speed",
      label: localizedStrings.maxSpeedShort,
      type: "velocity",
      active: false,
      showSort: true,
    },
    {
      key: "average_speed",
      label: localizedStrings.averageSpeedShort,
      type: "velocity",
      active: false,
      showSort: true,
    },
    {
      key: "driver_name",
      label: localizedStrings.driver,
      type: "text",
      fallbackText: localizedStrings.driverNotIdentified,
      active: true,
      showSort: true,
      style: route => ({
        display: route.has_driver ? "inline-flex" : "contents",
        flexDirection: route.has_driver ? "" : "row-reverse",
      }),
      buttons: [{
        name: "attach-driver",
        color: "#1D1B84",
        onClick: openAttachModal,
        tooltipText: localizedStrings.tooltipAttachDriver,
        styleButton: route => ({
          display: !route.has_driver ? "" : "none",
        }),
        style: route => ({
          display: !route.has_driver ? "" : "contents",
          marginRight: "0px",
      })
      }],
    },
    {
      key: "address_start",
      label: localizedStrings.addressStart,
      simpleText: true,
      type: "text",
      active: false,
      showSort: true,
	  tableSort: true,
    },
    {
      key: "address_end",
      label: localizedStrings.addressEnd,
      simpleText: true,
      type: "text",
      active: false,
      showSort: true,
	  tableSort: true,
    },
    {
      label: localizedStrings.actions,
      key: "actions",
      active: false,
      type: "buttons",
      showSort: false,
      buttons: [
        {
          name: "list",
          color: "#1A237A",
          onClick: (report) => {
            if (report.onGoing || report.file_route_id?.match(".json")) {
							handleReportDetailed(report);
						}
          },
          style: (reg) => ({
            cursor:
              reg.onGoing || reg.file_route_id?.match(".json")
                ? "pointer"
                : "default",
            color:
              reg.onGoing || reg.file_route_id?.match(".json")
							? "#1A237A"
							: "#868E96",
          }),
        },
        {
          name: faCrosshairs,
					useFontAwesome: true,
					width: "30px",
          onClick: (report) => {
						if (!report?.has_solicitation) return;

            window.open(
              SOLICITATIONS_MANAGE_PATH +
                "?search=" +
                report?.solicitation?.descr,
              "_blank"
            );
          },
          style: (report) => ({
            cursor: report?.has_solicitation ? "pointer" : "default",
            color: report?.has_solicitation ? "#1A237A" : "#CCCCCC",
          }),
        },
      ],
    },
  ]);

  const hasZeroLength = total === 0 && !loadLoading && !loadFail && !vehicleLoading;

  const handleReportDetailed = (report) => {
		const params = [
			"returnTo=" + btoa(window.location.pathname + window.location.search)
		];
    history.push(REPORT_ROUTES_DETAILED_PATH + "?" + params.join("&"), { route: report });
  };

  const handleClickRow = (report, index, data) => {
    
    const {
      id: route_id = null,
      start_date,
      end_date,
      vehicle_id,
      serial_number: imei = null,
      onGoing = false,
      before_tracking_timestamp = null,
    } = report;

    const has_before_tracking_timestamp = !!before_tracking_timestamp;
    
    const query_params = [
      `current_index=${index}`,
      !!route_id ? `route_id=${route_id}`: '',
      `start_date=${has_before_tracking_timestamp ? before_tracking_timestamp : start_date}`,
      `end_date=${end_date}`,
      `vehicle_id=${vehicle_id}`,
      !!imei ? `imei=${imei}` : '',
      `returnTo=${btoa(window.location.pathname + window.location.search)}`,
      `onGoing=${onGoing}`
    ]

    const reports_next_back = visibleRegisters.map(route => route);

    history.push(MAP_ROUTES_PATH + "?" + query_params.join("&"), { reports_next_back });

    return;
  }



  const onCancelAttachDriverForm = () => setopenAttachDriverForm(false)

  return (
    <Card
      display={"flex"}
      flexDirection={"column"}
      loading={loading}
      fail={fail}
      onFail={onFail}
    >
      <Modal
        width={"580px"}
        height={"347px"}
        open={openAttachDriverForm}
        setOpen={onCancelAttachDriverForm}
        header={AttachDriverForm({
          history,
          onCancel: onCancelAttachDriverForm,
          routeSelected,
        })}
      />
      <div>
        <div>
          {hasZeroLength && !initReport && (
            <InitStateContainer
              title={localizedStrings.initReportsStateTitle}
              subtitle={localizedStrings.initReportStateSubtitle}
            />
          )}
          {total !== 0 && !loadLoading && !vehicleLoading && !loadFail && (
            <VirtualizedTable
              name={"routes"}
              data={visibleRegisters}
              columns={tableColumns}
              onRowClick={handleClickRow}
              filterLocally
              filterText={filterText}
              onClickSortColumns={loadTable}
              /*
              rowClass={(rawData) => rawData?.onGoing ? 'animated-live' : ''}
              rowStyle={(rawData) => rawData?.onGoing ? {
                backgroundColor: "#DEF4F1"
              } : {}}
              */
            />
          )}
        </div>
        {hasZeroLength && initReport && !loadLoading && !vehicleLoading && !loadFail && (
          <EmptyStateContainer
            title={localizedStrings.emptyStateTitle}
            subtitle={localizedStrings.emptyStateSubtitle}
          />
        )}
      </div>
    </Card>
  );
}
