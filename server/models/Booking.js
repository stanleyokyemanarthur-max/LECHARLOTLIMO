import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      index: true,
    },

    carSnapshot: {
      name: String,
      type: String,
      pricePerMile: { type: Number, required: true },
      rateMultiplier: { type: Number, default: 1 },
      totalUnits: { type: Number, default: 1 },
      fleetKey: { type: String, required: true, index: true },
    },

    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },

    distance: { type: Number, required: true },

    totalPrice: { type: Number, default: null },
    pricingLocked: { type: Boolean, default: false },

    paymentStatus: {
      type: String,
      enum: [
        "unquoted",
        "quoted",
        "awaiting_payment",
        "processing",
        "paid",
        "failed",
        "refunded",
        "cancelled",
        "expired",
      ],
      default: "unquoted",
      index: true,
    },

    isPaid: { type: Boolean, default: false },

    fleetKey: {
      type: String,
      required: true,
      index: true,
    },

    freeReason: {
      type: String,
      enum: ["reward", "admin", null],
      default: null,
    },

    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "enroute", "completed", "cancelled", "expired"],
      default: "pending",
      index: true,
    },

    pickupDate: {
      type: Date,
      required: true,
      index: true,
    },

    dropoffDate: {
      type: Date,
      required: true, // 🔥 FIX: do NOT allow null (important for availability queries)
      index: true,
    },

    stripeSessionId: {
      type: String,
      default: null,
      index: true,
    },

    notificationFlags: {
      bookingConfirmedNotifiedUser: { type: Boolean, default: false },
      enrouteNotifiedUser: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

/**
 * 🔥 CRITICAL PERFORMANCE INDEX (THIS FIXES YOUR HANGING ISSUE)
 * Helps availability queries:
 * status + pickupDate + dropoffDate
 */
bookingSchema.index({
  status: 1,
  pickupDate: 1,
  dropoffDate: 1,
});

export default mongoose.model("Booking", bookingSchema);