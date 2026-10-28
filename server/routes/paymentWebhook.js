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

const STRIPE_CURRENCY = "usd";

const markRewardAsUsed = async (booking) => {
  if (!booking.reward?._id) return;

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
};

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

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        return res.status(400).json({ error: "Missing booking reference" });
      }

      let booking = await Booking.findById(bookingId)
        .populate("reward")
        .populate("user");

      if (!booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      const expectedAmount = Number.isFinite(booking.totalPrice)
        ? Math.round(booking.totalPrice * 100)
        : NaN;
      const matchesBooking =
        session.id === booking.stripeSessionId &&
        (!session.client_reference_id ||
          session.client_reference_id === booking._id.toString()) &&
        session.mode === "payment" &&
        session.payment_status === "paid" &&
        session.currency === STRIPE_CURRENCY &&
        Number.isFinite(expectedAmount) &&
        expectedAmount > 0 &&
        session.amount_total === expectedAmount;

      if (!matchesBooking) {
        return res.status(400).json({
          error: "Stripe payment does not match the booking",
        });
      }

      if (booking.paymentStatus === "paid") {
        await markRewardAsUsed(booking);
        return res.json({ received: true });
      }

      if (booking.status === "expired") {
        return res.status(400).json({
          error: "Payment cannot be applied to an expired booking",
        });
      }

      const paidBooking = await Booking.findOneAndUpdate(
        {
          _id: booking._id,
          stripeSessionId: session.id,
          paymentStatus: { $ne: "paid" },
          status: { $ne: "expired" },
        },
        {
          $set: {
            paymentStatus: "paid",
            status: "pending",
            isPaid: true,
          },
        },
        { new: true }
      )
        .populate("reward")
        .populate("user");

      if (!paidBooking) {
        const currentBooking = await Booking.findById(booking._id).populate("reward");
        if (currentBooking?.paymentStatus === "paid") {
          await markRewardAsUsed(currentBooking);
        }
        return res.json({ received: true });
      }
      booking = paidBooking;

      await markRewardAsUsed(booking);

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
            html: emailShell(`
      <h2 style="color:#f2d27a;margin-top:0;">
        New Paid Booking
      </h2>

      <p>
        A customer has completed payment. This reservation is awaiting admin confirmation.
      </p>

      <table style="width:100%;color:#f5f1e6;border-collapse:collapse;">
        <tr>
          <td><strong>Booking:</strong></td>
          <td>${bookingRef}</td>
        </tr>

        <tr>
          <td><strong>Customer:</strong></td>
         <td>
  ${booking.user?.name || "Unknown Customer"}
</td>
        </tr>

        <tr>
          <td><strong>Pickup:</strong></td>
          <td>${booking.pickupLocation}</td>
        </tr>

        <tr>
          <td><strong>Dropoff:</strong></td>
          <td>${booking.dropoffLocation}</td>
        </tr>

        <tr>
          <td><strong>Pickup Time:</strong></td>
          <td>${new Date(booking.pickupDate).toLocaleString()}</td>
        </tr>

        <tr>
          <td><strong>Total:</strong></td>
          <td>$${booking.totalPrice.toFixed(2)}</td>
        </tr>
      </table>

      <p style="margin-top:25px;color:#d4af37;">
        Action Required: Confirm this booking from the Admin Dashboard.
      </p>
    `)
          });
        }

        if (booking.user?.email) {
          await sendEmail({
            to: booking.user.email,
            subject: "Payment Received",
            html: emailShell(`
      <h2 style="color:#f2d27a;margin-top:0;">
        Payment Successfully Received
      </h2>

     <p>
  Dear ${booking.user?.name || "Valued Client"},
</p>

      <p>
        Thank you for choosing Le Charlot Limousine.
        We have successfully received your payment.
      </p>

      <p>
        Your reservation is currently
        <strong style="color:#f2d27a;">
          awaiting confirmation
        </strong>
        from our operations team.
      </p>

      <div style="
        background:#1b1812;
        border:1px solid rgba(255,215,120,0.15);
        border-radius:10px;
        padding:20px;
        margin-top:20px;
      ">

        <p><strong>Booking ID:</strong> ${bookingRef}</p>

        <p><strong>Pickup:</strong> ${booking.pickupLocation}</p>

        <p><strong>Dropoff:</strong> ${booking.dropoffLocation}</p>

        <p><strong>Date:</strong>
          ${new Date(booking.pickupDate).toLocaleString()}
        </p>

        <p><strong>Total:</strong>
          $${booking.totalPrice.toFixed(2)}
        </p>

      </div>

      <p style="margin-top:25px;">
        We will notify you once your reservation has been approved and assigned.
      </p>

      <p style="margin-top:30px;">
        <strong>Le Charlot Limousine</strong><br>
        Where Every Journey Is Treated First-Class.
      </p>
    `)
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

      if (!bookingId) {
        return res.status(400).json({ error: "Missing booking reference" });
      }

      let booking = await Booking.findById(bookingId).populate("reward");
      if (!booking) {
        return res.status(400).json({ error: "Booking not found" });
      }

      if (session.id !== booking.stripeSessionId) {
        return res.status(400).json({
          error: "Stripe session does not match the booking",
        });
      }

      if (booking.paymentStatus === "paid" || booking.paymentStatus === "expired") {
        return res.json({ received: true });
      }

      const expiredBooking = await Booking.findOneAndUpdate(
        {
          _id: booking._id,
          stripeSessionId: session.id,
          paymentStatus: { $nin: ["paid", "expired"] },
        },
        {
          $set: {
            status: "expired",
            paymentStatus: "expired",
          },
        },
        { new: true }
      ).populate("reward");

      if (expiredBooking) {
        booking = expiredBooking;
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

      } else {
        return res.json({ received: true });
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