import Reward from "../models/Reward.js";


//  * GET /api/rewards/my
//  * Return user rewards (nav + drawer)
 
export const getMyRewards = async (req, res) => {
  try {
    const user = req.user;

    // 🎂 Birthday check (UTC-safe)
    if (user.birthday) {
      const today = new Date();
      const dob = new Date(user.birthday);

      const isBirthdayToday =
        today.getUTCDate() === dob.getUTCDate() &&
        today.getUTCMonth() === dob.getUTCMonth();

      if (isBirthdayToday) {
        const year = today.getUTCFullYear();
        const reference = `birthday-${year}`;

        const exists = await Reward.exists({
          user: user._id,
          reference,
        });

        if (!exists) {
          const expiresAt = new Date();
          expiresAt.setUTCDate(expiresAt.getUTCDate() + 7);

          await Reward.create({
            user: user._id,
            type: "freeRide",
            source: "birthday",
            title: "🎂 Birthday Free Ride",
            description: "Happy Birthday! Enjoy a free luxury ride.",
            status: "AVAILABLE",
            reference,
            expiresAt,
          });
          console.log("🎁 Birthday reward created for", user.email);
        }
      }
    }

    // 🎁 Return all available rewards
    const rewards = await Reward.find({
      user: user._id,
      status: { $in: ["AVAILABLE", "LOCKED"] },
      expiresAt: { $gt: new Date() },
    }).sort({ expiresAt: 1 });

    res.json(rewards);
  } catch (err) {
    console.error("❌ getMyRewards failed:", err);
    res.status(500).json({ message: "Failed to load rewards" });
  }
};

/**
 * POST /api/rewards/:id/lock
 * Lock reward when user selects it in checkout
 */
export const lockReward = async (req, res) => {
  try {
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

    if (!reward) return res.status(400).json({ message: "Reward not available" });

    res.json({ success: true, reward });
  } catch (err) {
    console.error("❌ lockReward failed:", err);
    res.status(500).json({ message: "Failed to lock reward" });
  }
};
