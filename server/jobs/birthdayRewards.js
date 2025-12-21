import cron from "node-cron";
import User from "../models/User.js";
import Reward from "../models/Reward.js";

export const birthdayRewardJob = () => {
  console.log("🕒 Birthday reward cron registered");

  cron.schedule("0 0 * * *", async () => {
    try {
      const today = new Date();
      const month = today.getMonth();
      const day = today.getDate();
      const year = today.getFullYear();

      const users = await User.find({
        dateOfBirth: { $exists: true },
      });

      for (const user of users) {
        const dob = new Date(user.dateOfBirth);

        if (dob.getMonth() === month && dob.getDate() === day) {
          const reference = `birthday-${year}`;

          const exists = await Reward.exists({
            user: user._id,
            reference,
          });

          if (exists) continue;

          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7);

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
        }
      }

      console.log("🎉 Birthday rewards processed");
    } catch (err) {
      console.error("Birthday reward job failed:", err);
    }
  });
};
