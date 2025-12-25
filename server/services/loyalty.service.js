import Milestone from "../models/Milestone.js";
import Reward from "../models/Reward.js";

export async function evaluateMilestones(user) {
  const milestones = await Milestone.find({ isActive: true }).sort({ threshold: 1 });

  const today = new Date();
  const isBirthday =
    user.birthday &&
    today.getDate() === user.birthday.getDate() &&
    today.getMonth() === user.birthday.getMonth();

  for (const milestone of milestones) {
    let eligible = false;

    switch (milestone.triggerType) {
      case "RIDES":
        eligible = user.totalCompletedBookings >= milestone.threshold;
        break;

      case "SPEND":
        eligible = user.totalSpend >= milestone.threshold;
        break;

      case "BIRTHDAY":
        eligible = isBirthday;
        break;
    }

    if (!eligible) continue;

    const reference = `milestone-${milestone._id}`;

    const alreadyExists = await Reward.findOne({
      user: user._id,
      reference,
    });

    if (alreadyExists) continue;

    await Reward.create({
      user: user._id,
      source: "milestone",
      reference,
      type: milestone.rewardTemplate.type,
      title: milestone.rewardTemplate.title,
      description: milestone.rewardTemplate.description,
      value: milestone.rewardTemplate.value,
      status: "AVAILABLE",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }
}
