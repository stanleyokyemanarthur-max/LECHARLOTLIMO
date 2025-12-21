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
      name: String,
      type: String,
      pricePerMile: Number,
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
      enum: ["pending", "confirmed", "completed", "cancelled"],
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
    },
  },
  { timestamps: true }
);

/** 🚨 Guard against free bookings without rewards */
bookingSchema.pre("save", function (next) {
  if (!this.isPaid && !this.reward) {
    return next(
      new Error("Free bookings must be linked to a reward")
    );
  }
  next();
});

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
