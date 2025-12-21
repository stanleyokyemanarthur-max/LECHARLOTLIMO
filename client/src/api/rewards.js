import api from "./api"; // your axios instance

export const fetchMyRewards = () => api.get("/rewards/my"); // ensure backend has this route
export const lockReward = (rewardId) => api.patch(`/rewards/${rewardId}/lock`);
