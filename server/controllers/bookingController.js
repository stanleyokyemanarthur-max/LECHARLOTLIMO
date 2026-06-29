
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import Reward from "../models/Reward.js";

import { evaluateMilestonesForUser } from "../services/milestone.service.js";
import mongoose from "mongoose";
import { sendEmail } from "../lib/sendEmail.js"; // ✅ adjust path if needed
import { calculateTripEstimate } from "../services/pricingEngine.js"; // ✅ new pricing engine
import { emailShell } from "../lib/emailShell.js";
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

    if (!car || !pickupLocation || !dropoffLocation || !pickupDate) {
      return res.status(400).json({ error: "All booking fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(car)) {
      return res.status(400).json({ error: "Invalid car ID." });
    }

    const start = new Date(pickupDate);
    const end = dropoffDate ? new Date(dropoffDate) : null;

    // ✅ FIXED duplicate check
    const existingPending = await Booking.findOne({
      user: req.user._id,
      car,
      status: "pending",
      paymentStatus: "awaiting_payment",
      pickupDate: start,
    });

    if (existingPending) {
      return res.status(409).json({
        resumePayment: true,
        booking: existingPending,
        message: "You already have a booking awaiting payment.",
      });
    }

    const carData = await Car.findById(car);
    if (!carData) return res.status(404).json({ error: "CAR_NOT_FOUND" });

    if (!carData.fleetKey) {
      return res.status(400).json({ error: "Missing fleetKey" });
    }

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

    await session.withTransaction(async () => {
      const activeStatuses = ["pending", "confirmed", "enroute"];

      // ✅ FIXED overlap query
      const overlap = await Booking.countDocuments({
        car,
        status: { $in: activeStatuses },
        pickupDate: { $lt: end || start },
        dropoffDate: { $gt: start },
      }).session(session);

      if (overlap >= carData.totalUnits) {
        throw new Error("CAR_UNAVAILABLE");
      }

      const rate = Number(carData.perMileRate);
      const multiplier = Number(carData.rateMultiplier || 1);
      const distance = Number(estimate.distanceMiles);

      if (!Number.isFinite(rate) || rate <= 0) {
        throw new Error("INVALID_CAR_PRICING");
      }

      if (!Number.isFinite(distance) || distance <= 0) {
        throw new Error("INVALID_DISTANCE");
      }

      console.log("BOOKING MODEL CHECK");
      console.log(JSON.stringify(Booking.schema.obj.carSnapshot, null, 2));

      console.log("====== COMPILED SCHEMA ======");
      console.log(
        "carSnapshot instance:",
        Booking.schema.path("carSnapshot")?.instance
      );

      console.log(
        "carSnapshot.name instance:",
        Booking.schema.path("carSnapshot.name")?.instance
      );

      console.log(
        Booking.schema.paths
      );

      const [booking] = await Booking.create(

        [
          {
            user: req.user._id,
            car,
            fleetKey: carData.fleetKey,
            driver: null,

            carSnapshot: {
              name: carData.name,
              category: carData.type,
              pricePerMile: rate,
              rateMultiplier: multiplier,
              totalUnits: carData.totalUnits,
              fleetKey: carData.fleetKey,
            },

            pickupLocation,
            dropoffLocation,
            pickupDate: start,
            dropoffDate: end,

            distance: estimate.distanceMiles,

            totalPrice: estimate.estimatedPrice,
            pricingLocked: true,

            isPaid: false,
            reward: rewardId || null,

            status: "pending",
            paymentStatus: "awaiting_payment",
          },
        ],
        { session }

      );
      console.log("=== CREATE BOOKING REACHED ===");
      console.log("carSnapshot schema:", Booking.schema.obj.carSnapshot);
      createdBooking = booking;
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking: createdBooking,
    });

  } catch (err) {
    console.error(err);

    return res.status(
      err.message === "CAR_UNAVAILABLE"
        ? 409
        : err.message === "CAR_NOT_FOUND"
          ? 404
          : 500
    ).json({ error: err.message });

  } finally {
    session.endSession();
  }
};

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


export const getDriverBookings = async (req, res) => {
  try {
    // ✅ Security: driver sees only assigned bookings
    const bookings = await Booking.find({ driver: req.user._id }).populate("user car driver");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("car");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
  .populate("user", "name email phone")
  .populate("car")
  .populate("driver", "name email")
  .sort({ createdAt: -1 })
  .limit(100);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



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


export const updateBookingStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let booking;

    await session.withTransaction(async () => {
      booking = await Booking.findById(req.params.id)
        .populate("user", "email name")
        .populate("reward")
        .populate("driver")
        .session(session);

      if (!booking) {
        throw new Error("BOOKING_NOT_FOUND");
      }

      const requestedStatus = req.body.status;
      const prevStatus = booking.status;
      const newStatus = requestedStatus || prevStatus;

      // =============================
      // 💳 PAYMENT LOGIC
      // =============================
      const isPaid =
        booking.paymentStatus === "paid" || booking.isPaid === true;

      const rewardValid =
        booking.reward &&
        booking.reward.status === "ACTIVE" &&
        (!booking.reward.expiresAt ||
          new Date(booking.reward.expiresAt) > new Date());

      const rewardCoversFully =
        rewardValid &&
        booking.reward.discountType === "FULL_COVER";

      const isFree =
        booking.totalPrice === 0 || rewardCoversFully;

      const paymentRequired =
        typeof booking.totalPrice === "number" &&
        booking.totalPrice > 0 &&
        !isPaid &&
        !isFree;

      // =============================
      // 🚨 STATUS FLOW VALIDATION
      // =============================

      if (newStatus === "confirmed" && paymentRequired) {
        throw new Error("PAYMENT_REQUIRED");
      }

      if (newStatus === "enroute" && prevStatus !== "confirmed") {
        throw new Error("MUST_BE_CONFIRMED_FIRST");
      }

      if (newStatus === "completed" && prevStatus !== "enroute") {
        throw new Error("MUST_BE_ENROUTE_FIRST");
      }

      // =============================
      // 🔄 UPDATE STATUS
      // =============================
      booking.status = newStatus;

      if (!booking.notificationFlags) {
        booking.notificationFlags = {};
      }

      await booking.save({ session });

      // =============================
      // 🎁 REWARD HANDLING
      // =============================
      if (booking.reward) {
        const reward = await Reward.findById(booking.reward).session(session);

        if (
          reward &&
          prevStatus !== "completed" &&
          newStatus === "completed"
        ) {
          reward.status = "USED";
          reward.usedAt = new Date();
          await reward.save({ session });
        }

        if (reward && newStatus === "cancelled") {
          reward.status = "AVAILABLE";
          reward.booking = null;
          reward.lockedAt = null;
          reward.isSlotFull = false;
          await reward.save({ session });
        }
      }

      // =============================
      // 📈 MILESTONE UPDATE
      // =============================
      if (
        prevStatus !== "completed" &&
        newStatus === "completed" &&
        (booking.isPaid || booking.paymentStatus === "paid")
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
    const userEmail = booking?.user?.email;

    try {
      if (!booking.notificationFlags) {
        booking.notificationFlags = {};
      }

      // CONFIRMED EMAIL
      if (
        userEmail &&
        booking.status === "confirmed" &&
        !booking.notificationFlags.bookingConfirmedNotifiedUser
      ) {
        await sendEmail({
          to: userEmail,
          subject: "Booking Confirmed — Le Charlot Limousine",
          html: emailShell(`<p>Booking confirmed...</p>`),
        });

        booking.notificationFlags.bookingConfirmedNotifiedUser = true;
      }

      // ENROUTE EMAIL
      if (
        userEmail &&
        booking.status === "enroute" &&
        !booking.notificationFlags.enrouteNotifiedUser
      ) {
        await sendEmail({
          to: userEmail,
          subject: "Your Chauffeur Is En Route",
          html: emailShell(`<p>Your chauffeur is on the way...</p>`),
        });

        booking.notificationFlags.enrouteNotifiedUser = true;
      }

      // COMPLETED EMAIL
      if (
        userEmail &&
        booking.status === "completed" &&
        !booking.notificationFlags.completedNotifiedUser
      ) {
        await sendEmail({
          to: userEmail,
          subject: "Trip Completed — Thank You",
          html: emailShell(`<p>Thank you for riding with us...</p>`),
        });

        booking.notificationFlags.completedNotifiedUser = true;
      }

      await booking.save();

    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    return res.json(booking);
  } catch (err) {
    console.error("Update booking status error:", err);

    const map = {
      BOOKING_NOT_FOUND: 404,
      PAYMENT_REQUIRED: 400,
      MUST_BE_CONFIRMED_FIRST: 400,
      MUST_BE_ENROUTE_FIRST: 400,
    };

    return res.status(map[err.message] || 500).json({
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};


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

    if (!booking)
      return res.status(404).json({ error: "Booking not found" });

    if (booking.paymentStatus === "paid")
      return res.status(400).json({ error: "Cannot modify paid booking" });

    booking.pricingLocked = true;
    booking.paymentStatus = "awaiting_payment";

    await booking.save();

    return res.json({
      message: "Quote finalized",
      booking,
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

