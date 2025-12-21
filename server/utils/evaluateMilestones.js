import Milestone from "../models/Milestone.js";
import Reward from "../models/Reward.js";
import { createRewardForUser } from "./createReward.js";

export const evaluateMilestones = async ({
  user,
  totalRides,
  totalSpend,
  isBirthday,
}) => {
  const milestones = await Milestone.find({ isActive: true });

  for (const milestone of milestones) {
    let achieved = false;

    if (
      milestone.triggerType === "RIDES" &&
      totalRides >= milestone.threshold
    ) {
      achieved = true;
    }

    if (
      milestone.triggerType === "SPEND" &&
      totalSpend >= milestone.threshold
    ) {
      achieved = true;
    }

    if (
      milestone.triggerType === "BIRTHDAY" &&
      isBirthday
    ) {
      achieved = true;
    }

    if (!achieved) continue;

    // 🔒 Prevent duplicate rewards
    const alreadyGranted = await Reward.findOne({
      user: user._id,
      title: milestone.rewardTemplate.title,
    });

    if (alreadyGranted) continue;

    await createRewardForUser({
      userId: user._id,
      milestone,
    });
  }
};
