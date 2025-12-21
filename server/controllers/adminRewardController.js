import Reward from "../models/Reward.js";
import User from "../models/User.js";

/**
 * GET /api/admin/rewards
 * Admin: view all rewards (with user + booking info)
 */
export const adminGetAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find()
      .populate("user", "name email role") // get user info
      .populate("user", "name email phone")
      .populate("booking", "status createdAt")
      .sort({ createdAt: -1 });

    res.json(rewards);
  } catch (error) {
    console.error("❌ Admin fetch rewards error:", error);
    res.status(500).json({ message: "Failed to load rewards" });
  }
};
/**
 * PATCH /api/admin/rewards/:id
 * Update reward status
 */
export const adminUpdateRewardStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    reward.status = status;
    await reward.save();

    res.json({ message: "Reward updated", reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update reward" });
  }
};
// 🔓 Unlock QUEUED reward
export const adminUnlockReward = async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  if (!reward) return res.status(404).json({ message: "Reward not found" });

  if (reward.status !== "QUEUED") {
    return res.status(400).json({ message: "Only QUEUED rewards can be unlocked" });
  }

  reward.status = "AVAILABLE";
  reward.isSlotFull = false;
  reward.lockedAt = null;
  reward.booking = null;

  await reward.save();
  res.json({ message: "Reward unlocked", reward });
};

// ✅ Mark LOCKED reward as USED
export const adminMarkRewardUsed = async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  if (!reward) return res.status(404).json({ message: "Reward not found" });

  if (reward.status !== "LOCKED") {
    return res.status(400).json({ message: "Only LOCKED rewards can be marked USED" });
  }

  reward.status = "USED";
  reward.usedAt = new Date();

  await reward.save();
  res.json({ message: "Reward marked as used", reward });
};
