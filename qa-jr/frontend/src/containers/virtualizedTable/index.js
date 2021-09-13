import React, { useState, useMemo, useEffect } from "react";
import "react-virtualized/styles.css";
import { Table, Column, AutoSizer } from "react-virtualized";
import { Text, Switch, Icon, Select, Link, Input, VirtualizedTableItems, HelpIconWithTooltip } from "../../components";
import { localizedStrings } from "../../constants/localizedStrings";
import { ButtonRow, ColumnHeaderWrapper, } from "./style.js";
import { useSelector } from "react-redux";
import { getUrlParam, setUrlParam } from "utils/params";
import storage from 'redux-persist/lib/storage';
import Fuse from 'fuse.js'
import Menu from './menu';
import { DEFAULT_NULL_VALUE } from "constants/environment";
import compareByType from "helpers/compareByType";

export default function VirtualizedTable({
  name = 'default',
  data = [],
  columns,
  filterText = "",
  filterLocally = false,
  onRowClick,
  tableHeight = window.outerHeight,
  headerHeight = 30,
  rowHeight = 50,
  style,
  rowStyle = (rawRegister, parsedRegister) => { },
  rowClass = (rawRegister, parsedRegister) => { },
  onClickSortColumns,
  showSelectColumns = true,
}) {

  const [columnsSelected, setColumnsSelected] = useState(null);
  const [totalLenght, setTotalLenght] = useState(0)
	const [sortedData, setSortedData] = useState(data);

  const {
    user: { user_settings }
  } = useSelector(state => state.auth)

  const columnsPerKey = useMemo(
    () => columns
      ?.reduce((acc, current) => {
        acc[current.key] = current;
        return acc
      }, {}) || {},
    [columns]
  )

  const parsedData = useMemo(() => {
    const newData = sortedData.map((register, index) => {
      try {
        const values = Object.entries(register).reduce((acc, current) => {
          const [key, cellData] = current;
          const column = columnsPerKey[key] || {};

          if (!column?.type) return acc;

          const cellDataConverter = VirtualizedTableItems.conversionPerType?.[column?.type];

          const convertPayload = {
            ...column,
            cellData: cellData || column?.fallbackText,
            user_settings,
          }

          const {
            value,
          } = cellDataConverter?.(convertPayload) || { value: convertPayload.cellData };

          acc[key] = value;

          return acc;
        }, {})

        values.rawRowIndex = index;
        return values
      } catch (error) {
        console.log(error);
        return register
      }
    })
    return newData
    // eslint-disable-next-line
  }, [
    sortedData,
    columnsPerKey
  ])

  const filteredData = useMemo(() => {

    const tableHasFilter = filterLocally && filterText?.length

    if (!tableHasFilter) return parsedData

    const activeColumnsKeys = Object
      .entries(columnsPerKey)
      .reduce((total, current) => {
        const [key, value] = current;

        if (value.active && value.key) total.push(key);
        
        return total;
      }, []);

    const fuse = new Fuse(parsedData, {
      keys: activeColumnsKeys, // keys to index
      isCaseSensitive: false,
      ignoreLocation: true, // ignore where the match is
      shouldSort: true, // sort by highest score
      threshold: 0.2, // 0 for a perfect match, 1 for any match
      useExtendedSearch: true, // advanced search
    })

    return fuse.search(filterText).map(({ item }) => item)
    // eslint-disable-next-line
  }, [filterLocally, filterText, parsedData.length, Object.keys(columnsPerKey)])
  // eslint-disable-next-line
  const [listSortConfig, setListSortConfig] = useState({
    sortBy: getUrlParam('sortBy') || "",
    sortDirection: getUrlParam('sortDirection') || "DESC",
      tableSort: false
  });

	const sortTable = ({sortBy, sortDirection}) => {
		const findColumn = columns.find(c => c.key === sortBy);

		if (!findColumn) return;

		const sortedDataAsc = [...data].sort((a, b) => compareByType({type: findColumn.type, a: a[sortBy], b: b[sortBy]}));

		setSortedData(sortDirection?.toLowerCase() === 'asc' ? sortedDataAsc : sortedDataAsc.reverse());
	}

	useEffect(() => {
		const {sortBy, tableSort, sortDirection} = listSortConfig;

		const existSortFunction = typeof(onClickSortColumns) === 'function' && !tableSort;
		const existSortParams = sortBy && sortDirection;

		const hasToSort = !existSortFunction && existSortParams;

		if (!hasToSort) setSortedData(data);
		if (hasToSort) sortTable({sortBy, sortDirection})

	}, [data, listSortConfig]);

  const onSort = ({ sortBy, sortDirection, event, props }) => {
    event.persist();
    if (event.target.localName === 'div' || event.target.localName === 'p' || event.target.localName === 'path') {

      setUrlParam('sortBy', sortBy);

      setUrlParam('sortDirection', sortDirection);

      const has_filtered_data =
        !Array.isArray(filteredData) ||
        filteredData.length === 0;

      if (has_filtered_data) return;

      const sort_by_column = `${sortBy}:${String(sortDirection).toLowerCase()}`;

		if (typeof(onClickSortColumns) === 'function' && !props.tableSort) onClickSortColumns({ sort: sort_by_column });

		setListSortConfig({
			sortBy,
			sortDirection,
            tableSort: !!props.tableSort
		})
    }
  };

  const cellTypes = {
    text: ({ cellData, fallbackText = DEFAULT_NULL_VALUE, rowData, buttons = [], ...props }) => {
      const index = rowData?.rawRowIndex || props.rowIndex;
      const rawRowData = sortedData?.[index] || parsedData?.[index] || {};

      const hasInformation = cellData?.indexOf?.(',') > 0 || false;
      const hasButtons = Array.isArray(buttons) && buttons?.length > 0;
      const arrayInformation = cellData && hasInformation && (
        <ul id={`id-${Math.random() * 1000}`} key={Math.random() * 1000}>
          {cellData.split(',').map((elem, index) => (<li key={index}>{elem}</li>))}
        </ul>
      );

      const tooltipData = typeof props.showTooltipInCell === "function"
            ? props.showTooltipInCell(
			    rawRowData,
			    cellData,
			    index,
			    parsedData
		    ) : {};

      if (props?.simpleText) {
        return (
          <Text title={cellData} margin-top="32px" height={rowHeight} white-space="nowrap" overflow="hidden" textOverflow="ellipsis" {...style}>
            {" "}
            {cellData || fallbackText}{" "}
          </Text>
        )
      }
      if (hasInformation) {

        return (
          <Text margin-top="32px" height={rowHeight} tooltipOptions={arrayInformation && { placement: "top" }} tooltipText={arrayInformation} white-space="nowrap" overflow="hidden" textOverflow="ellipsis" {...style}>
            {
              hasButtons &&
              <ButtonRow>
                {buttons.map((button, index) => {

                  if (button.customElement) return button.customElement(rawRowData);

                  const style = typeof button.style === 'function'
                    ? button.style(rawRowData)
                    : button?.style || {};

                  const buttonStyle = typeof button.styleButton === 'function'
                    ? button.styleButton(rawRowData)
                    : button?.styleButton || {};

                  return (
                    <button
                      key={index}
                      title={button.tooltip}
                      style={{ ...buttonStyle, }}
                      onClick={event => {
                        button.onClick && button.onClick(rawRowData, event);
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                      }}
                    >
                      {
                        <Icon
                          {...button?.iconProps?.(rawRowData, button)}
                          key={index}
                          tooltipText={button.tooltipText}
                          icon={button?.name || button?.icon}
                          width={button.width || "20px"}
                          height={button.height || "15px"}
                          color={button.color || "#1A237A"}
                          cursor="pointer"
                          className={button.className || ""}
                          style={{ marginRight: "5px", ...style }}
                        />
                      }
                    </button>
                  );
                })}
              </ButtonRow>
            }
            {" "}
            {cellData || fallbackText}{" "}
          </Text>
        )
      }

      return (
        <>
          {tooltipData.show && tooltipData.iconsArray}
          <Text white-space="nowrap" overflow="hidden" textOverflow="ellipsis" title={cellData || fallbackText} {...props?.style?.(rawRowData) || {}}>
            {
              hasButtons &&
              <ButtonRow>
                {buttons.map((button, index) => {

                  if (button.customElement) return button.customElement(rawRowData, { ...props });

                  const style = typeof button.style === 'function'
                    ? button.style(rawRowData)
                    : button?.style || {};

                  const buttonStyle = typeof button.styleButton === 'function'
                    ? button.styleButton(rawRowData)
                    : button?.styleButton || {};

                  return (
                    <button
                      key={index}
                      title={button.tooltip}
                      style={{ ...buttonStyle, }}
                      onClick={event => {
                        button.onClick && button.onClick(rawRowData, event);
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                      }}
                    >
                      {
                        <Icon
                          {...button?.iconProps?.(rawRowData, button)}
                          key={index}
                          tooltipText={button.tooltipText}
                          icon={button.name}
                          width={button.width || "20px"}
                          height={button.height || "15px"}
                          color={button.color || "#1A237A"}
                          cursor="pointer"
                          className={button.className || ""}
                          style={{ marginRight: "5px", ...style }}
                        />
                      }
                    </button>
                  );
                })}
              </ButtonRow>
            }
            {" "}
            {cellData || fallbackText}{" "}
          </Text>
        </>
      )
    },
    time: props => <VirtualizedTableItems.InformationCell
      parsedData={parsedData}
      data={sortedData}
      {...props}
    />,
    duration: props => <VirtualizedTableItems.InformationCell
      parsedData={parsedData}
      data={sortedData}
      {...props}
    />,
    cost: props => <VirtualizedTableItems.InformationCell
      parsedData={parsedData}
      data={sortedData}
      {...props}
    />,
    distance: props => <VirtualizedTableItems.InformationCell
      parsedData={parsedData}
      data={sortedData}
      {...props}
    />,
    liters: props => <VirtualizedTableItems.InformationCell
      parsedData={parsedData}
      data={sortedData}
      {...props}
    />,
    velocity: props => <VirtualizedTableItems.InformationCell
      parsedData={parsedData}
      data={sortedData}
      {...props}
    />,
    distancePerLiter: props => <VirtualizedTableItems.InformationCell
      parsedData={parsedData}
      data={sortedData}
      {...props}
    />,
    switch: ({ cellData, rowData, onChange, ...props }) => {
      const rowIndex = rowData?.rawRowIndex || props.rowIndex;
      const rawRowData = sortedData?.[rowIndex] || parsedData?.[rowIndex] || {};
      const checked = !!cellData;

      return (
        <Switch
          checked={checked}
          onClick={(e) => onChange(e, rawRowData)}
          text={checked ? props.onTrue : props.onFalse}
          {...props.switchOptions?.(rawRowData)}
          {...props}
        />
      )
    },
    select: ({ cellData, rowData, onChange, ...props }) => {
      const rowIndex = rowData?.rawRowIndex || props.rowIndex;
      const rawRowData = sortedData?.[rowIndex] || parsedData?.[rowIndex] || {};
      const name = props.name + '-' + props.rowIndex;
      const options = typeof props?.options == 'function' ? props?.options() : props?.options
			const selectedValue = options.filter(option => option.value === rawRowData[props.dataKey]);
      return (
        <Select
          name={name}
          title={props.title || ''}
          value={selectedValue || []}
          options={options}
          onChange={(e) => {
            onChange(e, rawRowData);
          }}
          style={{
            width: "100%"
          }}
          placeholder={localizedStrings.selectAVehicleState}
          emptyStateText={props.emptyStateText || ''}
          customStyle={props.customStyle}
          {...props}
        />
      )
    },
    boolean: props => <VirtualizedTableItems.Boolean {...props} />,
    date: props => <VirtualizedTableItems.InformationCell
      parsedData={parsedData}
      data={sortedData}
      {...props}
    />,
    datetime: props => <VirtualizedTableItems.InformationCell
      parsedData={parsedData}
      data={sortedData}
      {...props}
    />,
    buttons: ({ rowData: item = {}, buttons = [], ...props }) => (
      <ButtonRow>
        {Array.isArray(buttons) &&
          buttons.map((button, index) => {
            const rowIndex = item?.rawRowIndex || props.rowIndex;
            const rawRowData = sortedData?.[rowIndex] || parsedData?.[rowIndex] || {};
            if (button.customElement) return button.customElement(rawRowData);

            const style = typeof button.style === 'function'
              ? button.style(rawRowData)
              : button?.style || {};

            return (
              <button
                key={index}
                title={button.tooltip}
                onClick={event => {
                  button.onClick && button.onClick(rawRowData, event, rowIndex);
                  event.preventDefault();
                  event.stopPropagation();
                  return false;
                }}
              >
                {
                  <Icon
                    {...button?.iconProps?.(rawRowData, button)}
                    key={index}
                    tooltipText={button.tooltipText}
                    icon={button?.icon || button?.name}
                    width={button.width || "20px"}
                    height={button.height || "15px"}
                    color={button.color || "#1A237A"}
                    cursor="pointer"
                    className={button.className || ""}
                    style={{ marginRight: "5px", ...style }}
                    useFontAwesome={button?.useFontAwesome || false}
                  />
                }
              </button>
            );
          })}
      </ButtonRow>
    ),
    link: ({ target, to, icon, style, rowData, ...props }) => {
      const rowIndex = rowData?.rawRowIndex || props.rowIndex;
      const rawRowData = sortedData?.[rowIndex] || parsedData?.[rowIndex] || {};
      return (
        <Link target={target} href={to(rawRowData)}>
        <Icon
          icon={icon?.icon || icon?.name}
          width={icon.width || "20px"}
          height={icon.height || "15px"}
          color={icon.color || "#1A237A"}
          cursor="pointer"
          className={icon.className || ""}
          style={{ marginRight: "5px", ...style }}
        />
      </Link>
      )
    },
    input: ({ cellData, rowData, onChange, propsInput = {}, ...props }) => {
      const rowIndex = rowData?.rawRowIndex || props.rowIndex;
      const rawRowData = sortedData?.[rowIndex] || parsedData?.[rowIndex] || {};
      return (
        <Input
          style={{
            width: "100%",
            border: "1px solid #E5E5E5",
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "12px",
            lineHeight: "19px",
            color: "black",
          }}
          type={propsInput?.type || "text"}
          onChange={(e) => {
            onChange(e, rawRowData);
          }}
          defaultValue={cellData || ""}
          mask={propsInput?.mask || ""}
          noMask={propsInput?.noMask || false}
          showMask={propsInput?.showMask || false}
          error={propsInput?.error || false}
        />
      )
    }
  };

  const ColumnHeader = props => {
    // only first letter to upper case
    const columnTitle = (([first, ...rest]) =>
      [first?.toUpperCase(), ...rest].join(""))(props?.label || "");
    return (
      <ColumnHeaderWrapper className="column-header-wrapper" {...props.divStyle}>
      {
        props?.showSort ? (
          <Text
          alignItems={"center"}
          cursor={"pointer"}
          fontWeight={"bold"}
          fontSize={"13px"}
          lineHeight={"19px"}
          {...props.textStyle}
          flex={"1"}
          display={"flex"}
          onClick={event => onSort({ sortBy: props.dataKey, sortDirection: listSortConfig.sortDirection === "ASC" ? "DESC" : "ASC", event, props })}
        >
          {columnTitle}
          {props.showTooltip && <HelpIconWithTooltip text={props.tooltipMessage} />}
        </Text>
        ) : (
          <Text
          alignItems={"center"}
          cursor={"normal"}
          fontWeight={"bold"}
          fontSize={"13px"}
          lineHeight={"19px"}
          {...props.textStyle}
          flex={"1"}
          display={"flex"}
        >
          {columnTitle}
          {props.showTooltip && <HelpIconWithTooltip text={props.tooltipMessage} />}
        </Text>
        )
      }
       { props?.showSort && <div>
          {listSortConfig.sortBy === props.dataKey && props.dataKey !== null ? (
            <VirtualizedTableItems.SortIconIndicator
              onSort={onSort}
              listSortConfig={listSortConfig}
            />
          ) : (
              <>
                <Icon
                  icon={"ASC"}
                  width={"15px"}
                  height={"7px"}
                  color={"#1A237A"}
                  cursor="pointer"
                  divProps={{
                    onClick: event => onSort({ sortBy: props.dataKey, sortDirection: "ASC", event, props })
                  }}
                />
                <Icon
                  icon={"DESC"}
                  width={"15px"}
                  height={"7px"}
                  color={"#1A237A"}
                  cursor="pointer"
                  divProps={{
                    onClick: event => onSort({ sortBy: props.dataKey, sortDirection: "DESC", event, props })
                  }}
                />
              </>
            )}
        </div> }
        {props.position === totalLenght && showSelectColumns && (<Menu nameTable={name} setTotalLenght={setTotalLenght} columns={columnsSelected} setColumnsSelected={setColumnsSelected} />)}
      </ColumnHeaderWrapper>
    );
  };

  const cellComponent = ({ type, ...props }) => cellTypes[type](props);

  React.useEffect(() => {
    async function fetchData() {
      if (name === "default") {
        const allColumnsActive = columns.map(column => ({ active: true, ...column }))
        setColumnsSelected(allColumnsActive)
      } else if (columns?.length > 0) {
        const settings = await storage.getItem("@tablesSettings") || JSON.stringify({ init: null });
        const getSettings = JSON.parse(settings) || {};
        if (!getSettings?.[name]) {
          const updateData = columns.reduce((acc, setting) => {
            acc[setting.key] = setting.active;
            return acc;
          }, {});
					if (name === 'vehiclestatus') updateData.address = true;
          const obj = {};
          obj[name] = updateData;
          await storage.setItem("@tablesSettings", JSON.stringify({ ...getSettings, ...obj }));
        };

        const res = await storage.getItem("@tablesSettings") || JSON.stringify({ init: null });
        const newSettings = JSON.parse(res);

        const columnsActive = columns.map(column => {
          column.active = newSettings[name][column.key] || false;
          return column;
        });

        setColumnsSelected(columnsActive)
      };
    }
    fetchData();
    // eslint-disable-next-line
  }, [columns]);

  React.useEffect(() => {
    if (columnsSelected?.length) {
      const [totalLenght] = [columnsSelected?.filter(columns => {
        if (!columns.active) return;
        return columns
      }).length - 1];
      setTotalLenght(totalLenght)
    }
  }, [columnsSelected]);

  return (
    <AutoSizer style={{ width: "100%", height: "auto" }} disableHeight>
      {({ width }) => {
        return (
          <Table
            onRowClick={({ event, rowData, ...props }) => {
              if (onRowClick) {
                const index = rowData?.rawRowIndex || props.index;
                const rawRowData = sortedData?.[index] || filteredData?.[index] || {};

                onRowClick(rawRowData, index);
              }
            }}
            overscanRowCount={10}
            {...listSortConfig}
            width={width}
            height={tableHeight}
            style={{
              maxHeight: filteredData.length * rowHeight + headerHeight + 30,
              ...style
            }}
            headerHeight={headerHeight}
            rowHeight={rowHeight}
            rowClassName={({ index }) => rowClass(sortedData[index], parsedData[index])}
            rowStyle={({ index }) => rowStyle(sortedData[index], parsedData[index])}
            rowCount={filteredData.length}
            key={({ dataKey }) => dataKey}
            rowGetter={({ index }) => filteredData[index]}
          >
            {columnsSelected?.filter?.(column => column.active)
              .map?.(
                ({ key = null, label = "", active = null, ...columnProps }, index) => {
                  const weight = +columnProps.weight
                  const blockWeight = ("flex" + (weight || 1)).replace(".", "")
                  
                  return (
                    <Column
                      key={index}
                      id={`row-${index}`}
                      dataKey={key || 'ASC'}
                      width={100}
                      label={label}
                      headerClassName={blockWeight}
                      className={blockWeight}
                      style={{ paddingLeft: '16px', paddingRight: '16px', cursor: (onRowClick && 'pointer') || 'auto' }}
                      headerRenderer={props =>
                        ColumnHeader({ position: index, ...props, ...columnProps })
                      }
                      cellRenderer={props =>
                        cellComponent({ ...props, ...columnProps })
                      }
                    />
                  );
                }
              )}
          </Table>
        );
      }}
    </AutoSizer>
  );
}
