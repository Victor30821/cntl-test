import { compareAsc } from "date-fns";

const compareString = (a, b) => {
	if (!a) return 1;
	if (!b) return -1;

	if (Number.isFinite(Number(a)) && Number.isFinite(Number(b))) {
		return Number(a) - Number(b);
	}

	return String(a).trim().localeCompare(String(b).trim());
}

const compareNumber = (a, b) => {
	if (!a || !Number.isFinite(+a)) return 1;
	if (!b || !Number.isFinite(+b)) return -1;

	return +a - +b;
}

const compareNumberNullBefore = (a, b) => {
	if (!a || !Number.isFinite(+a)) return -1;
	if (!b || !Number.isFinite(+b)) return 1;

	return compareNumber(a, b);
}

const compareDate = (a, b) => {
	if (!a) return 1;
	if (!b) return -1;

	return compareAsc(new Date(a), new Date(b));
}

const compareBoolean = (a, b) => {
	if (a) return -1;
	return 1;
}

export default ({type, a, b}) => {
	const sortMethods = {
		text: () => compareString(a, b),
		distance: () => compareNumberNullBefore(a, b),
		boolean: () => compareBoolean(a, b),
		date: () => compareDate(a, b),
		cost: () => compareNumberNullBefore(a, b),
		time: () => compareDate(a, b),
		distancePerLiter: () => compareNumber(a, b),
		select: () => compareString(a, b),
		duration: () => compareNumberNullBefore(a, b),
		buttons: () => compareString(a, b),
		velocity: () => compareNumberNullBefore(a, b),
	}

	if (!sortMethods[type]) return 0;

	return sortMethods[type]();
}
