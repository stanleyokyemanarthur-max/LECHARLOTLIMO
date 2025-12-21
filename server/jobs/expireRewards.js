import cron from "node-cron";
import Reward from "../models/Reward.js";

export const expireRewardsJob = () => {
  console.log("🕒 Reward expiration cron registered");

  cron.schedule("0 1 * * *", async () => {
    // Runs daily at 1:00 AM
    try {
      const now = new Date();

      const result = await Reward.updateMany(
        {
          status: { $in: ["AVAILABLE", "LOCKED", "QUEUED"] },
          expiresAt: { $lt: now },
        },
        {
          $set: {
            status: "EXPIRED",
            booking: null,
            isSlotFull: false,
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`⏰ ${result.modifiedCount} rewards expired`);
      } else {
        console.log("⏰ No rewards to expire");
      }
    } catch (err) {
      console.error("Reward expiration job failed:", err);
    }
  });
};
