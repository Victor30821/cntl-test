import { MAP } from 'constants/paths';
import { format } from "date-fns";

const redirectToMap = (data, history) => {
    if (!data?.id) return;
    data.id = data.vehicle_id;
    data.name = data.vehicle_name;
    const filter = {
      lat: data?.coords?.lat,
      lng: data?.coords?.lng,
      date: format(new Date(data?.date), "dd/MM/yyyy"),
      hour: format(new Date(data?.hour), "HH:mm"),
      vehicle: data,
      driver: {
        nickname: data?.driver_name,
      },
      vehicle_id: data.vehicle_id,
      hideGroups: data.hideGroups
    };
    data && history.push(MAP, { vehicle: { vehicle_id: data?.vehicle_id, vehicle_name: data?.vehicle_name, pointVehicle: filter } })
}

export default redirectToMap;