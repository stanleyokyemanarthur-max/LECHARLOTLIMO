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
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { bookingValidationRules } from "../validators/bookingValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

// 📊 Public: Estimate booking cost
router.get("/estimate", estimateBooking);
// Assign driver (admin)
router.put("/:id/assign-driver", protect, adminOnly, assignDriver);


// 📝 Create booking (customer only, with validation)
router.post("/", protect, bookingValidationRules, validateRequest, createBooking);

// 📌 Get bookings for logged-in user
router.get("/my-bookings", protect, getUserBookings);

// 📌 Admin: Get all bookings
router.get("/", protect, adminOnly, getAllBookings);

// 🔄 Update booking status (admin)
router.put("/:id/status", protect, adminOnly, updateBookingStatus);
router.get("/driver", protect, getDriverBookings);



// ❌ Cancel booking (user only)
router.put("/:id/cancel", protect, cancelBooking);

export default router;
