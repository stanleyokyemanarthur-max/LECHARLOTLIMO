import express from "express";
import {
  createCheckoutSession,
  handleCancelledPayment,
  verifyPaymentStatus
} from "../controllers/paymentController.js";
import { protect, customerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 💳 Create Stripe checkout session
router.post(
  "/create-checkout-session",
  protect,
  customerOnly,
  createCheckoutSession,
);

// ❌ Handle cancelled or failed payment
router.get("/cancel", handleCancelledPayment);
router.get("/verify", verifyPaymentStatus);

export default router;
