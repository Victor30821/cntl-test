import { api } from "services/api";

const getDrivers = async () => {
	try {

		const URL = `/driver/v1/`;

		const {
			data: { drivers = [] },
		} = await api.get(URL);
        return drivers;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export default getDrivers;
