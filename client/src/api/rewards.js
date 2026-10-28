import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// 👇 MUST SEND BEARER TOKEN
export const fetchMyRewards = (token) => {
  return API.get("/rewards/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const lockReward = (rewardId, token) => {
  return API.post(
    `/rewards/${rewardId}/lock`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
