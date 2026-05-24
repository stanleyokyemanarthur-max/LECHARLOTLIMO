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
      case "checkout.session.completed": {
        const sessionObj = event.data.object;
        const bookingId = sessionObj.metadata?.bookingId;

        if (!bookingId) {
          console.warn("⚠️ Missing bookingId in Stripe metadata");
          break;
        }

        const booking = await Booking.findById(bookingId)
          .populate("reward")
          .populate("user");

        if (!booking) {
          console.warn("⚠️ Booking not found:", bookingId);
          break;
        }

        // ✅ Ensure flags exist
        booking.notificationFlags = booking.notificationFlags || {
          paymentReceivedNotifiedUser: false,
          paymentReceivedNotifiedAdmin: false,
        };

        // ✅ 1) Payment update (idempotent)
        // If already paid, do NOT break — continue to notifications.
        if (booking.paymentStatus !== "paid") {
          booking.paymentStatus = "paid";

          // do NOT downgrade if admin already moved it forward
          if (!["confirmed", "enroute", "completed"].includes(booking.status)) {
            booking.status = "pending"; // awaiting admin confirmation
          }

          await booking.save();

          // 🎁 finalize reward if present
          if (booking.reward) {
            await Reward.findByIdAndUpdate(booking.reward._id, {
              status: "USED",
              usedAt: new Date(),
              lockedAt: null,
              booking: booking._id,
              isSlotFull: false,
            });
          }
        }

        // Common email fields
        const bookingRef = booking._id.toString();
        const pickup = booking.pickupLocation;
        const dropoff = booking.dropoffLocation;
        const pickupTime = booking.pickupDate
          ? new Date(booking.pickupDate).toLocaleString()
          : "—";
        const amount = Number(booking.totalPrice || 0).toFixed(2);

        // ✅ 2) Customer email (idempotent via flags)
        try {
          const userEmail = booking.user?.email;
          if (userEmail && !booking.notificationFlags.paymentReceivedNotifiedUser) {
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
                  <div style="padding:12px 14px;border:1px solid #eee;border-radius:10px serif;border-radius:10px;">
                    <p style="margin:0;"><b>Pickup:</b> ${pickup}</p>
                    <p style="margin:0;"><b>Drop-off:</b> ${dropoff}</p>
                    <p style="margin:0;"><b>Pickup time:</b> ${pickupTime}</p>
                    <p style="margin:0;"><b>Total:</b> $${amount}</p>
                  </div>
                  <p style="margin:16px 0 0;">Le Charlot Limousine</p>
                </div>
              `,
            });

            booking.notificationFlags.paymentReceivedNotifiedUser = true;
            await booking.save();
          }
        } catch (e) {
          console.error("❌ Customer payment email failed (non-blocking):", e?.response?.body || e);
        }

        // ✅ 3) Admin email (supports comma-separated list)
        try {
          if (!booking.notificationFlags.paymentReceivedNotifiedAdmin) {
            const adminEmails = (process.env.ADMIN_NOTIFY_EMAIL || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);

            if (!adminEmails.length) {
              console.warn("⚠️ ADMIN_NOTIFY_EMAIL not set — skipping admin email");
            } else {
              await sendEmail({
                to: adminEmails, // ✅ SendGrid accepts array
                subject: `PAID booking awaiting confirmation (${bookingRef})`,
                html: `
                  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
                    <h2 style="margin:0 0 8px;">New PAID booking awaiting confirmation</h2>
                    <div style="padding:12px 14px;border:1px solid #eee;border-radius:10px;">
                      <p style="margin:0;"><b>Booking:</b> ${bookingRef}</p>
                      <p style="margin:0;"><b>Customer:</b> ${booking.user?.name || "—"} (${booking.user?.email || "—"})</p>
                      <p style="margin:0;"><b>Pickup:</b> ${pickup}</p>
                      <p style="margin:0;"><b>Drop-off:</b> ${dropoff}</p>
                      <p style="margin:0;"><b>Pickup time:</b> ${pickupTime}</p>
                      <p style="margin:0;"><b>Total:</b> $${amount}</p>
                    </div>
                    <p style="margin:16px 0 0;">Action: Admin dashboard → Bookings → Pending.</p>
                  </div>
                `,
              });

              booking.notificationFlags.paymentReceivedNotifiedAdmin = true;
              await booking.save();
            }
          }
        } catch (e) {
          console.error("❌ Admin email failed (non-blocking):", e?.response?.body || e);
        }

        console.log(`✅ Booking ${bookingId} paid + notifications handled (idempotent)`);
        break;
      }

      // ❌ checkout expired → cancel booking + release reward
      case "checkout.session.expired": {
        const sessionObj = event.data.object;
        const bookingId = sessionObj.metadata?.bookingId;
        if (!bookingId) break;

        const booking = await Booking.findById(bookingId).populate("reward");
        if (!booking) break;

        // cancel booking to avoid "stuck pending"
        booking.status = "cancelled";
        booking.paymentStatus = "cancelled";
        await booking.save();

        if (booking.reward) {
          await Reward.findByIdAndUpdate(booking.reward._id, {
            status: "AVAILABLE",
            lockedAt: null,
            booking: null,
            isSlotFull: false,
          });
        }

        console.log(`❌ Booking ${bookingId} checkout expired → cancelled + reward released`);
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
