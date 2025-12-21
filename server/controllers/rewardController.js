import Reward from "../models/Reward.js";

/**
 * GET /api/rewards/my
 * User rewards (nav + drawer)
 */
export const getMyRewards = async (req, res) => {
  const rewards = await Reward.find({
    user: req.user._id,
    status: "AVAILABLE",
    expiresAt: { $gt: new Date() },
  }).sort({ expiresAt: 1 });

  res.json(rewards);
};


/**
 * POST /api/rewards/:id/lock
 * Lock reward when user selects it in checkout
 */
export const lockReward = async (req, res) => {
  const reward = await Reward.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
      status: "AVAILABLE",
      expiresAt: { $gt: new Date() },
    },
    {
      status: "LOCKED",
      lockedAt: new Date(),
    },
    { new: true }
  );

  if (!reward) {
    return res.status(400).json({ message: "Reward not available" });
  }

  res.json({ success: true, reward });
};

