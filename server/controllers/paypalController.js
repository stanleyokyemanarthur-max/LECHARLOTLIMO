import client from "../config/paypal.js";
import paypal from "@paypal/checkout-server-sdk";

import Booking from "../models/Booking.js";
import Reward from "../models/Reward.js";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

const PAYPAL_CURRENCY = "USD";
const PAYPAL_CAPTURE_LOCK_TIMEOUT_MS = 5 * 60 * 1000;

const matchesPayPalAmount = (providerAmount, bookingAmount) =>
  Number.isFinite(bookingAmount) &&
  bookingAmount > 0 &&
  providerAmount?.currency_code === PAYPAL_CURRENCY &&
  providerAmount?.value === bookingAmount.toFixed(2);

const getOrderPurchaseUnit = (order, booking) => {
  const purchaseUnits = order?.purchase_units;

  if (
    order?.id !== booking.paypalOrderId ||
    purchaseUnits?.length !== 1 ||
    purchaseUnits[0].reference_id !== booking._id.toString() ||
    !matchesPayPalAmount(purchaseUnits[0].amount, booking.totalPrice)
  ) {
    throw new Error("PayPal order does not match the booking");
  }

  return purchaseUnits[0];
};

const getCompletedCapture = (order, booking) => {
  if (order?.status !== "COMPLETED") {
    throw new Error("PayPal payment is not completed");
  }

  const purchaseUnit = getOrderPurchaseUnit(order, booking);
  const captures = purchaseUnit.payments?.captures;

  if (
    captures?.length !== 1 ||
    captures[0].status !== "COMPLETED" ||
    !matchesPayPalAmount(captures[0].amount, booking.totalPrice)
  ) {
    throw new Error("PayPal capture does not match the booking");
  }

  return captures[0];
};

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
    let captureInProgress = false;

    // STEP 1: lock and validate booking (DB only)
    await session.withTransaction(async () => {
      booking = await Booking.findById(bookingId)
        .populate("car")
        .session(session);

      if (!booking) {
        throw new Error("Booking not found");
      }
      if (booking.user?.toString() !== req.user?._id?.toString()) {
        throw Object.assign(new Error("Not authorized to pay for this booking"), {
          statusCode: 403,
        });
      }

      if (booking.paymentStatus === "paid") {
        throw new Error("Booking already paid");
      }

      if (booking.paypalCaptureAttemptId) {
        captureInProgress = true;
        return;
      }

      // prevent double processing
      booking.paymentStatus = "awaiting_payment";
      await booking.save({ session });
    });

    if (captureInProgress) {
      return res.status(409).json({
        error: "PayPal capture is already in progress",
      });
    }

    const amount = booking.totalPrice;

    if (!Number.isFinite(amount) || amount <= 0) {
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
            currency_code: PAYPAL_CURRENCY,
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
    const purchaseUnits = order.result.purchase_units;

    if (
      order.result.status !== "CREATED" ||
      !order.result.id ||
      purchaseUnits?.length !== 1 ||
      purchaseUnits[0].reference_id !== booking._id.toString() ||
      !matchesPayPalAmount(purchaseUnits[0].amount, amount)
    ) {
      throw new Error("PayPal order does not match the booking");
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      {
        _id: booking._id,
        paypalOrderId: booking.paypalOrderId,
        paypalCaptureAttemptId: null,
        paymentStatus: { $ne: "paid" },
      },
      {
        $set: {
          paypalOrderId: order.result.id,
          paypalCaptureRequestId: randomUUID(),
          paymentStatus: "awaiting_payment",
        },
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(409).json({
        error: "Booking payment changed while creating the PayPal order",
      });
    }

    return res.json({
      id: order.result.id,
    });
  } catch (err) {
    console.error("❌ PayPal create order error:", {
      message: err.message,
    });

    return res.status(err.statusCode || 500).json({
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
  const attemptId = randomUUID();

  try {
    const { orderID, bookingId } = req.body;

    if (!orderID || !bookingId) {
      return res.status(400).json({ error: "Missing orderID or bookingId" });
    }

    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      throw new Error("Booking not found");
    }
    if (existingBooking.user?.toString() !== req.user?._id?.toString()) {
      throw Object.assign(new Error("Not authorized to pay for this booking"), {
        statusCode: 403,
      });
    }
    if (existingBooking.paypalOrderId !== orderID) {
      throw new Error("PayPal order does not belong to this booking");
    }
    if (existingBooking.paymentStatus === "paid") {
      return res.json({
        success: true,
        message: "PayPal payment was already recorded",
      });
    }

    const staleBefore = new Date(
      Date.now() - PAYPAL_CAPTURE_LOCK_TIMEOUT_MS
    );
    const captureRequestId =
      existingBooking.paypalCaptureRequestId || randomUUID();
    const booking = await Booking.findOneAndUpdate(
      {
        _id: bookingId,
        paypalOrderId: orderID,
        paymentStatus: { $ne: "paid" },
        $or: [
          { paypalCaptureAttemptId: null },
          { paypalCaptureAttemptId: { $exists: false } },
          { paypalCaptureStartedAt: { $lte: staleBefore } },
        ],
      },
      {
        $set: {
          paypalCaptureAttemptId: attemptId,
          paypalCaptureStartedAt: new Date(),
          paypalCaptureRequestId: captureRequestId,
        },
      },
      { new: true }
    );

    if (!booking) {
      const currentBooking = await Booking.findById(bookingId);
      if (!currentBooking) {
        throw new Error("Booking not found");
      }
      if (currentBooking.paypalOrderId !== orderID) {
        throw new Error("PayPal order does not belong to this booking");
      }
      if (currentBooking.paymentStatus === "paid") {
        return res.json({
          success: true,
          message: "PayPal payment was already recorded",
        });
      }
      return res.status(409).json({
        error: "PayPal capture is already in progress",
      });
    }

    const orderRequest = new paypal.orders.OrdersGetRequest(orderID);
    const orderResponse = await client.execute(orderRequest);
    let capture;

    if (orderResponse.result.status === "COMPLETED") {
      capture = getCompletedCapture(orderResponse.result, booking);
    } else {
      const purchaseUnit = getOrderPurchaseUnit(orderResponse.result, booking);
      if (!["CREATED", "APPROVED"].includes(orderResponse.result.status)) {
        throw new Error("PayPal order is not eligible for capture");
      }

      const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID);
      captureRequest.payPalRequestId(booking.paypalCaptureRequestId);
      captureRequest.requestBody({});
      const captureResponse = await client.execute(captureRequest);
      capture = getCompletedCapture(captureResponse.result, booking);

      if (
        captureResponse.result.purchase_units[0].reference_id !==
        purchaseUnit.reference_id
      ) {
        throw new Error("PayPal booking reference changed during capture");
      }
    }

    let alreadyPaid = false;
    await session.withTransaction(async () => {
      const currentBooking = await Booking.findById(bookingId)
        .populate("reward", "_id status")
        .session(session);

      if (!currentBooking) {
        throw new Error("Booking not found");
      }

      if (
        currentBooking.paypalOrderId !== orderID ||
        currentBooking.paypalCaptureAttemptId !== attemptId
      ) {
        throw new Error("PayPal capture attempt is no longer active");
      }

      if (currentBooking.paymentStatus === "paid") {
        alreadyPaid = true;
        return;
      }

      if (!matchesPayPalAmount(capture.amount, currentBooking.totalPrice)) {
        throw new Error("PayPal capture does not match the booking");
      }

      currentBooking.paymentStatus = "paid";
      currentBooking.isPaid = true;
      currentBooking.status = "pending";
      currentBooking.paypalCaptureAttemptId = null;
      currentBooking.paypalCaptureStartedAt = null;

      if (currentBooking.reward?._id) {
        await Reward.findOneAndUpdate(
          {
            _id: currentBooking.reward._id,
            status: { $ne: "USED" },
          },
          {
            status: "USED",
            usedAt: new Date(),
            lockedAt: null,
            booking: currentBooking._id,
            isSlotFull: false,
          },
          { session }
        );
      }

      await currentBooking.save({ session });
    });

    if (alreadyPaid) {
      return res.json({
        success: true,
        message: "PayPal payment was already recorded",
      });
    }

    return res.json({
      success: true,
      message: "PayPal payment captured successfully",
    });
  } catch (err) {
    if (req.body?.bookingId && typeof attemptId === "string") {
      try {
        await Booking.updateOne(
          { _id: req.body.bookingId, paypalCaptureAttemptId: attemptId },
          {
            $set: {
              paypalCaptureAttemptId: null,
              paypalCaptureStartedAt: null,
            },
          }
        );
      } catch (releaseError) {
        console.error("❌ PayPal capture lock release failed:", {
          message: releaseError.message,
          bookingId: req.body.bookingId,
        });
      }
    }

    console.error("❌ PayPal capture error:", {
      message: err.message,
      bookingId: req.body?.bookingId,
      orderID: req.body?.orderID,
    });

    return res.status(err.statusCode || 500).json({
      error: err.message || "Failed to capture PayPal payment",
    });
  } finally {
    session.endSession();
  }
};