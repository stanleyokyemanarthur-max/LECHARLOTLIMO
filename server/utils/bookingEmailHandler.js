import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import dotenv from "dotenv";
import { sendEmail } from "../lib/sendEmail.js"; // ✅ adjust to your actual file path

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  // ✅ Always ACK Stripe fast, but we'll still try to process
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

  try {
    switch (event.type) {
      // ✅ PAYMENT SUCCESS
      case "checkout.session.completed": {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          console.warn("⚠️ Missing bookingId in Stripe metadata");
          break;
        }

        // ✅ populate user for email + reward for reward logic
        const booking = await Booking.findById(bookingId)
          .populate("reward")
          .populate("user");

        if (!booking) {
          console.warn("⚠️ Booking not found:", bookingId);
          break;
        }

        // 🔁 Idempotency guard
        if (booking.paymentStatus === "paid") {
          console.log("🔁 Webhook already processed for booking:", bookingId);
          break;
        }

        // ✅ Mark payment as paid, keep awaiting admin confirmation
        booking.paymentStatus = "paid";
        booking.status = "pending";
        await booking.save();

        // 🎁 Finalize reward if present
        if (booking.reward) {
          await Reward.findByIdAndUpdate(booking.reward._id, {
            status: "USED",
            usedAt: new Date(),
            lockedAt: null,
            booking: booking._id,
            isSlotFull: false,
          });
        }

        // =========================
        // ✉️ EMAIL NOTIFICATIONS
        // =========================
        const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
        const userEmail = booking.user?.email;

        const bookingRef = booking._id.toString();
        const pickup = booking.pickupLocation;
        const dropoff = booking.dropoffLocation;
        const pickupTime = booking.pickupDate
          ? new Date(booking.pickupDate).toLocaleString()
          : "—";
        const amount = booking.totalPrice?.toFixed(2);

        // ✅ Customer email: payment received
        if (userEmail) {
          await sendEmail({
            to: userEmail,
            subject: "Payment received — awaiting confirmation",
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
                <h2 style="margin:0 0 8px;">Payment received</h2>
                <p style="margin:0 0 16px;">
                  We’ve received your payment for booking <b>${bookingRef}</b>.
                  Your ride is now <b>awaiting confirmation</b>. You’ll receive another message once it’s approved.
                </p>
                <div style="padding:12px 14px;border:1px solid #eee;border-radius:10px;">
                  <p style="margin:0;"><b>Pickup:</b> ${pickup}</p>
                  <p style="margin:0;"><b>Drop-off:</b> ${dropoff}</p>
                  <p style="margin:0;"><b>Pickup time:</b> ${pickupTime}</p>
                  <p style="margin:0;"><b>Total:</b> $${amount}</p>
                </div>
                <p style="margin:16px 0 0;">Le Charlot Limousine</p>
              </div>
            `,
          });
        }

        // ✅ Admin email: new paid booking awaiting confirmation
        if (adminEmail) {
          await sendEmail({
            to: adminEmail,
            subject: `PAID booking awaiting confirmation (${bookingRef})`,
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
                <h2 style="margin:0 0 8px;">New PAID booking awaiting confirmation</h2>
                <div style="padding:12px 14px;border:1px solid #eee;border-radius:10px;">
                  <p style="margin:0;"><b>Booking:</b> ${bookingRef}</p>
                  <p style="margin:0;"><b>Customer:</b> ${booking.user?.firstName || ""} ${booking.user?.lastName || ""} (${booking.user?.email || ""})</p>
                  <p style="margin:0;"><b>Pickup:</b> ${pickup}</p>
                  <p style="margin:0;"><b>Drop-off:</b> ${dropoff}</p>
                  <p style="margin:0;"><b>Pickup time:</b> ${pickupTime}</p>
                  <p style="margin:0;"><b>Total:</b> $${amount}</p>
                </div>
                <p style="margin:16px 0 0;">Action: Admin dashboard → Bookings → Paid Pending.</p>
              </div>
            `,
          });
        }

        console.log(`✅ Booking ${bookingId} marked PAID and awaiting admin confirmation`);
        break;
      }

      // ❌ CHECKOUT EXPIRED (user abandoned checkout)
      case "checkout.session.expired": {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) break;

        const booking = await Booking.findById(bookingId).populate("reward");
        if (!booking || !booking.reward) break;

        // 🔓 Release reward if it was locked
        await Reward.findByIdAndUpdate(booking.reward._id, {
          status: "AVAILABLE",
          lockedAt: null,
          booking: null,
          isSlotFull: false,
        });

        console.log(`🔓 Reward released for expired checkout booking ${bookingId}`);
        break;
      }

      // Optional:
      // case "checkout.session.async_payment_failed": { ... }

      default:
        break;
    }
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    // Still acknowledge Stripe below
  }

  res.json({ received: true });
});

export default router;
