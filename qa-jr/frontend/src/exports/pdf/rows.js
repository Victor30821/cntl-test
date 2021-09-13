import React from "react";
import { Text, View } from "@react-pdf/renderer";
import styles from "./styles";
import getColumnWidth from "./getColumnWidth";

const getRowColor = (rowIndex) => (rowIndex % 2 ? "white" : "#F7F7F7");

const Rows = ({ page, columns }) => {
	return page.map((register, index) => {
		return (
			<View
				key={index}
				style={[
					styles.tableRow,
					{
						backgroundColor: getRowColor(index),
					},
				]}
			>
				{columns.map((column) => {
					return (
						<View
							key={column}
							style={[
								styles.tableCol,
								{
									width: `${getColumnWidth({
										columns,
										currentColumn: column,
									})}%`,
									maxHeight: "32px",
								},
							]}
						>
							<Text style={[styles.tableCell]}>
								{register[column]}
							</Text>
						</View>
					);
				})}
			</View>
		);
	});
};

export default Rows;
