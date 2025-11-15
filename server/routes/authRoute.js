import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  resetPassword,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getProfile);   // ✅ still here
router.put("/profile", protect, updateProfile); // ✅ still here
router.put("/reset-password", protect, resetPassword);

// Admin-only routes
router.get("/admin/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
