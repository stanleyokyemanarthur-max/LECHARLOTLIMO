
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import Reward from "../models/Reward.js";

import { evaluateMilestonesForUser } from "../services/milestone.service.js";
import mongoose from "mongoose";
import { sendEmail } from "../lib/sendEmail.js"; // ✅ adjust path if needed
import { calculateTripEstimate } from "../services/pricingEngine.js"; // ✅ new pricing engine

/* 
==============================
 🧾 CREATE BOOKING (user only)
==============================
*/
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      car,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      rewardId,
    } = req.body;

    // 1. VALIDATION
    if (!car || !pickupLocation || !dropoffLocation || !pickupDate || !dropoffDate) {
      return res.status(400).json({ error: "All booking fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(car)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);

    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start >= end) {
      return res.status(400).json({ error: "Invalid booking dates." });
    }

    // 2. CHECK DUPLICATE
    const existingPending = await Booking.findOne({
      user: req.user._id,
      car,
      pickupDate: start,
      dropoffDate: end,
      status: "pending",
    });

    if (existingPending) {
      return res.status(409).json({
        error: "Duplicate booking request detected.",
        booking: existingPending,
      });
    }

    // 3. FETCH CAR (outside transaction)
    const carData = await Car.findById(car);

    if (!carData) return res.status(404).json({ error: "CAR_NOT_FOUND" });
    if (!carData.fleetKey) return res.status(400).json({ error: "Missing fleetKey" });

    // 4. PRICE ENGINE (OUTSIDE TX — IMPORTANT FIX)
    const estimate = await calculateTripEstimate({
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      carRatePerMile: carData.perMileRate,
      car: carData,
    });

    if (!estimate?.distanceMiles) {
      return res.status(400).json({ error: "INVALID_ESTIMATE" });
    }

    let createdBooking;

    // 5. TRANSACTION START
    await session.withTransaction(async () => {
      const activeStatuses = ["pending", "confirmed", "enroute"];

      // IMPORTANT: re-check availability inside transaction
      const overlap = await Booking.countDocuments({
        car,
        status: { $in: activeStatuses },
        pickupDate: { $lt: end },
        dropoffDate: { $gt: start },
      }).session(session);

      if (overlap >= carData.totalUnits) {
        throw new Error("CAR_UNAVAILABLE");
      }
      const perMileRate = Number(carData.perMileRate);

      if (!Number.isFinite(perMileRate) || perMileRate <= 0) {
        return res.status(400).json({
          error: "INVALID_CAR_PRICING",
          message: "Car must have a valid perMileRate > 0",
        });
      }

      const distance = Number(estimate?.distanceMiles);

      if (!Number.isFinite(distance) || distance <= 0) {
        return res.status(400).json({
          error: "INVALID_DISTANCE_ESTIMATE",
        });
      }
const pricePerMile = Number(carData.perMileRate);
const rateMultiplier = Number(carData.rateMultiplier || 1);

if (!Number.isFinite(pricePerMile) || pricePerMile <= 0) {
  throw new Error("INVALID_CAR_PRICE");
}


    const [booking] = await Booking.create(
  [
    {
      user: req.user._id,
      car,
      fleetKey: carData.fleetKey,
      driver: null,

      carSnapshot: {
        name: carData.name,
        type: carData.type,
        pricePerMile: Number(carData.perMileRate),
        rateMultiplier: Number(carData.rateMultiplier || 1),
        totalUnits: Number(carData.totalUnits || 1),
        fleetKey: carData.fleetKey,
      },

      pickupLocation,
      dropoffLocation,
      pickupDate: start,
      dropoffDate: end,

      distance: estimate.distanceMiles,

      totalPrice: null, // ✅ IMPORTANT
      pricingLocked: false,

      isPaid: false,
      reward: rewardId || null,

      status: "pending",
      paymentStatus: "awaiting_quote",
    },
  ],
  { session }
);

      createdBooking = booking;
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking: createdBooking,
    });
  } catch (err) {
    console.error(err);

    return res.status(
      err.message === "CAR_UNAVAILABLE" ? 409 :
        err.message === "CAR_NOT_FOUND" ? 404 : 500
    ).json({ error: err.message });

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
    const { pickup, dropoff, carId, distance } = req.body;

    if (!pickup || !dropoff || !carId) {
      return res.status(400).json({
        error: "pickup, dropoff, and carId are required",
      });
    }

    const carData = await Car.findById(carId);

    if (!carData) {
      return res.status(404).json({ error: "Car not found" });
    }

    const estimate = await calculateTripEstimate({
      pickup,
      dropoff,
      carRatePerMile: carData.perMileRate,
      car: carData,
      fixedDistance: distance, // use provided distance if available
    });

    return res.json({
      ...estimate,
      perMileRate: carData.perMileRate,
    });

  } catch (err) {
    console.error("Estimate booking error:", err);
    return res.status(500).json({
      error: "Failed to calculate booking estimate",
    });
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
      .populate("user", "email name")
      .populate("reward")
      .populate("driver")
      .session(session);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    const requestedStatus = req.body.status;

    const prevStatus = booking.status;
    const newStatus = requestedStatus || prevStatus;

    // =============================
    // 💳 PAYMENT LOGIC
    // =============================

    const isPaid =
      booking.paymentStatus === "paid" ||
      booking.isPaid === true;

    const rewardValid =
      booking.reward &&
      booking.reward.status === "ACTIVE" &&
      (!booking.reward.expiresAt ||
        new Date(booking.reward.expiresAt) > new Date());

    const rewardCoversFully =
      rewardValid &&
      booking.reward.discountType === "FULL_COVER";

    const isFree =
      booking.totalPrice === 0 ||
      rewardCoversFully;

    const paymentRequired =
      typeof booking.totalPrice === "number" &&
      booking.totalPrice > 0 &&
      !isPaid &&
      !isFree;

    // =============================
    // 🚨 STATUS FLOW VALIDATION
    // =============================

    // pending -> confirmed
    if (newStatus === "confirmed" && paymentRequired) {
      return res.status(400).json({
        error: "Payment required before confirmation",
      });
    }

    // confirmed -> enroute
    if (
      newStatus === "enroute" &&
      prevStatus !== "confirmed"
    ) {
      return res.status(400).json({
        error: "Booking must be confirmed before going enroute",
      });
    }

    // enroute -> completed
    if (
      newStatus === "completed" &&
      prevStatus !== "enroute"
    ) {
      return res.status(400).json({
        error: "Booking must be enroute before completion",
      });
    }

    await session.withTransaction(async () => {
      booking.status = newStatus;

      if (!booking.notificationFlags) {
        booking.notificationFlags = {};
      }

      await booking.save({ session });

      // =============================
      // 🎁 REWARD HANDLING
      // =============================
      if (booking.reward) {
        const reward = await Reward.findById(
          booking.reward
        ).session(session);

        if (
          reward &&
          prevStatus !== "completed" &&
          newStatus === "completed"
        ) {
          reward.status = "USED";
          reward.usedAt = new Date();

          await reward.save({ session });
        }

        if (
          reward &&
          newStatus === "cancelled"
        ) {
          reward.status = "AVAILABLE";
          reward.booking = null;
          reward.lockedAt = null;
          reward.isSlotFull = false;

          await reward.save({ session });
        }
      }
      // =============================
      // 📈 MILESTONES / SPEND UPDATE
      // =============================
      if (
        prevStatus !== "completed" &&
        newStatus === "completed" &&
        (
          booking.isPaid ||
          booking.paymentStatus === "paid"
        )
      ) {
        await User.updateOne(
          { _id: booking.user?._id },
          {
            $inc: {
              totalCompletedBookings: 1,
              totalSpend: booking.totalPrice,
            },
          },
          { session }
        );

        const pendingPaid = await Booking.exists({
          user: booking.user?._id,
          isPaid: true,
          status: { $in: ["pending", "confirmed", "enroute"] },
          _id: { $ne: booking._id },
        }).session(session);

        if (!pendingPaid) {
          await evaluateMilestonesForUser(booking.user, session);
        }
      }
    });

    // =============================
    // ✉️ EMAILS (OUTSIDE TX)
    // =============================
    try {
      const userEmail = booking.user?.email;

      if (!booking.notificationFlags) {
        booking.notificationFlags = {};
      }

      if (
        userEmail &&
        newStatus === "confirmed" &&
        !booking.notificationFlags.bookingConfirmedNotifiedUser
      ) {
        await sendEmail({
          to: userEmail,
          subject: "Booking confirmed — Le Charlot Limousine",
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
              <h2>Booking confirmed</h2>
              <p>Your booking <b>${booking._id}</b> is confirmed.</p>
              <p><b>Pickup:</b> ${booking.pickupLocation}</p>
              <p><b>Drop-off:</b> ${booking.dropoffLocation}</p>
            </div>
          `,
        });

        booking.notificationFlags.bookingConfirmedNotifiedUser = true;
        await booking.save();
      }

      if (
        userEmail &&
        newStatus === "enroute" &&
        !booking.notificationFlags.enrouteNotifiedUser
      ) {
        await sendEmail({
          to: userEmail,
          subject: "Your chauffeur is en route — Le Charlot Limousine",
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
              <h2>Your chauffeur is en route</h2>
              <p>Booking <b>${booking._id}</b></p>
              <p><b>Pickup:</b> ${booking.pickupLocation}</p>
            </div>
          `,
        });

        booking.notificationFlags.enrouteNotifiedUser = true;
        await booking.save();
      }
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    return res.json(booking);
  } catch (err) {
    console.error("Update booking status error:", err);
    return res.status(500).json({ error: err.message });
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

export const confirmPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 💡 ensure price is set BEFORE marking paid
    if (
      booking.totalPrice == null &&
      booking.paymentStatus !== "free"
    ) {
      return res.status(400).json({
        error: "Booking must be priced before payment can be confirmed",
      });
    }


    booking.paymentStatus = "paid";
    booking.isPaid = true;

    await booking.save();

    res.json({
      message: "Payment confirmed",
      booking,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const finalizeBookingQuote = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ error: "Cannot price paid booking" });
    }

    const distance = Number(booking.distance);
    const pricePerMile = Number(booking.carSnapshot?.pricePerMile);
    const multiplier = Number(booking.carSnapshot?.rateMultiplier || 1);

    if (!Number.isFinite(distance) || distance <= 0 ||
        !Number.isFinite(pricePerMile) || pricePerMile <= 0) {
      return res.status(400).json({ error: "Invalid pricing data" });
    }

    const finalPrice =
      Math.round(distance * pricePerMile * multiplier * 100) / 100;

    booking.totalPrice = finalPrice;
    booking.pricingLocked = true;
    booking.paymentStatus = "awaiting_payment";

    await booking.save();

    return res.json({
      message: "Quote finalized",
      booking,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};