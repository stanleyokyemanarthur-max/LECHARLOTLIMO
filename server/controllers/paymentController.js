// controllers/paymentController.js
import Stripe from "stripe";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import User from "../models/User.js";
import { evaluateMilestonesForUser } from "../services/milestone.service.js";
import { calculateTripEstimate } from "../services/pricingEngine.js";
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
  const mongoSession = await mongoose.startSession();

  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "BookingId required" });
    }

    let booking;

    // 1. Fetch booking safely
    await mongoSession.withTransaction(async () => {
      booking = await Booking.findById(bookingId)
        .populate("car")
        .session(mongoSession);

      if (!booking) throw new Error("Booking not found");

      if (booking.paymentStatus === "paid") {
        throw new Error("Booking already paid");
      }

      // prevent duplicate sessions
      if (booking.stripeSessionId) return;

      booking.paymentStatus = "awaiting_payment";
      await booking.save({ session: mongoSession });
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 2. FINAL SAFETY: MUST already be priced
    let amount = booking.totalPrice;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Booking is not priced. Run finalizeQuote first.",
      });
    }

    // 3. Stripe session (NO DB inside here)
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking - ${booking.carSnapshot?.name || "Luxury Ride"}`,
              description: `${booking.pickupLocation} → ${booking.dropoffLocation}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking-cancelled?session_id={CHECKOUT_SESSION_ID}`,

      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    // 4. Save session ID (separate safe write)
    booking.stripeSessionId = stripeSession.id;
    await booking.save();

    return res.status(200).json({
      url: stripeSession.url,
      sessionId: stripeSession.id,
    });

  } catch (err) {
    console.error("❌ Stripe session error:", err);
    return res.status(500).json({
      error: err.message || "Failed to create Stripe session",
    });

  } finally {
    mongoSession.endSession();
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
 * 🔍 Verify Payment Status (client check) — READ-ONLY
 * Webhook is responsible for updating booking/payment states.
 */
export const verifyPaymentStatus = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ message: "Missing session ID" });

    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);
    const stripePaid = stripeSession?.payment_status === "paid";

    const booking = await Booking.findOne({ stripeSessionId: session_id })
      .populate("user")
      .populate("car")
      .populate("reward");

    if (!booking) {
      return res.status(404).json({ success: false, paid: stripePaid, message: "Booking not found" });
    }

    // If Stripe is paid but webhook hasn't updated DB yet, show "processing"
    if (stripePaid && booking.paymentStatus !== "paid") {
      return res.status(200).json({
        success: true,
        paid: true,
        processing: true, // 👈 tell UI to show “Payment received, updating booking…”
        bookingStatus: booking.status,
        paymentStatus: booking.paymentStatus,
        booking, // optional
      });
    }

    return res.status(200).json({
      success: stripePaid,
      paid: stripePaid,
      processing: false,
      bookingStatus: booking.status,
      paymentStatus: booking.paymentStatus,
      booking, // optional
    });
  } catch (err) {
    console.error("❌ Verify payment error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error verifying payment" });
  }
};

