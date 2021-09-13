import React from "react";
import { Page, Document, View } from "@react-pdf/renderer";
import styles from "./styles";
import Header from "./header";
import HeaderRow from "./headerRow";
import Rows from "./rows";
import Footer from "./footer";

export default function PDFPrint({
	columns,
	rawDataArray,
	filters,
	company_name,
	user_name,
	reportName,
}) {
	let paginatedArray = [];
	let arraysPageLength = 16;

	for (
		let index = 0;
		index < rawDataArray.length;
		index += arraysPageLength
	) {
		paginatedArray.push(
			rawDataArray.slice(index, index + arraysPageLength)
		);
		if (paginatedArray.length > 0) arraysPageLength = 18;
	}
	return (
		<Document>
			{paginatedArray.map((page, index) => {
				const isFirstPage = index === 0;
				return (
					<Page key={index} size="A4" orientation="landscape" style={styles.page}>
						<View>
							{isFirstPage && Header({ selectedVehicle: undefined, filters, reportName })}
							{HeaderRow(columns)}
							{Rows({ page, columns })}
						</View>
						{Footer({
							currentPage: index + 1,
							pagesTotal: paginatedArray.length,
							company_name: company_name,
							user_name: user_name,
						})}
					</Page>
				);
			})}
		</Document>
	);
}
