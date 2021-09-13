import React from "react";
import tableColumns from "./tableColumns";
import styles from "./styles";
import { Text, View } from "@react-pdf/renderer";
import getColumnWidth from "./getColumnWidth";

const HeaderCols = (columns = []) => {
	return (
		<View style={styles.table}>
			<View style={styles.tableRow}>
				{columns.map((column) => {
					return (
						<View 
							key={column}
							style={[
								styles.tableColHeader,
								{
									width: `${getColumnWidth({
										columns,
										currentColumn: column,
									})}%`,
								},
							]}
						>
							<Text style={styles.tableCell}>
								{tableColumns[column]?.text || ""}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
};

export default HeaderCols;
