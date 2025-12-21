import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

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
     ✅ PAYMENT SUCCESS
  =============================== */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;

    try {
      const booking = await Booking.findById(bookingId).populate("reward");

      if (!booking) {
        console.error("❌ Booking not found:", bookingId);
        return res.json({ received: true });
      }

      // Confirm booking
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      await booking.save();

      // 🎁 FINALIZE REWARD
      if (booking.reward) {
        await Reward.findByIdAndUpdate(booking.reward._id, {
          status: "USED",
          lockedAt: null,
          booking: booking._id,
          isSlotFull: false,
        });
      }

      console.log(`✅ Booking ${bookingId} confirmed`);
    } catch (err) {
      console.error("❌ Webhook processing error:", err.message);
    }
  }

  res.json({ received: true });
});

export default router;
