// controllers/paymentController.js
import Stripe from "stripe";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import User from "../models/User.js";
import { evaluateMilestonesForUser } from "../services/milestone.service.js";
import { calculateTripEstimate } from "../services/pricingEngine.js";

// Ensure Stripe key exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "❌ STRIPE_SECRET_KEY is missing. Set it in .env (dev) or Railway Variables (prod)."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const STRIPE_CURRENCY = "usd";

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

    // 🔒 1. SAFE FETCH + LOCK
    await mongoSession.withTransaction(async () => {
      booking = await Booking.findById(bookingId)
        .populate("car")
        .session(mongoSession);

      if (!booking) throw new Error("Booking not found");
      if (booking.user?.toString() !== req.user?._id?.toString()) {
        throw Object.assign(new Error("Not authorized to pay for this booking"), {
          statusCode: 403,
        });
      }

      if (booking.paymentStatus === "paid") {
        throw new Error("Booking already paid");
      }

      booking.paymentStatus = "awaiting_payment";
      await booking.save({ session: mongoSession });
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const amount = booking.totalPrice;

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid booking amount" });
    }
    const amountInCents = Math.round(amount * 100);

    // Resume only a provider session that still matches the trusted booking.
    if (booking.stripeSessionId) {
      const existing = await stripe.checkout.sessions.retrieve(
        booking.stripeSessionId
      );

      if (existing?.status === "open") {
        const matchesBooking =
          existing.id === booking.stripeSessionId &&
          existing.metadata?.bookingId === booking._id.toString() &&
          existing.currency === STRIPE_CURRENCY &&
          existing.amount_total === amountInCents;

        if (!matchesBooking) {
          return res.status(409).json({
            error: "Existing payment session does not match this booking",
          });
        }

        return res.json({
          url: existing.url,
          sessionId: existing.id,
          resumed: true,
        });
      }

      if (existing?.status !== "expired") {
        return res.status(409).json({
          error: "Existing payment session is still being processed",
        });
      }
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: STRIPE_CURRENCY,
            product_data: {
              name: `Booking - ${booking.carSnapshot?.name || "Luxury Ride"}`,
              description: `${booking.pickupLocation} → ${booking.dropoffLocation}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking-cancelled?session_id={CHECKOUT_SESSION_ID}`,

      metadata: {
        bookingId: booking._id.toString(),
      },
      client_reference_id: booking._id.toString(),
    }, {
      idempotencyKey: `booking-${booking._id}-session-${booking.stripeSessionId || "initial"}`,
    });

    // 🔒 4. SAFE SAVE (NO RACE CONDITION)
    booking.stripeSessionId = stripeSession.id;
    booking.paymentStatus = "awaiting_payment";

    await booking.save();

    return res.json({
      url: stripeSession.url,
      sessionId: stripeSession.id,
      resumed: false
    });

  } catch (err) {
    console.error("❌ Stripe session error:", err);
    return res.status(err.statusCode || 500).json({
      error: err.message || "Failed to create Stripe session",
    });

  } finally {
    mongoSession.endSession();
  }
};
/**
 * Public Stripe return endpoint. Booking and payment state are updated only
 * by the verified webhook, never by a visitor-provided session ID.
 */
export const handleCancelledPayment = (_req, res) =>
  res.status(200).json({
    message: "Payment return received. Booking status follows verified payment events.",
  });


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
