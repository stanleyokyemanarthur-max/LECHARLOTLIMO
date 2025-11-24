import express from "express";
import {
  registerUser,
  loginRequest,
  verifyOtp,
  getProfile,
  updateProfile,
  requestPasswordReset,
  resetPasswordWithToken,
  changePassword,
  verifyTOTPLogin,
  verifyTOTPSetup,
  enableTOTP
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ---------------------------
// Public routes
// ---------------------------
router.post("/register", registerUser);                  // Register new user
router.post("/login", loginRequest);                     // Step 1: password + send OTP
router.post("/verify-otp", verifyOtp);                  // Step 2: verify OTP & issue JWT
router.post("/request-password-reset", requestPasswordReset); // Request reset email
router.put("/reset-password", resetPasswordWithToken);        // Reset via token
router.post("/verify-totp-login", verifyTOTPLogin);     // Verify TOTP during login

// ---------------------------
// Protected routes
// ---------------------------
router.get("/profile", protect, getProfile);           // Get logged-in user profile
router.put("/profile", protect, updateProfile);        // Update profile
router.put("/change-password", protect, changePassword); // Change password while logged in

router.post("/enable-totp", protect, enableTOTP);      // Generate TOTP secret & QR
router.post("/verify-totp-setup", protect, verifyTOTPSetup); // Verify TOTP setup

// ---------------------------
// Admin-only routes
// ---------------------------
router.get("/admin/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
