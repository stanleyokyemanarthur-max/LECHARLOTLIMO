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
      type: Number, // e.g. 10 rides
      default: 0,
    },

    rewardTemplate: {
      title: { type: String, required: true },
      description: { type: String, default: "" },
      type: {
        type: String,
        enum: ["freeRide", "voucher"],
        required: true,
      },
      value: { type: Number, default: 0 },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Milestone", milestoneSchema);
