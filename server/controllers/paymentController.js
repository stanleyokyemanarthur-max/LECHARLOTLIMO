// controllers/paymentController.js
import Stripe from "stripe";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import User from "../models/User.js";
import { evaluateMilestonesForUser } from "../services/milestone.service.js";

// Load dotenv locally if not production
if (process.env.NODE_ENV !== "production") {
  import('dotenv').then(dotenv => dotenv.config());
}

// Ensure Stripe key exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "❌ STRIPE_SECRET_KEY is missing. Set it in .env (dev) or Railway Variables (prod)."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * 💳 Create Stripe Checkout Session
 */
export const createCheckoutSession = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { bookingId, amount } = req.body;
    if (!bookingId || !amount) return res.status(400).json({ message: "BookingId and amount required" });

    await session.withTransaction(async () => {
      const booking = await Booking.findById(bookingId).session(session);
      if (!booking) throw new Error("Booking not found");

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Car Booking - ${booking.carSnapshot?.name || "Luxury Ride"}`,
                description: `${booking.pickupLocation} → ${booking.dropoffLocation}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/booking-cancelled?session_id={CHECKOUT_SESSION_ID}`,
        metadata: { bookingId: booking._id.toString() },
      });

      booking.stripeSessionId = stripeSession.id;
      booking.paymentStatus = "pending";
      await booking.save({ session });
      res.status(200).json({ url: stripeSession.url });
    });
  } catch (err) {
    console.error("❌ Create checkout session error:", err);
    res.status(500).json({ message: err.message || "Failed to create Stripe session" });
  } finally {
    session.endSession();
  }
};

/**
 * ❌ Handle Cancelled Payments
 */
export const handleCancelledPayment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ message: "Missing session ID" });

    await session.withTransaction(async () => {
      const booking = await Booking.findOne({ stripeSessionId: session_id }).session(session);
      if (!booking) throw new Error("Booking not found");

      if (booking.status === "confirmed") {
        return res.status(200).json({ message: "Booking already confirmed" });
      }

      booking.status = "cancelled";
      booking.paymentStatus = "cancelled";
      await booking.save({ session });

      if (booking.reward) {
        const reward = await Reward.findById(booking.reward).session(session);
        reward.status = "AVAILABLE";
        reward.lockedAt = null;
        reward.booking = null;
        reward.isSlotFull = false;
        await reward.save({ session });
      }

      res.status(200).json({ message: "Booking cancelled and reward released", booking });
    });
  } catch (err) {
    console.error("❌ Handle cancelled payment error:", err);
    res.status(500).json({ message: err.message || "Server error cancelling booking" });
  } finally {
    session.endSession();
  }
};

/**
 * 🔍 Verify Payment Status (client check)
 */
export const verifyPaymentStatus = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ message: "Missing session ID" });

    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    await session.withTransaction(async () => {
      const booking = await Booking.findOne({ stripeSessionId: session_id })
        .populate("user")
        .populate("reward")
        .session(session);

      if (!booking) throw new Error("Booking not found");

      if (stripeSession.payment_status !== "paid") {
        return res.status(200).json({
          paid: false,
          bookingStatus: booking.status,
          paymentStatus: booking.paymentStatus,
        });
      }

      // 🔒 Check for overlapping bookings
      const overlap = await Booking.findOne({
        _id: { $ne: booking._id },
        car: booking.car,
        status: { $in: ["pending", "confirmed"] },
        pickupDate: { $lt: booking.dropoffDate },
        dropoffDate: { $gt: booking.pickupDate },
      }).session(session);

      if (overlap) {
        booking.status = "cancelled";
        booking.paymentStatus = "refunded";
        await booking.save({ session });

        if (booking.reward) {
          const reward = await Reward.findById(booking.reward).session(session);
          reward.status = "AVAILABLE";
          reward.booking = null;
          reward.lockedAt = null;
          reward.isSlotFull = false;
          await reward.save({ session });
        }

        throw new Error("Vehicle already booked during this time");
      }

      // ✅ Update booking as paid
      booking.paymentStatus = "paid";
      booking.isPaid = true;
      await booking.save({ session });

      // ✅ Increment user's total spend
      await User.updateOne(
        { _id: booking.user._id },
        { $inc: { totalSpend: booking.totalPrice } },
        { session }
      );

      // ✅ Evaluate milestones if no other pending paid bookings
      const pendingPaid = await Booking.exists({
        user: booking.user._id,
        isPaid: true,
        status: { $in: ["pending", "confirmed"] },
        _id: { $ne: booking._id },
      });

      if (!pendingPaid) {
        await evaluateMilestonesForUser(booking.user, session);
      } else {
        console.log("⏳ Paid booking exists, milestone reward will be queued");
      }

      res.status(200).json({
        paid: true,
        bookingStatus: booking.status,
        paymentStatus: booking.paymentStatus,
      });
    });
  } catch (err) {
    console.error("❌ Verify payment error:", err);
    res.status(500).json({ message: err.message || "Server error verifying payment" });
  } finally {
    session.endSession();
  }
};
