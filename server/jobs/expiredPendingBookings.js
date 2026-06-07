import Booking from "../models/Booking.js";

export const expirePendingBookings = async () => {
  try {
    const cutoff = new Date(
      Date.now() - 10 * 60 * 1000
    );
const result = await Booking.updateMany(
  {
    status: "pending",
    paymentStatus: {
      $in: ["awaiting_payment", "processing"],
    },
    isPaid: false,
    createdAt: { $lt: cutoff },
  },
  {
    $set: {
      status: "expired",
      paymentStatus: "expired",
    },
  }
);
    if (result.modifiedCount > 0) {
      console.log(
        `🕒 Expired ${result.modifiedCount} stale bookings`
      );
    }
  } catch (err) {
    console.error(
      "❌ expirePendingBookings failed:",
      err
    );
  }
};