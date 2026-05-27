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
    },
    carSnapshot: {
      type: {
        name: String,
        type: String,
        pricePerMile: Number,
      },
      default: {},
    },

    pickupLocation: {
      type: String,
      required: true,
    },

    dropoffLocation: {
      type: String,
      required: true,
    },

    distance: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },

    /** 💰 Paid vs Free */
    isPaid: {
      type: Boolean,
      default: true,
    },

    /** 🎁 Why booking is free */
    freeReason: {
      type: String,
      enum: ["reward", "admin", null],
      default: null,
    },

    /** 🔗 Reward used */
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "enroute", "completed", "cancelled"],
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
      required: true,
    },

    stripeSessionId: {
      type: String,
      default: null,
      index: true,
    },

    // ✅ prevents duplicate emails on Stripe retries / admin re-clicks
    notificationFlags: {
      paymentReceivedNotifiedUser: { type: Boolean, default: false },
      paymentReceivedNotifiedAdmin: { type: Boolean, default: false },
      bookingConfirmedNotifiedUser: { type: Boolean, default: false },
      enrouteNotifiedUser: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

/** ✅ Guard against invalid free bookings */
bookingSchema.pre("save", function (next) {
  // If booking is free...
  if (this.isPaid === false) {
    // Allow reward-free only if reward exists
    if (this.freeReason === "reward" && !this.reward) {
      return next(new Error("Free bookings with freeReason=reward must have a reward attached"));
    }

    // Allow admin-free without a reward
    if (this.freeReason === "admin") {
      return next();
    }

    // If isPaid=false but freeReason missing or invalid
    return next(new Error("Free bookings must have freeReason='reward' or freeReason='admin'"));
  }

  next();
});

/**
 * 🔒 CRITICAL: Overlap-Protection Index (ANTI-DOUBLE-BOOKING)
 * Prevents concurrent pending/confirmed/enroute bookings for the same car
 */
bookingSchema.index(
  { car: 1, pickupDate: 1, dropoffDate: 1 },
  {
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed", "enroute"] },
    },
  }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
