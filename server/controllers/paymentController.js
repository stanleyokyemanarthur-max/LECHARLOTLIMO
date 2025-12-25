// controllers/paymentController.js
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import { evaluateMilestonesForUser } from "../services/milestone.service.js";
import User from "../models/User.js"
import mongoose from "mongoose";

// Load dotenv only if running locally
if (process.env.NODE_ENV !== "production") {
  import('dotenv').then(dotenv => dotenv.config());
}

// Check if the key exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY is missing. Set it in .env (dev) or Railway Variables (prod).");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * 💳 Create Stripe Checkout Session
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const session = await stripe.checkout.sessions.create({
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
            unit_amount: Math.round(amount * 100), // cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking-cancelled?session_id={CHECKOUT_SESSION_ID}`,
      metadata: { bookingId: booking._id.toString() },
    });

    booking.stripeSessionId = session.id;
    booking.paymentStatus = "pending";
    await booking.save();

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe session error:", error);
    res.status(500).json({ message: "Payment session failed" });
  }
};


/**
 * ❌ Handle Cancelled Payments
 */
export const handleCancelledPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ message: "Missing session ID" });
    }

    const booking = await Booking.findOne({ stripeSessionId: session_id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Do nothing if already confirmed by webhook
    if (booking.status === "confirmed") {
      return res.status(200).json({ message: "Booking already confirmed" });
    }

    booking.status = "cancelled";
    booking.paymentStatus = "cancelled";
    await booking.save();

    // 🔓 UNLOCK reward if it exists
    if (booking.reward) {
      await Reward.findByIdAndUpdate(booking.reward, {
        status: "AVAILABLE",
        lockedAt: null,
        booking: null,
        isSlotFull: false,
      });
    }

    res.status(200).json({
      message: "Booking cancelled and reward released",
      booking,
    });
  } catch (error) {
    console.error("❌ Cancel payment error:", error);
    res.status(500).json({ message: "Server error cancelling booking" });
  }
};

/**
 * 🔍 Verify Payment Status (client check)
 */
export const verifyPaymentStatus = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { session_id } = req.query;
    if (!session_id)
      return res.status(400).json({ message: "Missing session ID" });

    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
    const booking = await Booking.findOne({ stripeSessionId: session_id }).populate("user");
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (stripeSession.payment_status !== "paid") {
      return res.status(200).json({
        paid: false,
        bookingStatus: booking.status,
        paymentStatus: booking.paymentStatus,
      });
    }

    // ✅ Begin transaction
    await session.withTransaction(async () => {
      // Update booking
      booking.paymentStatus = "paid";
      booking.isPaid = true;
      await booking.save({ session });

      // Increment user's total spend
      await User.updateOne(
        { _id: booking.user._id },
        { $inc: { totalSpend: booking.totalPrice } },
        { session }
      );

      // Check for other pending paid bookings
      const pendingPaidBooking = await Booking.exists({
        user: booking.user._id,
        isPaid: true,
        status: { $in: ["pending", "confirmed"] },
        _id: { $ne: booking._id },
      });

      // Evaluate milestones only if no other pending paid bookings
      if (!pendingPaidBooking) {
        await evaluateMilestonesForUser(booking.user, session);
      } else {
        console.log("⏳ Paid booking exists, milestone reward will be queued");
      }
    });

    res.status(200).json({
      paid: true,
      bookingStatus: booking.status,
      paymentStatus: booking.paymentStatus,
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    res.status(500).json({ message: "Server error verifying payment" });
  } finally {
    session.endSession();
  }
};


