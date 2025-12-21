import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["freeRide", "discount"],
      required: true,
    },

    source: {
      type: String,
      enum: ["birthday", "milestone"],
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },

    status: {
      type: String,
      enum: ["AVAILABLE", "LOCKED", "QUEUED", "USED", "EXPIRED"],
      default: "AVAILABLE",
      index: true,
    },

    lockedAt: { type: Date, default: null },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    isSlotFull: { type: Boolean, default: false },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    reference: { type: String },

    value: { type: Number, default: 0 },
  },
  { timestamps: true }
);

rewardSchema.index({ user: 1, reference: 1 }, { unique: true });

export default mongoose.models.Reward ||
  mongoose.model("Reward", rewardSchema);
