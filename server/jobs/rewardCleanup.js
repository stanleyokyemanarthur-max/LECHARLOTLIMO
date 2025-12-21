// server/jobs/rewardCleanup.js
import cron from "node-cron";
import Reward from "../models/Reward.js";

export const rewardCleanupJob = () => {
  // 🔓 Release stale LOCKED rewards every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    try {
      const result = await Reward.updateMany(
        {
          status: "LOCKED",
          lockedAt: { $lt: new Date(Date.now() - 15 * 60 * 1000) }, // 15 min
        },
        {
          status: "AVAILABLE",
          lockedAt: null,
          booking: null,
          isSlotFull: false,
        }
      );
      if (result.modifiedCount > 0) {
        console.log(`🔓 Released ${result.modifiedCount} stale rewards`);
      }
    } catch (err) {
      console.error("❌ Reward stale unlock failed:", err);
    }
  });

  // ⏰ Expire rewards past their expiration date daily at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      const expiredRewards = await Reward.updateMany(
        { expiresAt: { $lt: now }, status: { $ne: "USED" } },
        { status: "EXPIRED" }
      );
      if (expiredRewards.modifiedCount > 0) {
        console.log(`⏳ Expired ${expiredRewards.modifiedCount} rewards`);
      }
    } catch (err) {
      console.error("❌ Reward expiry failed:", err);
    }
  });

  console.log("✅ Reward cleanup job started");
};
