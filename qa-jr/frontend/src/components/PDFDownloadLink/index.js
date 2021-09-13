import React, { useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Icon, Button } from "../../components";
import { localizedStrings } from "constants/localizedStrings";
import { useState } from "react";
import getSelectedColumns from "../../exports/pdf/getSelectedColumns";
import { useSelector } from "react-redux";


export default function PDFExportDownloadLink({
	PDFPrint,
	fileName,
	setStatusSuccess,
	setOpenPDFModal,
	getReportFn,
	filters,
	reportName,
	company_name,
	user_name,
	reportNameLocalizedString,
}) {
	const [reportIsLoaded, setReportIsLoaded] = useState(false);
	const [data, setData] = useState([]);
	const [columns, setColumns] = useState([]);
	const {
		user: { user_settings }
	} = useSelector(state => state.auth);
	useEffect(() => {
		(async () => {
			const columnsResponse = await getSelectedColumns({ reportName });

			if (reportName === 'km') {
				columnsResponse.push(`had_odometer_command_executed`);
			}

			filters.columnsResponse = columnsResponse;
			const reportData = await getReportFn({
				filters,
				user_settings
			});
			setColumns(columnsResponse);
			setData(reportData);
			setReportIsLoaded(true);
		})();
		// eslint-disable-next-line
	}, []);
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			{reportIsLoaded ? (
				<div>
					<div>
						<Icon
							icon="circle-check"
							width="50px"
							color="#24B3A4"
							divProps={{
								display: "flex",
								justifyContent: "center",
								marginBottom: 20,
							}}
						/>
					</div>
					<span
						style={{
							color: "#838383",
							fontSize: 15,
							marginTop: 10,
						}}
					>
						{localizedStrings.modalMessageReady}
					</span>
				</div>
			) : (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							marginBottom: 20,
						}}
					>
						<CircularProgress size={50} />
					</div>
					<div>
						<span
							style={{
								color: "#838383",
								fontSize: 15,
								marginTop: 10,
							}}
						>
							{localizedStrings.messageModalPleaseWait}
						</span>
					</div>
				</div>
			)}
			{reportIsLoaded && data.length && columns.length && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginTop: 15,
					}}
				>
					<PDFDownloadLink
						style={{
							cursor: "pointer",
						}}
						document={
							<PDFPrint
								filters={filters}
								rawDataArray={data}
								columns={columns}
								company_name={company_name}
								user_name={user_name}
								reportName={reportNameLocalizedString}
							/>
						}
						fileName={fileName}
					>
						{({ loading }) => (
							<Button
								onClick={() => {
									setStatusSuccess(false);
									setOpenPDFModal(false);
								}}
								backgroundColor="#192379"
								loading={loading}
								color="#fff"
								width="110px"
								height="29px"
								minWidth="41px"
								padding="0"
								marginLeft="5px"
								title={
									loading
										? localizedStrings.loading
										: localizedStrings.downloadReady
								}
								textConfig={{ fontWeight: "bold" }}
							/>
						)}
					</PDFDownloadLink>
				</div>
			)}
		</div>
	);
}
