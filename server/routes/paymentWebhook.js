import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import dotenv from "dotenv";
import { sendEmail } from "../lib/sendEmail.js";

dotenv.config();

const logoUrl = "https://lecharlotlimo.onrender.com/images/logoiz.png";

const emailShell = (content) => `
  <div style="background:#0f0d0a;padding:40px 0;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#14110c;border-radius:14px;overflow:hidden;border:1px solid rgba(255,215,120,0.15);">

      <!-- HEADER -->
      <div style="padding:30px;text-align:center;background:linear-gradient(145deg,#7a5a12,#f2d27a,#8a6316);">
        <img src="${logoUrl}" style="width:140px;margin-bottom:10px;" />
        <h1 style="margin:0;color:#120d05;font-size:20px;letter-spacing:1px;">
          Le Charlot Limousine
        </h1>
      </div>

      <!-- BODY -->
      <div style="padding:30px;color:#f5f1e6;">
        ${content}
      </div>

      <!-- FOOTER -->
      <div style="padding:20px;text-align:center;font-size:12px;color:#a89b7a;border-top:1px solid rgba(255,255,255,0.08);">
        Luxury Chauffeur Service • Accra
      </div>

    </div>
  </div>
`;

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
                html: emailShell(`
  <h2 style="margin-top:0;color:#f2d27a;">New Paid Booking</h2>

  <p style="opacity:0.9;">
    A new booking has been successfully paid and is awaiting confirmation.
  </p>

  <div style="margin-top:20px;padding:16px;border-radius:12px;
    background:rgba(255,255,255,0.03);border:1px solid rgba(255,215,120,0.15);">

    <p><b>Booking:</b> ${bookingRef}</p>
    <p><b>Customer:</b> ${booking.user?.name || "—"} (${booking.user?.email || "—"})</p>
    <p><b>Pickup:</b> ${pickup}</p>
    <p><b>Drop-off:</b> ${dropoff}</p>
    <p><b>Time:</b> ${pickupTime}</p>
    <p><b>Total:</b> $${amount}</p>
  </div>

  <p style="margin-top:20px;opacity:0.8;">
    Action: Confirm booking in dashboard.
  </p>
`),
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
              html: emailShell(`
  <h2 style="margin-top:0;color:#f2d27a;">Payment Received</h2>

  <p style="opacity:0.9;line-height:1.6;">
    Your payment for booking <b>${bookingRef}</b> has been successfully received.
    Your chauffeur service is now being prepared for confirmation.
  </p>

  <div style="margin-top:20px;padding:16px;border-radius:12px;
    background:rgba(255,255,255,0.03);border:1px solid rgba(255,215,120,0.15);">

    <p><b>Pickup:</b> ${pickup}</p>
    <p><b>Drop-off:</b> ${dropoff}</p>
    <p><b>Pickup Time:</b> ${pickupTime}</p>
    <p><b>Total:</b> $${amount}</p>
  </div>

  <div style="margin-top:25px;text-align:center;">
    <a href="https://lecharlotlimo.onrender.com/my-bookings"
       style="display:inline-block;padding:12px 28px;border-radius:30px;
       background:linear-gradient(145deg,#7a5a12,#f2d27a,#c79b2a);
       color:#120d05;text-decoration:none;font-weight:bold;">
       View My Bookings
    </a>
  </div>

  <p style="margin-top:20px;font-size:12px;opacity:0.7;">
    Le Charlot Limousine • Luxury Chauffeur Experience
  </p>
`),
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