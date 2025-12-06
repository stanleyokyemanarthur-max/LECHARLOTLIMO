// slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Load from localStorage
const storedToken = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user") || "null");

export const fetchUserFromToken = createAsyncThunk(
  "auth/fetchUserFromToken",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) return rejectWithValue("No token provided");

      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Failed to fetch user");
      // server sends { user: {...} }
      return { user: data.user, token };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  token: storedToken || null,
  userInfo: storedUser || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.token = token;
      state.userInfo = user;
      state.status = "succeeded";
      state.error = null;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => { state.error = null; },
  },
  // slices/authSlice.js (extraReducers)
extraReducers: (builder) => {
  builder
    .addCase(fetchUserFromToken.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchUserFromToken.fulfilled, (state, action) => {
      state.status = "succeeded";
      // action.payload should be user object (e.g. { _id, name, email, role })
      state.userInfo = action.payload;
      // keep previously stored token if present (localStorage), otherwise null
      state.token = state.token || localStorage.getItem("token");
      localStorage.setItem("user", JSON.stringify(action.payload));
    })
    .addCase(fetchUserFromToken.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Failed to fetch user";
      // if fetch fails, clear userInfo to force login
      state.userInfo = null;
    });
},

});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
