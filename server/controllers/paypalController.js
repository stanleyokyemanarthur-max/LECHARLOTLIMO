import client from "../config/paypal.js";
import paypal from "@paypal/checkout-server-sdk";

import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import mongoose from "mongoose";

/**
 * =========================
 * CREATE PAYPAL ORDER
 * =========================
 */
export const createPayPalOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "BookingId required" });
    }

    let booking;

    // STEP 1: lock and validate booking (DB only)
    await session.withTransaction(async () => {
      booking = await Booking.findById(bookingId)
        .populate("car")
        .session(session);

      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.paymentStatus === "paid") {
        throw new Error("Booking already paid");
      }

      // prevent double processing
      booking.paymentStatus = "awaiting_payment";
      await booking.save({ session });
    });

    const amount = booking.totalPrice;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid booking amount" });
    }

    // STEP 2: create PayPal order (external API)
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: booking._id.toString(),
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
          description: `Le Charlot Booking - ${
            booking.carSnapshot?.name || "Luxury Ride"
          }`,
        },
      ],
      application_context: {
        return_url: `${process.env.CLIENT_URL}/booking-success`,
        cancel_url: `${process.env.CLIENT_URL}/booking-cancelled`,
      },
    });

    const order = await client.execute(request);

    return res.json({
      id: order.result.id,
    });
  } catch (err) {
    console.error("❌ PayPal create order error:", {
      message: err.message,
    });

    return res.status(500).json({
      error: err.message || "Failed to create PayPal order",
    });
  } finally {
    session.endSession();
  }
};

/**
 * =========================
 * CAPTURE PAYPAL ORDER
 * =========================
 */
export const capturePayPalOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { orderID, bookingId } = req.body;

    if (!orderID || !bookingId) {
      return res.status(400).json({ error: "Missing orderID or bookingId" });
    }

    let booking;

    await session.withTransaction(async () => {
      booking = await Booking.findById(bookingId)
        .populate("reward", "_id status")
        .session(session);

      if (!booking) {
        throw new Error("Booking not found");
      }

      // ✅ IDENTITY CHECK (prevents wrong booking updates)
      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      request.requestBody({});

      const capture = await client.execute(request);

      const status = capture.result.status;

      if (status !== "COMPLETED") {
        throw new Error("PayPal payment not completed");
      }

      // 🔐 Verify PayPal reference matches booking
      const referenceId =
        capture.result.purchase_units?.[0]?.reference_id;

      if (referenceId !== bookingId) {
        throw new Error("Booking mismatch detected");
      }

      // 🔐 Idempotency check
      if (booking.paymentStatus === "paid") {
        return;
      }

      // =========================
      // UPDATE BOOKING
      // =========================
      booking.paymentStatus = "paid";
      booking.isPaid = true;
      booking.status = "pending";

      // =========================
      // REWARD LOGIC
      // =========================
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
          },
          { session }
        );
      }

      await booking.save({ session });
    });

    return res.json({
      success: true,
      message: "PayPal payment captured successfully",
    });
  } catch (err) {
    console.error("❌ PayPal capture error:", {
      message: err.message,
      bookingId: req.body?.bookingId,
      orderID: req.body?.orderID,
    });

    return res.status(500).json({
      error: err.message || "Failed to capture PayPal payment",
    });
  } finally {
    session.endSession();
  }
};