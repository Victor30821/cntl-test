import $ from "jquery";
import { setUrlParam } from "utils/params";

const resetFilters = (
  filtersToReset = ["vehicle_name", "address", "vehicle_id", "status", "groups"],
  setFilters,
  setSelectedGroups,
  onFilterVehicles
) => {
  $("#vehicle_name").val("");
  $("#address").val("");

  if (Array.isArray(filtersToReset)) {
    filtersToReset.forEach((filter) => {
      setUrlParam(filter);
    });
  }

  onFilterVehicles && onFilterVehicles({ text: "" });

  setFilters &&
    setFilters({
      status: false,
      groups: false,
      text: false,
    });

  setSelectedGroups && setSelectedGroups(false);
};

export default resetFilters;
