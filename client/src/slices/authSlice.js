// slices/authSlice.js
import { API_ORIGIN } from "../config/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeAuthUser } from "../utils/authSession";

// Load from localStorage
const storedToken = localStorage.getItem("token");
const storedUser = normalizeAuthUser(
  JSON.parse(localStorage.getItem("user") || "null"),
);

export const fetchUserFromToken = createAsyncThunk(
  "auth/fetchUserFromToken",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) return rejectWithValue("No token provided");

      const res = await fetch(`${API_ORIGIN}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      const normalizedUser = normalizeAuthUser(user);

      state.token = token;
      state.userInfo = normalizedUser;
      state.status = "succeeded";
      state.error = null;

      if (token) localStorage.setItem("token", token);
      if (normalizedUser) {
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      }
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFromToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserFromToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = normalizeAuthUser(action.payload.user);
        state.token = action.payload.token;

        localStorage.setItem(
          "user",
          JSON.stringify(state.userInfo),
        );
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(fetchUserFromToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch user";
        state.userInfo = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
