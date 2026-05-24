import Milestone from "../models/Milestone.js";
import Reward from "../models/Reward.js";
import Booking from "../models/Booking.js";

/**
 * Evaluate milestones for a user
 * @param {Object} user - Mongoose User document
 * @param {Object} session - Optional mongoose session for transactions
 */
export async function evaluateMilestonesForUser(user, session = null) {
  if (!user) return;

  // Step 0: Check for queued rewards and unlock if no pending paid bookings
  const pendingPaidBooking = await Booking.exists({
    user: user._id,
    isPaid: true,
    status: { $in: ["pending", "confirmed","enroute"] },
  });

  if (!pendingPaidBooking) {
    await Reward.updateMany(
      { user: user._id, status: "QUEUED" },
      { status: "AVAILABLE" },
      { session }
    );
  }

  // Fetch active milestones
  const milestones = await Milestone.find({ isActive: true });

  for (const milestone of milestones) {
    let achieved = false;

    // Check milestone condition
    switch (milestone.triggerType) {
      case "RIDES":
        achieved = user.totalCompletedBookings >= milestone.threshold;
        break;
      case "SPEND":
        achieved = user.totalSpend >= milestone.threshold;
        break;
      case "BIRTHDAY":
        achieved = true; // example, or add birthday check
        break;
      default:
        achieved = false;
    }

    if (!achieved) continue;

    // Prevent duplicate rewards
    const reference = `milestone:${milestone._id}`;
    const alreadyRewarded = await Reward.findOne({ user: user._id, reference }).session(session);
    if (alreadyRewarded) continue;

    // Determine reward status
    const rewardStatus = pendingPaidBooking ? "QUEUED" : "AVAILABLE";

    // Create reward
    await Reward.create(
      [
        {
          user: user._id,
          source: "MILESTONE",
          reference,
          title: milestone.rewardTemplate.title,
          description: milestone.rewardTemplate.description,
          type: milestone.rewardTemplate.type,
          value: milestone.rewardTemplate.value,
          status: rewardStatus,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      ],
      { session }
    );

    console.log(
      rewardStatus === "QUEUED"
        ? `⏳ Milestone achieved but reward queued: ${milestone.name} for user ${user._id}`
        : `🎉 Milestone achieved and reward delivered: ${milestone.name} for user ${user._id}`
    );
  }
}
