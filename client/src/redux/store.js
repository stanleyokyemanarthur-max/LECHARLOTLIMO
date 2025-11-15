import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice.js";
import bookingReducer from "../slices/bookingSlice.js";
import { alertsReducer } from "./reducers/alertsReducer.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    alerts: alertsReducer,
  },
});

export default store;
