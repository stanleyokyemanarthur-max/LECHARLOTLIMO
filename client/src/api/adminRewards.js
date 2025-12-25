import axios from "axios";

export const fetchAdminRewards = (token) =>
  axios.get("/api/admin/rewards", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
