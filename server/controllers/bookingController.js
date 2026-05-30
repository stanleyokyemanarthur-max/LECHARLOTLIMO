import axios from "axios";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import Reward from "../models/Reward.js";
import { getDistanceInMiles } from "../utils/getDistance.js";
import { evaluateMilestonesForUser } from "../services/milestone.service.js";
import mongoose from "mongoose";
import { sendEmail } from "../lib/sendEmail.js"; // ✅ adjust path if needed

/* 
==============================
 🧾 CREATE BOOKING (user only)
==============================
*/

export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();

  // shared variables (IMPORTANT FIX: scope safety)
  let createdBooking;
  let carData;
  let distance;
  let totalPrice;
  let isPaid = true; // default to true, set to false if reward is applied

  try {
    const {
      car,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      rewardId,
    } = req.body;

    /* =========================
       VALIDATION
    ========================== */
    if (!car || !pickupLocation || !dropoffLocation || !pickupDate || !dropoffDate) {
      return res.status(400).json({ error: "All booking fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(car)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ error: "Invalid booking dates." });
    }

    await session.withTransaction(async () => {

      /* =========================
         FETCH CAR
      ========================== */
      carData = await Car.findById(car).session(session);
      if (!carData) throw new Error("CAR_NOT_FOUND");

      /* =========================
         OVERLAP CHECK
      ========================== */
      const overlap = await Booking.findOne({
        car,
        status: { $in: ["pending", "confirmed", "enroute"] },
        pickupDate: { $lt: end },
        dropoffDate: { $gt: start },
      }).session(session);

      if (overlap) throw new Error("CAR_UNAVAILABLE");

      /* =========================
         DISTANCE
      ========================== */
      distance = await getDistanceInMiles(pickupLocation, dropoffLocation);

      if (typeof distance !== "number" || isNaN(distance) || distance <= 0) {
        throw new Error("INVALID_DISTANCE");
      }

      totalPrice = Math.max(distance * carData.perMileRate, 20);

      /* =========================
         REWARD
      ========================== */
      let reward = null;
      
      if (rewardId) {
        reward = await Reward.findOne({
          _id: rewardId,
          user: req.user._id,
          status: "AVAILABLE",
          expiresAt: { $gt: new Date() },
        }).session(session);

        if (!reward) throw new Error("INVALID_REWARD");

        isPaid = false;
        totalPrice = 0;
      }

      /* =========================
         DRIVER
      ========================== */
      const driver = await User.findOne({
        role: "driver",
        status: "active",
      }).session(session);

      /* =========================
         CREATE BOOKING
      ========================== */
      const [booking] = await Booking.create(
        [
          {
            user: req.user._id,
            driver: driver?._id || null,
            car,
            carSnapshot: {
              name: carData.name,
              type: carData.type,
              pricePerMile: carData.perMileRate,
            },
            pickupLocation,
            dropoffLocation,
            pickupDate: start,
            dropoffDate: end,
            distance,
            totalPrice,
            isPaid,
            reward: reward?._id || null,
            status: "pending",
            paymentStatus: "awaiting_payment",
          },
        ],
        { session }
      );

      createdBooking = booking;

      /* =========================
         LOCK REWARD
      ========================== */
      if (reward) {
        const updatedReward = await Reward.findOneAndUpdate(
          {
            _id: reward._id,
            status: "AVAILABLE",
          },
          {
            $set: {
              status: "LOCKED",
              booking: booking._id,
              lockedAt: new Date(),
            },
          },
          { session, new: true }
        );

        if (!updatedReward) throw new Error("INVALID_REWARD");
      }
    });

    /* =========================
       SAFETY CHECK (POST TX)
    ========================== */
    if (!createdBooking) {
      return res.status(500).json({ error: "Booking creation failed" });
    }



    return res.status(201).json({
      message: "Booking created successfully",
      booking: createdBooking,
    });

  } catch (err) {
    console.error(err);

    const map = {
      CAR_UNAVAILABLE: 409,
      INVALID_REWARD: 400,
      CAR_NOT_FOUND: 404,
      INVALID_DISTANCE: 400,
    };

    return res.status(map[err.message] || 500).json({
      error: err.message,
    });

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
 🚗 DRIVER: MY BOOKINGS ONLY (FIXED)
=============================
*/
export const getDriverBookings = async (req, res) => {
  try {
    // ✅ Security: driver sees only assigned bookings
    const bookings = await Booking.find({ driver: req.user._id }).populate("user car driver");
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
    const bookings = await Booking.find().populate("user car").populate("driver", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 
=============================
 🚘 GET AVAILABLE CARS
=============================
*/
// export const getAvailableCars = async (req, res) => {
//   try {
//     const { pickupDate, dropoffDate } = req.query;

//     if (!pickupDate || !dropoffDate) {
//       return res.status(400).json({
//         error: "pickupDate and dropoffDate are required",
//       });
//     }


//     const overlappingBookings = await Booking.find({
//       status: { $in: ["pending", "confirmed", "enroute"] },

//       pickupDate: {
//         $lt: new Date(dropoffDate),
//       },

//       dropoffDate: {
//         $gt: new Date(pickupDate),
//       },
//     }).select("car");


//     const bookedCarIds = overlappingBookings.map((b) =>
//       b.car.toString()
//     );


//     const availableCars = await Car.find({
//       _id: { $nin: bookedCarIds },
//     });

//     res.json(availableCars);
//   } catch (err) {
//     console.error("Get available cars error:", err);
//     res.status(500).json({
//       error: "Failed to fetch available cars",
//     });
//   }
// };

// ✅ ADMIN: assign a driver to a booking

export const assignDriver = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { driverId } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("car")
      .session(session);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (driverId === null || driverId === "null" || driverId === "") {
      await session.withTransaction(async () => {
        booking.driver = null;
        await booking.save({ session });
      });

      const updated = await Booking.findById(booking._id)
        .populate("user")
        .populate("car")
        .populate("driver", "name email");

      return res.json(updated);
    }


    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ error: "Invalid driverId" });
    }

    const driver = await User.findById(driverId).select("name email role status");
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    if (driver.role !== "driver") return res.status(400).json({ error: "User is not a driver" });
    if (driver.status !== "active") return res.status(400).json({ error: "Driver is not active" });

    await session.withTransaction(async () => {
      booking.driver = driver._id;
      await booking.save({ session });
    });

    const updated = await Booking.findById(booking._id)
      .populate("user")
      .populate("car")
      .populate("driver", "name email");

    res.json(updated);
  } catch (err) {
    console.error("Assign driver error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

/* 
=============================
 🔄 UPDATE BOOKING STATUS (ADMIN)
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

    const requestedStatus = req.body.status || booking.status;

    // ✅ BACKEND GUARD: cannot confirm/enroute unpaid bookings (unless free/reward/admin-free)
    const requiresPayment = booking.isPaid === true; // paid bookings
    const isPaidInSystem = booking.paymentStatus === "paid";
    const isFreeBooking = booking.isPaid === false;

    if (
      ["confirmed", "enroute"].includes(requestedStatus) &&
      requiresPayment &&
      !isPaidInSystem &&
      !isFreeBooking
    ) {
      return res.status(400).json({
        error: "Cannot confirm/enroute a booking before payment is completed.",
      });
    }

    let prevStatus;
    let newStatus;

    await session.withTransaction(async () => {
      prevStatus = booking.status;
      newStatus = requestedStatus;

      booking.status = newStatus;

      // ✅ ensure flags object exists
      if (!booking.notificationFlags) booking.notificationFlags = {};

      await booking.save({ session });

      // 🎁 Reward handling
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

      // 📈 Milestones / spend update on completed paid booking
      if (prevStatus !== "completed" && newStatus === "completed" && booking.isPaid) {
        await User.updateOne(
          { _id: booking.user._id },
          { $inc: { totalCompletedBookings: 1, totalSpend: booking.totalPrice } },
          { session }
        );

        const pendingPaid = await Booking.exists({
          user: booking.user._id,
          isPaid: true,
          status: { $in: ["pending", "confirmed", "enroute"] },
          _id: { $ne: booking._id },
        }).session(session);

        if (!pendingPaid) await evaluateMilestonesForUser(booking.user, session);
      }
    });

    // =========================
    // ✉️ EMAIL NOTIFICATIONS (outside transaction)
    // =========================
    try {
      const userEmail = booking.user?.email;

      // ✅ make sure flags exist on the doc in memory
      if (!booking.notificationFlags) booking.notificationFlags = {};

      // ✅ Booking confirmed email (SEND ONCE EVER)
      if (
        userEmail &&
        newStatus === "confirmed" &&
        booking.notificationFlags.bookingConfirmedNotifiedUser !== true
      ) {
        await sendEmail({
          to: userEmail,
          subject: "Booking confirmed — Le Charlot Limousine",
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
              <h2 style="margin:0 0 8px;">Booking confirmed</h2>
              <p style="margin:0 0 16px;">
                Your booking <b>${booking._id}</b> has been confirmed.
              </p>
              <div style="padding:12px 14px;border:1px solid #eee;border-radius:10px;">
                <p style="margin:0;"><b>Pickup:</b> ${booking.pickupLocation}</p>
                <p style="margin:0;"><b>Drop-off:</b> ${booking.dropoffLocation}</p>
                <p style="margin:0;"><b>Pickup time:</b> ${new Date(booking.pickupDate).toLocaleString()}</p>
              </div>
              <p style="margin:16px 0 0;">Le Charlot Limousine</p>
            </div>
          `,
        });

        booking.notificationFlags.bookingConfirmedNotifiedUser = true;
        await booking.save(); // ✅ persist flag
      }

      // ✅ Enroute email (SEND ONCE EVER)
      if (
        userEmail &&
        newStatus === "enroute" &&
        booking.notificationFlags.enrouteNotifiedUser !== true
      ) {
        await sendEmail({
          to: userEmail,
          subject: "Your chauffeur is en route — Le Charlot Limousine",
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
              <h2 style="margin:0 0 8px;">Your chauffeur is en route</h2>
              <p style="margin:0 0 16px;">
                Your chauffeur is on the way for booking <b>${booking._id}</b>.
              </p>
              <p style="margin:0;"><b>Pickup:</b> ${booking.pickupLocation}</p>
              <p style="margin:0;"><b>Pickup time:</b> ${new Date(booking.pickupDate).toLocaleString()}</p>
              <p style="margin:16px 0 0;">Le Charlot Limousine</p>
            </div>
          `,
        });

        booking.notificationFlags.enrouteNotifiedUser = true;
        await booking.save(); // ✅ persist flag
      }
    } catch (emailErr) {
      console.error(
        "❌ Email notification failed (non-blocking):",
        emailErr?.response?.body || emailErr
      );
    }

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
 ❌ CANCEL BOOKING (USER)
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
