import axios from "axios";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import Reward from "../models/Reward.js";
import { getDistanceInMiles } from "../utils/getDistance.js";
import { evaluateMilestonesForUser } from "../services/milestone.service.js";
import mongoose from "mongoose";

/* 
==============================
 🧾 CREATE BOOKING (user only)
==============================
*/

export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { car, pickupLocation, dropoffLocation, pickupDate, dropoffDate, rewardId } = req.body;

    if (!car || !pickupLocation || !dropoffLocation || !pickupDate || !dropoffDate) {
      return res.status(400).json({ error: "All booking fields are required." });
    }

    const carData = await Car.findById(car);
    if (!carData) return res.status(404).json({ error: "Car not found" });

    const distanceInMiles = await getDistanceInMiles(pickupLocation, dropoffLocation);
    let totalPrice = Math.max(distanceInMiles * carData.perMileRate, 20);
    let isPaid = true;
    let reward = null;

    if (rewardId) {
      reward = await Reward.findOne({
        _id: rewardId,
        user: req.user._id,
        status: "AVAILABLE",
        expiresAt: { $gt: new Date() },
      });

      if (!reward) return res.status(400).json({ error: "Invalid or unavailable reward" });

      isPaid = false;
      totalPrice = 0;
    }

    const defaultDriver = await User.findOne({ role: "driver" });

    await session.withTransaction(async () => {
      const overlap = await Booking.findOne({
        car,
        status: { $in: ["pending", "confirmed"] },
        pickupDate: { $lt: new Date(dropoffDate) },
        dropoffDate: { $gt: new Date(pickupDate) },
      }).session(session);

      if (overlap) throw new Error("Car already booked for this time range");

      const [booking] = await Booking.create(
        [
          {
            user: req.user._id,
            driver: defaultDriver?._id || null,
            car,
            carSnapshot: { name: carData.name, type: carData.type, pricePerMile: carData.perMileRate },
            pickupLocation,
            dropoffLocation,
            pickupDate,
            dropoffDate,
            distance: distanceInMiles,
            totalPrice,
            isPaid,
            reward: reward?._id || null,
            status: "pending",
          },
        ],
        { session }
      );

      if (reward) {
        reward.status = "LOCKED";
        reward.lockedAt = new Date();
        reward.booking = booking._id;
        await reward.save({ session });
      }
    });

    res.status(201).json({ message: "Booking created successfully" });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(409).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

/* 
==============================================
 📊 ESTIMATE BOOKING COST (for frontend)
==============================================
*/
export const estimateBooking = async (req, res) => {
  try {
    const { pickup, dropoff, carId } = req.query;
    if (!pickup || !dropoff || !carId)
      return res.status(400).json({ error: "pickup, dropoff, and carId are required" });

    const carData = await Car.findById(carId);
    if (!carData) return res.status(404).json({ error: "Car not found" });

    let distanceMiles = 0;
    let durationText = "";

    try {
      const googleRes = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
        params: { origins: pickup, destinations: dropoff, key: process.env.GOOGLE_MAPS_API_KEY, units: "imperial" },
      });

      const gData = googleRes.data;
      if (gData.status === "OK" && gData.rows[0].elements[0].status === "OK") {
        const distanceText = gData.rows[0].elements[0].distance.text;
        distanceMiles = parseFloat(distanceText.replace(" mi", ""));
        durationText = gData.rows[0].elements[0].duration.text;
      } else {
        distanceMiles = await getDistanceInMiles(pickup, dropoff);
      }
    } catch {
      distanceMiles = await getDistanceInMiles(pickup, dropoff);
    }

    const totalPrice = Math.max(distanceMiles * carData.perMileRate, 20);

    res.json({ distanceMiles, durationText, perMileRate: carData.perMileRate, totalPrice });
  } catch (err) {
    console.error("Estimate booking error:", err);
    res.status(500).json({ error: "Failed to calculate booking estimate" });
  }
};

/* 
=============================
 🚗 DRIVER/ADMIN: ALL BOOKINGS
=============================
*/
export const getDriverBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user car");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 
=============================
 👤 USER BOOKINGS
=============================
*/
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("car");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 
=============================
 🛠️ ADMIN: ALL BOOKINGS
=============================
*/
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user car");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 
=============================
 🔄 UPDATE BOOKING STATUS
=============================
*/
export const updateBookingStatus = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("reward")
      .session(session);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    await session.withTransaction(async () => {
      const prevStatus = booking.status;
      const newStatus = req.body.status || booking.status;
      booking.status = newStatus;
      await booking.save({ session });

      if (booking.reward) {
        const reward = await Reward.findById(booking.reward).session(session);
        if (prevStatus !== "completed" && newStatus === "completed") {
          reward.status = "USED";
          reward.usedAt = new Date();
          await reward.save({ session });
        }

        if (newStatus === "cancelled") {
          reward.status = "AVAILABLE";
          reward.booking = null;
          reward.lockedAt = null;
          reward.isSlotFull = false;
          await reward.save({ session });
        }
      }

      if (prevStatus !== "completed" && newStatus === "completed" && booking.isPaid) {
        await User.updateOne(
          { _id: booking.user._id },
          { $inc: { totalCompletedBookings: 1, totalSpend: booking.totalPrice } },
          { session }
        );

        const pendingPaid = await Booking.exists({
          user: booking.user._id,
          isPaid: true,
          status: { $in: ["pending", "confirmed"] },
          _id: { $ne: booking._id },
        }).session(session);

        if (!pendingPaid) await evaluateMilestonesForUser(booking.user, session);
      }
    });

    res.json(booking);
  } catch (err) {
    console.error("Update booking status error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

/* 
=============================
 ❌ CANCEL BOOKING
=============================
*/
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
