import storage from "redux-persist/lib/storage";

const getSelectedColumns = async ({
	reportName = "",
}) => {
	const rawTablesSettings = await storage.getItem("@tablesSettings");
	const tablesSettings = JSON.parse(rawTablesSettings);
	const routesTablesSettings = tablesSettings[reportName];
	const columnsToShow = Object.keys(
		Object.fromEntries(
			Object.entries(routesTablesSettings).filter(
				(column) => column[1] === true
			)
		)
	);;
    return columnsToShow.filter(column => column !== "actions");
};

export default getSelectedColumns;
