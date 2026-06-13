// models/Car.js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },

    seats: { type: Number, required: true },
    transmission: { type: String, required: true },
    fuel: { type: String, required: true },
    speed: { type: String },

    // 🔥 KEEP ORIGINAL FIELD (source of truth)
    perMileRate: { type: Number, required: true, default: 5 },

    rateMultiplier: {
      type: Number,
      default: 1.0,
    },

    totalUnits: {
      type: Number,
      default: 1,
      min: 1,
    },

    fleetKey: {
      type: String,
      index: true,
      required: true,
    },

    description: { type: String, default: "" },

    image: { type: String, required: true },

    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);



// 🔥 IMPORTANT: normalize output for frontend/backend consistency
carSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.pricePerMile = ret.perMileRate; // 👈 critical fix
    return ret;
  },
});

carSchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.pricePerMile = ret.perMileRate;
    return ret;
  },
});

export default mongoose.model("Car", carSchema);