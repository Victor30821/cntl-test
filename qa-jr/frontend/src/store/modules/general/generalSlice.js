import { createSlice } from "@reduxjs/toolkit";

const generalSlice = createSlice({
	name: "general",
	initialState: {
    vehicleStatusReportAutoRefresh: true
  },
	reducers: {
		toggleVehicleStatusReportAutoRefresh(state) {
			state.vehicleStatusReportAutoRefresh = !state.vehicleStatusReportAutoRefresh;
		},
	},
});

const { toggleVehicleStatusReportAutoRefresh } = generalSlice.actions;

export { toggleVehicleStatusReportAutoRefresh };
export default generalSlice.reducer;
