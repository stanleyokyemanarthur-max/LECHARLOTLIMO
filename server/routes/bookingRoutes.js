import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  estimateBooking,
  getDriverBookings,
  assignDriver,
  confirmPayment,
  finalizeBookingQuote,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { bookingValidationRules } from "../validators/bookingValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";


const router = express.Router();

// 📊 Public: Estimate booking cost
router.post("/estimate", estimateBooking);
// Assign driver (admin)
router.put("/:id/assign-driver", protect, adminOnly, assignDriver);
router.patch("/bookings/:id/pay", confirmPayment);

router.post("/finalize-quote", protect, finalizeBookingQuote);
// 📝 Create booking (customer only, with validation)
router.post("/", protect, bookingValidationRules, validateRequest, createBooking);

// 📌 Get bookings for logged-in user
router.get("/my-bookings", protect, getUserBookings);

// 📌 Admin: Get all bookings
router.get("/", protect, adminOnly, getAllBookings);

// 🔄 Update booking status (admin)
router.put("/:id/status", protect, updateBookingStatus);
router.get("/driver", protect, getDriverBookings);



// ❌ Cancel booking (user only)
router.put("/:id/cancel", protect, cancelBooking);

export default router;
