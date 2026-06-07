import express from "express";
import upload from "../middleware/multer.js";
import {
  createCar,
  getCars,
  getCar,
  updateCar,
  deleteCar,
  getFleetAvailability
} from "../controllers/carController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🚗 Public routes (no authentication needed)
router.get("/", getCars);                      // Get all cars // Check available cars
router.get("/availability", getFleetAvailability); // Check fleet availability
router.get("/:id", getCar);                    // Get single car
// 🔒 Admin-only routes (secured)
router.post("/", protect, adminOnly, upload.single("image"), createCar);
router.put("/:id", protect, adminOnly, upload.single("image"), updateCar);
router.delete("/:id", protect, adminOnly, deleteCar);

export default router;
