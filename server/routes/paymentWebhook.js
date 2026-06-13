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

// Simple in-memory (you can later upgrade to Redis)

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const processedEvents = new Set();

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
    console.error("❌ Signature failed:", err.message);
    return res.status(400).send("Webhook Error");
  }

  // 🔒 IDEMPOTENCY GUARD (CRITICAL)
  if (processedEvents.has(event.id)) {
    return res.json({ received: true });
  }
  processedEvents.add(event.id);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) return res.json({ received: true });

      const booking = await Booking.findById(bookingId)
        .populate("reward")
        .populate("user");

      if (!booking) return res.json({ received: true });

      // 🔒 SECOND IDEMPOTENCY LAYER (DB SAFE)
      if (booking.paymentStatus === "paid" && booking.status === "confirmed") {
        return res.json({ received: true });
      }

      if (booking.status === "expired") {
        console.warn(
          `⚠️ Payment received for expired booking ${booking._id}`
        );

        return res.json({ received: true });
      }

      // ========================
      // 1. UPDATE DB FIRST (ATOMIC STATE)
      // ========================
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      booking.isPaid = true;

      if (!booking.totalPrice || booking.totalPrice <= 0) {
        console.error("❌ Invalid booking price at webhook:", booking._id);

        return res.status(400).json({
          error: "Booking has invalid pricing. Cannot confirm payment.",
        });
      }

      // update reward FIRST (safe)
      if (booking.reward?._id) {
        await Reward.findOneAndUpdate(
          {
            _id: booking.reward._id,
            status: { $ne: "USED" },
          },
          {
            status: "USED",
            usedAt: new Date(),
            lockedAt: null,
            booking: booking._id,
            isSlotFull: false,
          }
        );
      }

      // THEN save booking
      await booking.save();
      // ========================
      // 2. SIDE EFFECTS (SAFE AFTER SAVE)
      // ========================
      const bookingRef = booking._id.toString();

      // EMAILS (safe now, DB already consistent)
      try {
        const adminEmails = (process.env.ADMIN_EMAIL || "")
          .split(",")
          .map(e => e.trim())
          .filter(Boolean);

        if (adminEmails.length) {
          await sendEmail({
            to: adminEmails,
            subject: `PAID booking (${bookingRef})`,
            html: `<p>New paid booking received.</p>`,
          });
        }

        if (booking.user?.email) {
          await sendEmail({
            to: booking.user.email,
            subject: "Payment received",
            html: `<p>Your booking is confirmed.</p>`,
          });
        }
      } catch (emailErr) {
        console.error("⚠️ Email failure (non-blocking):", emailErr.message);
      }

      console.log(`✅ Booking confirmed: ${bookingId}`);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) return res.json({ received: true });

      const booking = await Booking.findById(bookingId).populate("reward");
      if (!booking) return res.json({ received: true });

      if (booking.paymentStatus !== "paid") {
        booking.status = "expired";
        booking.paymentStatus = "expired";

        if (booking.reward?._id) {
          await Reward.findOneAndUpdate(
            {
              _id: booking.reward._id,
              status: { $ne: "AVAILABLE" },
            },
            {
              status: "AVAILABLE",
              lockedAt: null,
              booking: null,
              isSlotFull: false,
            }
          );
        }

        await booking.save();
      }

      console.log(`❌ Booking expired: ${bookingId}`);
    }

    return res.json({ received: true });

  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.status(500).json({ error: "Webhook failed" });
  }
});


export default router;