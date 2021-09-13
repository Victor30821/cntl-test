import { api } from "services/api";

const getLogisticById = async (id) => {
    const URL = `/logistics/v1/${id}`;

    try {
		const {
            data: {
                logistic
            }
        }= await api.get(URL);

        return logistic;
    } catch (err) {
        return {};
    }
}


export default getLogisticById;
