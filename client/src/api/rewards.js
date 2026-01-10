import axios from "axios";

const API = axios.create({
  baseURL: "https://lecharlotlimo.onrender.com/api",
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
