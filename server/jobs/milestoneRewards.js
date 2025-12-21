import cron from "node-cron";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";

export const milestoneRewardJob = () => {
  console.log("🕒 Milestone reward cron registered");

  cron.schedule("0 */6 * * *", async () => {
    try {
      const pipeline = [
        {
          $match: {
            status: "completed",
            isPaid: true,
          },
        },
        {
          $group: {
            _id: "$user",
            total: { $sum: 1 },
          },
        },
      ];

      const results = await Booking.aggregate(pipeline);

      for (const row of results) {
        if (row.total % 10 !== 0) continue;

        const userId = row._id;
        const reference = `milestone-${userId}-${row.total}`;

        const exists = await Reward.exists({
          user: userId,
          reference,
        });

        if (exists) continue;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await Reward.create({
          user: userId,
          type: "freeRide",
          source: "milestone",
          title: `🎁 ${row.total} Rides Milestone`,
          description: `Thank you for booking ${row.total} rides with us! Enjoy a free ride.`,
          status: "AVAILABLE",
          reference,
          expiresAt,
        });
      }

      console.log("🏁 Milestone rewards processed");
    } catch (err) {
      console.error("Milestone reward job failed:", err);
    }
  });
};
