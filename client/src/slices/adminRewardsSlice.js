import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// =======================
// FETCH ALL ADMIN REWARDS
// =======================
export const fetchAdminRewards = createAsyncThunk(
  "adminRewards/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.userInfo?.token;
      const res = await axios.get("/api/admin/rewards", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure we always return an array
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load admin rewards");
    }
  }
);

// =======================
// UPDATE REWARD STATUS
// =======================
export const adminUpdateReward = createAsyncThunk(
  "adminRewards/update",
  async ({ id, action }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.userInfo?.token;

      const endpointMap = {
        unlock: `/api/admin/rewards/${id}/unlock`,
        used: `/api/admin/rewards/${id}/mark-used`,
        cancel: `/api/admin/rewards/${id}`,
      };

      const body = action === "cancel" ? { status: "CANCELLED" } : {};

      const res = await axios.patch(endpointMap[action], body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.reward; // single updated reward
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update reward");
    }
  }
);

// =======================
// SLICE
// =======================
const adminRewardsSlice = createSlice({
  name: "adminRewards",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    updatingId: null, // for UI disable during updates
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAdminRewards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminRewards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // already ensured to be array
      })
      .addCase(fetchAdminRewards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // UPDATE
      .addCase(adminUpdateReward.pending, (state, action) => {
        state.updatingId = action.meta.arg.id;
      })
      .addCase(adminUpdateReward.fulfilled, (state, action) => {
        state.updatingId = null;
        const idx = state.items.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(adminUpdateReward.rejected, (state) => {
        state.updatingId = null;
      });
  },
});

export default adminRewardsSlice.reducer;
