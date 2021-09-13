import tableColumns from "./tableColumns";
const DEFAULT_WEIGHT = 1;

const getColumnWidth = ({ columns, currentColumn }) => {
	const totalWeight = columns.reduce(
		(acc, column) =>
			(acc += tableColumns[column]?.weight || DEFAULT_WEIGHT),
		0
	);
	const widthPercentage =
		((tableColumns[currentColumn]?.weight || DEFAULT_WEIGHT) /
			totalWeight) *
		100;
	return widthPercentage;
};

export default getColumnWidth;
