// controllers/paymentController.js

import Stripe from "stripe";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";

if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * =========================================
 * 🧠 SAFE STRIPE CHECKOUT CREATION
 * =========================================
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "bookingId required" });
    }

    // 1. Fetch booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // 2. Prevent double payment
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ error: "Already paid" });
    }

    // 3. Ensure pricing is locked
    if (!booking.pricingLocked) {
      return res.status(400).json({ error: "Price not locked" });
    }

    const amount = booking.totalPrice;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // ======================================
    // 🔒 REUSE EXISTING STRIPE SESSION
    // ======================================
    if (booking.stripeSessionId) {
      try {
        const existing = await stripe.checkout.sessions.retrieve(
          booking.stripeSessionId
        );

        if (existing?.status === "open") {
          return res.json({
            url: existing.url,
            sessionId: existing.id,
          });
        }
      } catch (err) {
        console.log("♻️ Old session expired, creating new one");
      }
    }

    // ======================================
    // 🧠 IDEMPOTENCY KEY (CRITICAL)
    // ======================================
    const idempotencyKey = `booking_${booking._id}`;

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Booking - ${booking.carSnapshot?.name || "Ride"}`,
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
      },
      {
        idempotencyKey,
      }
    );

    // 4. Save session safely
    booking.stripeSessionId = session.id;
    booking.paymentStatus = "awaiting_payment";

    await booking.save();

    return res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("❌ createCheckoutSession error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * =========================================
 * 🔥 STRIPE WEBHOOK (SOURCE OF TRUTH)
 * =========================================
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Signature failed:", err.message);
    return res.status(400).send("Webhook Error");
  }

  try {
    // =========================
    // PAYMENT SUCCESS
    // =========================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) return res.json({ received: true });

      const booking = await Booking.findById(bookingId);

      if (!booking) return res.json({ received: true });

      // prevent double processing
      if (booking.paymentStatus === "paid") {
        return res.json({ received: true });
      }

      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      booking.isPaid = true;

      await booking.save();
    }

    // =========================
    // PAYMENT EXPIRED
    // =========================
    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) return res.json({ received: true });

      const booking = await Booking.findById(bookingId);

      if (!booking) return res.json({ received: true });

      if (booking.paymentStatus !== "paid") {
        booking.paymentStatus = "expired";
        booking.status = "cancelled";
        await booking.save();
      }
    }

    return res.json({ received: true });

  } catch (err) {
    console.error("❌ webhook error:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * =========================================
 * ❌ CANCEL PAYMENT (SAFE CLEANUP)
 * =========================================
 */
export const handleCancelledPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    await session.withTransaction(async () => {
      const booking = await Booking.findOne({
        stripeSessionId: session_id,
      }).session(session);

      if (!booking) return;

      if (booking.paymentStatus === "paid") return;

      booking.paymentStatus = "cancelled";
      booking.status = "cancelled";

      await booking.save({ session });

      // rollback reward safely
      if (booking.reward) {
        const reward = await Reward.findById(booking.reward).session(session);

        if (reward) {
          reward.status = "AVAILABLE";
          reward.lockedAt = null;
          reward.booking = null;
          reward.isSlotFull = false;

          await reward.save({ session });
        }
      }
    });

    return res.json({ message: "Cancelled successfully" });
  } catch (err) {
    console.error("❌ cancel error:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

/**
 * =========================================
 * 🔍 CLIENT PAYMENT CHECK (READ ONLY)
 * =========================================
 */
export const verifyPaymentStatus = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    const paid = stripeSession?.payment_status === "paid";

    const booking = await Booking.findOne({
      stripeSessionId: session_id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        paid,
        message: "Booking not found",
      });
    }

    return res.json({
      success: paid,
      paid,
      processing: paid && booking.paymentStatus !== "paid",
      bookingStatus: booking.status,
      paymentStatus: booking.paymentStatus,
    });
  } catch (err) {
    console.error("❌ verify error:", err);
    return res.status(500).json({ error: err.message });
  }
};