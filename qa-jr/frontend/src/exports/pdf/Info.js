import styles from "./styles";
import React from "react";
import { Text, View } from "@react-pdf/renderer";

const Info = ({ name, value, showDivisor = false, useSecondaryColor = false }) => {
	return (
		<View
			style={[
				styles.flex,
				styles.flexRow,
                { borderRight: showDivisor ? "2px solid #E5E5E5" : "none" },
                {marginRight: "10px", paddingRight: "10px"}
			]}
		>
			<Text style={styles.fontBoldHeader}>{name}: </Text>
			<Text style={[styles.fontDefaultHeader, (useSecondaryColor && styles.secondaryColor)]}>{value}</Text>
		</View>
	);
};

export default Info;
