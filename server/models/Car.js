// models/Car.js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Mercedes-Benz Sprinter"
    type: { type: String, required: true }, // e.g. "Luxury Van" or "SUV"

    seats: { type: Number, required: true },
    transmission: { type: String, required: true }, // "Automatic" or "Manual"
    fuel: { type: String, required: true }, // "Diesel", "Petrol", etc.
    speed: { type: String }, // optional (e.g. "120 mph")
    perMileRate: { type: Number, required: true, default: 5 },

    // ✅ Optional description field
    description: { type: String, default: "" },

    // ✅ Cloudinary URL
    image: { type: String, required: true },

    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
