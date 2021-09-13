import React, { useEffect } from "react";
import { Card, Text, Link } from "components";
import {
	VirtualizedTable,
	EmptyStateContainer,
	FailStateContainer,
} from "containers";
import { localizedStrings } from "constants/localizedStrings";
import { useHistory } from "react-router-dom";
import getTableColumns from "./getTableColumns";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function VehicleStatusReportsTable({
	isLoading,
	searchTerm,
	tableData,
	loadReport,
	setTableData,
  	stageOptions,
	showAddresses,
}) {
	const history = useHistory();

	const onLoadFail = () => {
		return (
			<FailStateContainer
				title={localizedStrings.noVehicleStatusFound}
				titleError={localizedStrings.noVehicleStatusFound}
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

	const [tableColumns, setTableColumns] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		setTableColumns(getTableColumns({history, stageOptions, loadReport, setTableData, showAddresses, dispatch}))
	}, [showAddresses, JSON.stringify(stageOptions)]);

	return (
		<>
			<Card className={"flex column"} loading={isLoading} onFail={onLoadFail}>
				<div>
					<div>
						{!!tableData?.length && (
							<VirtualizedTable
								name={"vehiclestatus"}
								loading={isLoading}
								data={tableData}
								columns={tableColumns}
								filterText={searchTerm}
								filterLocally
							/>
						)}
					</div>
					{!tableData?.length && !isLoading && (
						<EmptyStateContainer
							title={localizedStrings.noVehicleStatusFound}
							subtitle={localizedStrings.createAVehicleToBegin}
						/>
					)}
				</div>
			</Card>
		</>
	);
}
