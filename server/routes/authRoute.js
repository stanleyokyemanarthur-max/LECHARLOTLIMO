import express from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";
import User from "../models/User.js";
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
  enableTOTP,
  resetTOTP,
  requestTOTPReset,
  resetAuthenticatorLogin,
  verifyTOTPSetupEmail,
  enableTOTPEmail,
  getCurrentUser
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { sendEmail } from "../lib/nodemailer.js"; // <-- make sure this exists
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ---------------------------
// Public routes
// ---------------------------
router.post("/register", registerUser);                  
router.post("/login", loginRequest);                     
router.post("/verify-otp", verifyOtp);                  
router.post("/request-password-reset", requestPasswordReset); 
router.put("/reset-password", resetPasswordWithToken);        
router.post("/verify-totp-login", verifyTOTPLogin);   
router.post("/reset-authenticator-login", resetAuthenticatorLogin);
router.post("/verify-totp-setup-email", verifyTOTPSetupEmail);




// ---------------------------
// Protected routes
// ---------------------------
router.get("/me", protect, getCurrentUser);
router.post("/verify-totp-setup", protect,verifyTOTPSetup);
router.get("/profile", protect, getProfile);           
router.put("/profile", protect, updateProfile);        
router.put("/change-password", protect, changePassword); 
router.post("/enable-totp", protect, enableTOTP);
router.post("/reset-totp", protect, resetTOTP);

       

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

// ---------------------------
// TOTP reset routes
// ---------------------------

// Request TOTP reset (sends email)
// POST /request-totp-reset (send OTP)
router.post("/request-totp-reset", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save hashed OTP with expiry
    user.mfaCode = await bcrypt.hash(otp, 10);
    user.mfaCodeExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send OTP email
    await sendEmail({
      to: email,
      subject: "Reset Authenticator Verification Code",
      html: `<p>Your verification code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
    });

    res.json({ message: "OTP sent to your email", email: user.email });
  } catch (err) {
    console.error("TOTP reset OTP failed:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// POST /enable-totp-email
router.post("/enable-totp-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate secret if missing
    if (!user.totpSecret) {
      const secret = speakeasy.generateSecret({
        length: 20,
        name: `Le Charlot Limousine (${user.email})`,
        issuer: "Le Charlot Limousine",
      });
      user.totpSecret = secret.base32;
      await user.save();
    }

    const otpauthUrl = `otpauth://totp/${encodeURIComponent(
      `Le Charlot Limousine (${user.email})`
    )}?secret=${user.totpSecret}&issuer=${encodeURIComponent("Le Charlot Limousine")}`;

    const qrCode = await QRCode.toDataURL(otpauthUrl);

    res.json({ qrCode, secret: user.totpSecret });
  } catch (err) {
    console.error("Enable TOTP (email) error:", err);
    res.status(500).json({ message: "Failed to generate QR" });
  }
});










export default router;
