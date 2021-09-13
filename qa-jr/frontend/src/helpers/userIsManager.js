import { manager as MANAGER_ROLE_ID } from "constants/environment"
import { useSelector } from "react-redux";

export default () => {
	const {
		user: {
			role_id,
		}
	} = useSelector(state => state.auth);

	return MANAGER_ROLE_ID === role_id;
}
