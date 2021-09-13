import React from "react";
import { Text, View } from "@react-pdf/renderer";
import styles from "./styles";
import Info from "./Info";
import { format } from "date-fns";
import { localizedStrings } from "constants/localizedStrings";

const Footer = ({ currentPage, pagesTotal, company_name, user_name }) => {
	const currentDate = format(new Date(), "dd/MM/yyyy HH:mm:ss");

	return (
		<View
			style={[
				styles.flex,
				styles.flexRow,
				styles.justifyBetween,
				{ borderTop: "1px solid #E5E5E5", padding: "11px" },
			]}
		>
			<View style={[styles.flex, styles.flexRow]}>
				<Info
					name={localizedStrings.author}
					value={user_name}
					showDivisor
					useSecondaryColor
				/>
				<Text
					style={[
						styles.fontDefaultHeader,
						styles.secondaryColor,
						{
							marginRight: "10px",
							borderRight: "1px solid #E5E5E5",
							paddingRight: "10px",
						},
					]}
				>
					{company_name}
				</Text>
				<Info
					name={localizedStrings.date}
					value={currentDate}
					showDivisor
					useSecondaryColor
				/>
			</View>
			<Text style={[styles.fontDefaultHeader, styles.secondaryColor]}>
				{localizedStrings.page} {currentPage} {localizedStrings.from}{" "}
				{pagesTotal}
			</Text>
		</View>
	);
};

export default Footer;
