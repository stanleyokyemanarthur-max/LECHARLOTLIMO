import axios from "axios";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import { getDistanceInMiles } from "../utils/getDistance.js";
import Reward from "../models/Reward.js";
import { evaluateMilestones } from "../utils/evaluateMilestones.js";

/* 
==============================
 🧾 CREATE BOOKING (user only)
==============================
*/
export const createBooking = async (req, res) => {
  try {
    const {
      car,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      rewardId,
    } = req.body;

    /* ======================
       BASIC VALIDATION
    ====================== */
    if (!car || !pickupLocation || !dropoffLocation || !pickupDate || !dropoffDate) {
      return res.status(400).json({ error: "All booking fields are required." });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.status(404).json({ error: "Car not found" });
    }

    /* ======================
       DISTANCE & PRICE
    ====================== */
    const distanceInMiles = await getDistanceInMiles(
      pickupLocation,
      dropoffLocation
    );

    let totalPrice = Math.max(distanceInMiles * carData.perMileRate, 20);
    let isPaid = true;
    let reward = null;

    /* ======================
       🎁 REWARD FLOW (SAFE)
    ====================== */
    if (rewardId) {
      // 1️⃣ Find reward
      reward = await Reward.findOne({
        _id: rewardId,
        user: req.user._id,
        status: "AVAILABLE",
        expiresAt: { $gt: new Date() },
      });

      if (!reward) {
        return res.status(400).json({
          error: "Invalid, expired, or unavailable reward",
        });
      }

      // 2️⃣ LOCK reward immediately (prevents double usage)
      reward.status = "LOCKED";
      reward.lockedAt = new Date();
      await reward.save();

      // 3️⃣ Admin rule: PAID rides take priority
      const paidBookingExists = await Booking.exists({
        pickupDate,
        isPaid: true,
        status: { $in: ["pending", "confirmed"] },
      });

      if (paidBookingExists) {
        reward.status = "QUEUED";
        reward.isSlotFull = true;
        reward.lockedAt = null;
        await reward.save();

        return res.status(409).json({
          error:
            "Paid booking already exists for this slot. Your free ride has been queued.",
        });
      }

      // 4️⃣ Free ride allowed
      isPaid = false;
      totalPrice = 0;
    }

    /* ======================
       DRIVER ASSIGNMENT
    ====================== */
    const defaultDriver = await User.findOne({ role: "driver" });

    /* ======================
       CREATE BOOKING
    ====================== */
    const booking = await Booking.create({
      user: req.user._id,
      driver: defaultDriver ? defaultDriver._id : null,
      car,
      carSnapshot: {
        name: carData.name,
        type: carData.type,
        pricePerMile: carData.perMileRate,
      },
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      distance: distanceInMiles,
      totalPrice,
      isPaid,
      reward: reward ? reward._id : null,
    });

    /* ======================
       LINK REWARD (NOT USED YET)
       ⚠️ Stripe webhook will
       finalize this
    ====================== */
    if (reward) {
      reward.booking = booking._id;
      await reward.save();
    }

    res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: err.message });
  }
};


/* 
==============================================
 📊 ESTIMATE BOOKING COST (for live frontend)
==============================================
*/
export const estimateBooking = async (req, res) => {
  try {
    const { pickup, dropoff, carId } = req.query;

    // ✅ Validation
    if (!pickup || !dropoff || !carId) {
      return res.status(400).json({ error: "pickup, dropoff, and carId are required" });
    }

    // ✅ Find car
    const carData = await Car.findById(carId);
    if (!carData) return res.status(404).json({ error: "Car not found" });

    /* 
     ✅ Use Google Maps API (more accurate than haversine)
     - This ensures same behavior as your old booking system
     - If API fails, fallback to your getDistanceInMiles() util
    */
    let distanceMiles = 0;
    let durationText = "";

    try {
      const googleRes = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
        params: {
          origins: pickup,
          destinations: dropoff,
          key: process.env.GOOGLE_MAPS_API_KEY,
          units: "imperial",
        },
      });

      const gData = googleRes.data;
      if (gData.status === "OK" && gData.rows[0].elements[0].status === "OK") {
        const distanceText = gData.rows[0].elements[0].distance.text; // "12.4 mi"
        distanceMiles = parseFloat(distanceText.replace(" mi", ""));
        durationText = gData.rows[0].elements[0].duration.text; // "25 mins"
      } else {
        // fallback to haversine method if Google fails
        distanceMiles = await getDistanceInMiles(pickup, dropoff);
      }
    } catch (apiErr) {
      console.warn("Google Maps API failed, fallback used:", apiErr.message);
      distanceMiles = await getDistanceInMiles(pickup, dropoff);
    }

    // ✅ Price calculation with minimum
    const totalPrice = Math.max(distanceMiles * carData.perMileRate, 20);

    // ✅ Respond
    res.json({
      distanceMiles,
      durationText,
      perMileRate: carData.perMileRate,
      totalPrice,
    });
  } catch (err) {
    console.error("Estimate booking error:", err);
    res.status(500).json({ error: "Failed to calculate booking estimate" });
  }
};


/* 
=============================
 🚗 DRIVER (or ADMIN): ALL BOOKINGS
=============================
*/
export const getDriverBookings = async (req, res) => {
  try {
    // Since there's only one driver (the client), return all bookings
    const bookings = await Booking.find().populate("user car");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* 
=============================
 👤 USER BOOKINGS (dashboard)
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
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("reward"); // added

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const prevStatus = booking.status;
    booking.status = req.body.status || booking.status;
    await booking.save();

    // 🎁 REWARD FINALIZATION
    if (booking.reward) {
      const reward = await Reward.findById(booking.reward);

      // ✅ Booking completed → reward USED
      if (prevStatus !== "COMPLETED" && booking.status === "COMPLETED") {
        reward.status = "USED";
        reward.usedAt = new Date();
        await reward.save();
      }

      // ❌ Booking cancelled → reward released
      if (booking.status === "CANCELLED") {
        reward.status = "AVAILABLE";
        reward.booking = null;
        reward.lockedAt = null;
        reward.isSlotFull = false;
        await reward.save();
      }
    }

    // 🎯 Milestones + birthday rewards
    if (prevStatus !== "COMPLETED" && booking.status === "COMPLETED") {
      const user = booking.user;

      user.totalRides = (user.totalRides || 0) + 1;
      user.totalSpend = (user.totalSpend || 0) + booking.totalPrice;
      await user.save();

      await evaluateMilestones({
        user,
        totalRides: user.totalRides,
        totalSpend: user.totalSpend,
        isBirthday:
          user.birthday &&
          new Date(user.birthday).toDateString() ===
            new Date().toDateString(),
      });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
