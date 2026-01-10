import axios from "axios";
import reducer from "../slices/rewardsSlice"; // adjust path if needed

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://lecharlotlimo.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.userInfo?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
