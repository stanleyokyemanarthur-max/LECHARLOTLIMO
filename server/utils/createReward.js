import Reward from "../models/Reward.js";

export const createRewardForUser = async ({
  userId,
  milestone,
}) => {
  return Reward.create({
    user: userId,
    title: milestone.rewardTemplate.title,
    description: milestone.rewardTemplate.description,
    type: milestone.rewardTemplate.type,
    value: milestone.rewardTemplate.value,
    status: "AVAILABLE",
  });
};
