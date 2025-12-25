import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice.js";
import bookingReducer from "../slices/bookingSlice.js";
import { alertsReducer } from "./reducers/alertsReducer.js";
import rewardsReducer from "../slices/rewardsSlice.js"
import adminrewardsReducer from "../slices/adminRewardsSlice.js"

const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    alerts: alertsReducer,
    rewards: rewardsReducer,
    adminRewards: adminrewardsReducer
  },
});

export default store;
