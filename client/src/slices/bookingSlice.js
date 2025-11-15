import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],       // existing bookings
    loading: false,
    error: null,
    // new fields for live reservation flow
    tripData: null,     // step 1: trip info
    selectedCar: null,  // step 2: selected car
    estimate: null,     // optional cost estimate
  },
  reducers: {
    // existing reducers
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    // 🔥 new reservation flow reducers
    setTripData: (state, action) => {
      state.tripData = action.payload;
    },
    clearTripData: (state) => {
      state.tripData = null;
    },
    setSelectedCar: (state, action) => {
      state.selectedCar = action.payload;
    },
    setEstimate: (state, action) => {
      state.estimate = action.payload;
    },
    resetBookingFlow: (state) => {
      state.tripData = null;
      state.selectedCar = null;
      state.estimate = null;
    },
  },
});

export const {
  setBookings,
  addBooking,
  setLoading,
  setError,
  setTripData,
  clearTripData,
  setSelectedCar,
  setEstimate,
  resetBookingFlow,
} = bookingSlice.actions;

export default bookingSlice.reducer;
