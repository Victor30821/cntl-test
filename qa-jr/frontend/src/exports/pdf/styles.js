import { StyleSheet, Font } from "@react-pdf/renderer";
const robotoFontUrl =
	"https://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf";
const robotoBoldFontUrl =
	"https://fonts.gstatic.com/s/roboto/v15/bdHGHleUa-ndQCOrdpfxfw.ttf";

Font.register({
	family: "Roboto",
	src: robotoFontUrl,
});
Font.register({
	family: "Roboto Bold",
	src: robotoBoldFontUrl,
});

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#fff",
		width: "100%",
		height: "100%",
		padding: "5%", 
		margin: "5%",
		justifyContent: "space-between"
	},
	table: {
		display: "table",
		width: "auto",
	},
	tableRow: {
		margin: "auto",
		flexDirection: "row",
	},
	tableCell: {
		fontSize: "8px",
        margin: "10 1"
	},
	tableCol: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	tableColHeader: {
		display: "flex",
        alignItems: "center",
        fontWeight: "10000",
        fontFamily: "Roboto Bold",
	},

	imgStyle: {
		width: "108",
		height: "28px",
		margin: "0 2%",
	},
	fontBoldHeader: {
		color: "#999999",
		fontFamily: "Roboto Bold",
		fontSize: "10px",
		fontStyle: "normal",
		fontWeight: "bolder",
	},
	fontDefaultHeader: {
		font: "Roboto",
		fontWeight: "400",
		fontSize: "10px",
	},
	flex: {
		display: "flex",
	},
	flexRow: {
		flexDirection: "row",
	},
	flexColumn: {
		flexDirection: "column",
	},
	justifyBetween: {
		justifyContent: "space-between",
	},
	justifyAround: {
		justifyContent: "space-between",
	},
	justifyCenter: {
		justifyContent: "center",
	},
	alignItems: {
		justifyContent: "center",
	},
	secondaryColor: {
		color: "#999999"
	}
});

export default styles;
