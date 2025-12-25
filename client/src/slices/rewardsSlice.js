import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as rewardsApi from "../api/rewards";

// Fetch user rewards
export const fetchRewards = createAsyncThunk(
  "rewards/fetchRewards",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.userInfo?.token;

      console.log("🎟️ TOKEN USED FOR REWARDS:", token);

      const res = await rewardsApi.fetchMyRewards(token);
      return res.data;
    } catch (err) {
      console.error("❌ fetchRewards failed:", err.response?.data);
      return rejectWithValue(err.response?.data || "Failed to load rewards");
    }
  }
);

// Lock reward for checkout
export const lockUserReward = createAsyncThunk(
  "rewards/lockUserReward",
  async (rewardId, { rejectWithValue }) => {
    try {
      const res = await rewardsApi.lockReward(rewardId);
      return res.data.reward;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to lock reward");
    }
  }
);

const rewardsSlice = createSlice({
  name: "rewards",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    selectedReward: null,
  },
  reducers: {
    clearSelectedReward: (state) => {
      state.selectedReward = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(lockUserReward.fulfilled, (state, action) => {
        state.selectedReward = action.payload;
        const index = state.items.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { clearSelectedReward } = rewardsSlice.actions;
export default rewardsSlice.reducer;
