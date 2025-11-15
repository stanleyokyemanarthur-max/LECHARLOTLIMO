import express from "express";
import {
  createCheckoutSession,
  handleCancelledPayment,
  verifyPaymentStatus
} from "../controllers/paymentController.js";

const router = express.Router();

// 💳 Create Stripe checkout session
router.post("/create-checkout-session", createCheckoutSession);

// ❌ Handle cancelled or failed payment
router.get("/cancel", handleCancelledPayment);
router.get("/verify", verifyPaymentStatus);

export default router;
