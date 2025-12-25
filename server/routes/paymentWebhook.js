import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * ⚠️ IMPORTANT
 * This route MUST use bodyParser.raw({ type: "application/json" })
 * and be registered BEFORE express.json()
 */

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  /* ===============================
     🔐 VERIFY STRIPE SIGNATURE
  =============================== */
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  /* ===============================
     🎯 HANDLE EVENTS
  =============================== */
  try {
    switch (event.type) {
      /* ===============================
         ✅ PAYMENT SUCCESS
      =============================== */
      case "checkout.session.completed": {
        const session = event.data.object;

        // 🛡️ Safety check
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
          console.warn("⚠️ Missing bookingId in Stripe metadata");
          break;
        }

        const booking = await Booking.findById(bookingId).populate("reward");
        if (!booking) {
          console.warn("⚠️ Booking not found:", bookingId);
          break;
        }

        // 🔁 IDEMPOTENCY GUARD
        if (booking.paymentStatus === "paid") {
          console.log("🔁 Webhook already processed for booking:", bookingId);
          break;
        }

        // ✅ Confirm booking
        booking.paymentStatus = "paid";
        booking.status = "confirmed";
        await booking.save();

        // 🎁 FINALIZE REWARD
        if (booking.reward) {
          await Reward.findByIdAndUpdate(booking.reward._id, {
            status: "USED",
            usedAt: new Date(),
            lockedAt: null,
            booking: booking._id,
            isSlotFull: false,
          });
        }

        console.log(`✅ Booking ${bookingId} confirmed & reward finalized`);
        break;
      }

      /* ===============================
         ❌ PAYMENT FAILED / ABANDONED
      =============================== */
      case "checkout.session.expired":
      case "payment_intent.payment_failed": {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) break;

        const booking = await Booking.findById(bookingId).populate("reward");
        if (!booking || !booking.reward) break;

        // 🔓 RELEASE REWARD
        await Reward.findByIdAndUpdate(booking.reward._id, {
          status: "AVAILABLE",
          lockedAt: null,
          booking: null,
          isSlotFull: false,
        });

        console.log(`🔓 Reward released for failed booking ${bookingId}`);
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }
  } catch (err) {
    console.error("❌ Webhook processing error:", err.message);
  }

  // ✅ Always acknowledge Stripe
  res.json({ received: true });
});

export default router;
