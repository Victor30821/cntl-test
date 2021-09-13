import React from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import styles from "./styles";
import Logo from "assets/logo-4x.png";
import Info from "./Info";
import { format } from "date-fns";
import { localizedStrings } from "constants/localizedStrings";

const Header = ({ selectedVehicle, filters, reportName }) => {
	let dateFormat = "dd/MM/yyyy";

	let start_date = new Date(filters.start_date);
	let end_date = new Date(filters.end_date);

	const dateRegex = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/;
	const dateHasOnlyDays = filters.start_date.match(dateRegex) || filters.end_date.match(dateRegex);

	if (dateHasOnlyDays) {
		start_date = new Date(filters.start_date.split('-'));

		end_date = new Date (filters.end_date.split('-'));
	}

	if (!dateHasOnlyDays) {
		const startDateTimeIsDefault = format(start_date, "HH:mm:ss") === "00:00:00";
		const endDateTimeIsDefault = format(end_date, "HH:mm:ss") === "23:59:59";

		if (!startDateTimeIsDefault || !endDateTimeIsDefault) {
			dateFormat = "dd/MM/yyyy - HH:mm";
		}
	}

	return (
		<View
			style={{
				...styles.flex,
				...styles.flexRow,
				padding: "2%",
				borderBottom: "1px solid #E5E5E5",
			}}
		>
			<Image src={Logo} style={styles.imgStyle} />
			<View
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
				}}
			>
				<View style={[styles.flex, styles.flexRow]}>
					<Text
						style={[
							styles.fontDefaultHeader,
							{
								borderRight: "1px solid #E5E5E5",
								paddingRight: "10px",
								marginRight: "10px",
							},
						]}
					>
						{reportName}
					</Text>
					<Text style={styles.fontDefaultHeader}>
						{localizedStrings.from}{" "}
						{format(start_date, dateFormat)}{" "}
						{localizedStrings.until.toLowerCase()}{" "}
						{format(end_date, dateFormat)}{" "}
					</Text>
				</View>

				{selectedVehicle && <View style={[styles.flex, styles.flexRow]}>
					<Info
						name={localizedStrings.vehicleName}
						value={selectedVehicle.name}
						showDivisor
					/>
					<Info
						name={localizedStrings.vehicleType}
						value={selectedVehicle.vehicleType}
						showDivisor
					/>
					<Info name={localizedStrings.plateNumber} value={selectedVehicle.plate_number} />
				</View>}
			</View>
		</View>
	);
};

export default Header;
