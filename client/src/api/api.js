import axios from "axios";
import { API_BASE_URL } from "../config/api";
import reducer from "../slices/rewardsSlice"; // adjust path if needed

const api = axios.create({
  baseURL: API_BASE_URL,
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
