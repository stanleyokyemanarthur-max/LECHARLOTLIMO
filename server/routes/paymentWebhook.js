import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import dotenv from "dotenv";
import { sendEmail } from "../lib/sendEmail.js";

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

  try {
    switch (event.type) {

      // =========================
      // PAYMENT SUCCESS
      // =========================
      case "checkout.session.completed": {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) break;

        const booking = await Booking.findById(bookingId)
          .populate("reward")
          .populate("user");

        if (!booking) break;

        // ensure flags exist
        booking.notificationFlags ||= {
          paymentReceivedNotifiedUser: false,
          paymentReceivedNotifiedAdmin: false,
        };

        // =========================
        // PAYMENT UPDATE
        // =========================
        if (booking.paymentStatus !== "paid") {
          booking.paymentStatus = "paid";

          if (!["confirmed", "enroute", "completed"].includes(booking.status)) {
            booking.status = "pending";
          }

          // finalize reward
          if (booking.reward?._id) {
            await Reward.findByIdAndUpdate(booking.reward._id, {
              status: "USED",
              usedAt: new Date(),
              lockedAt: null,
              booking: booking._id,
              isSlotFull: false,
            });
          }
        }

        // =========================
        // COMMON DATA (IMPORTANT)
        // =========================
        const bookingRef = booking._id.toString();
        const pickup = booking.pickupLocation;
        const dropoff = booking.dropoffLocation;
        const pickupTime = booking.pickupDate
          ? new Date(booking.pickupDate).toLocaleString()
          : "—";
        const amount = Number(booking.totalPrice || 0).toFixed(2);

        // =========================
        // ADMIN EMAIL
        // =========================
    try {
  if (!booking.notificationFlags.paymentReceivedNotifiedAdmin) {
    const adminEmails = (process.env.ADMIN_EMAIL || "")
      .split(",")
      .map(e => e.trim())
      .filter(Boolean);

    console.log("📧 ADMIN EMAILS:", adminEmails);

    if (adminEmails.length > 0) {
      const result = await sendEmail({
        to: adminEmails,
        subject: `PAID booking awaiting confirmation (${bookingRef})`,
        html: `...`,
      });

      console.log("✅ ADMIN EMAIL SENT RESULT:", result);
    } else {
      console.warn("⚠️ No admin emails configured");
    }

    booking.notificationFlags.paymentReceivedNotifiedAdmin = true;
  }
} catch (e) {
  console.error("❌ ADMIN EMAIL FAILED HARD:", e?.response?.body || e);
}

        // =========================
        // USER EMAIL
        // =========================
        try {
          const userEmail = booking.user?.email;

          if (
            userEmail &&
            !booking.notificationFlags.paymentReceivedNotifiedUser
          ) {
            await sendEmail({
              to: userEmail,
              subject: "Payment received — awaiting confirmation",
              html: `
                <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
                  <h2>Payment received</h2>

                  <p>
                    We’ve received your payment for booking <b>${bookingRef}</b>.
                    Your ride is now awaiting confirmation.
                  </p>

                  <div style="padding:12px;border:1px solid #eee;border-radius:10px;">
                    <p><b>Pickup:</b> ${pickup}</p>
                    <p><b>Drop-off:</b> ${dropoff}</p>
                    <p><b>Pickup time:</b> ${pickupTime}</p>
                    <p><b>Total:</b> $${amount}</p>
                  </div>

                  <p style="margin-top:16px;">Le Charlot Limousine</p>
                </div>
              `,
            });

            booking.notificationFlags.paymentReceivedNotifiedUser = true;
          }
        } catch (e) {
          console.error("❌ User email failed:", e);
        }

        await booking.save();

        console.log(`✅ Booking processed: ${bookingId}`);
        break;
      }

      // =========================
      // EXPIRED SESSION
      // =========================
      case "checkout.session.expired": {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) break;

        const booking = await Booking.findById(bookingId).populate("reward");
        if (!booking) break;

        booking.status = "cancelled";
        booking.paymentStatus = "cancelled";

        if (booking.reward?._id) {
          await Reward.findByIdAndUpdate(booking.reward._id, {
            status: "AVAILABLE",
            lockedAt: null,
            booking: null,
            isSlotFull: false,
          });
        }

        await booking.save();

        console.log(`❌ Booking expired: ${bookingId}`);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
  }

  res.json({ received: true });
});

export default router;