import api from "./api";

export const fetchAllRewards = (token) =>
  api.get("/admin/rewards", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
