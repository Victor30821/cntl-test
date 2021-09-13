import { api } from "services/api";

const loadQuestions = async () => {
	try {
		const URL = `/checklist/v1/questions`;
		const {
			data: { questions },
		} = await api.get(URL);

		return questions;
	} catch (error) {
		console.log(error);
		return {};
	}
};

export default loadQuestions;

