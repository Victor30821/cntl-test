import { useSelector } from "react-redux";

const statesWithFormLoading = [
    "vehicles",
    "users",
    "groups",
    "commands",
    "fuelSupplies",
    "fences",
    "drivers",
    "clients",
    "places",
    "logisticsServices",
]
const statesWithLoad = [
    "map",
]
export default () => {
    let loading = false;
    const formIsLoading = statesWithFormLoading
        .map(statesNames => {
            const {
                createLoading,
                editLoading,
            } = useSelector(state => state[statesNames]);
            return loading || editLoading || createLoading;
        })
        .some(isLoading => isLoading);

    const pageIsLoading = statesWithLoad
        .map(statesNames => {
            const {
                loadLoading,
            } = useSelector(state => state[statesNames]);
            return loading || loadLoading;
        })
        .some(isLoading => isLoading);

    return pageIsLoading || formIsLoading;
};
