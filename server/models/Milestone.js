import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    triggerType: {
      type: String,
      enum: ["RIDES", "SPEND", "BIRTHDAY"],
      required: true,
    },

    threshold: {
      type: Number, // e.g. 5 rides, 10 rides, ₵500 spend
      default: 0,
    },

    rewardTemplate: {
      title: String,
      description: String,
      type: {
        type: String,
        enum: ["freeRide", "voucher"],
      },
      value: Number, // voucher amount or freeRide value
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Milestone", milestoneSchema);
