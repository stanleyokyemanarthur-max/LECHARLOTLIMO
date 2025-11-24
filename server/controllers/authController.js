import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../lib/nodemailer.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";


// ---------------------------
// Register User
// ---------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Optionally send welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to Le Charlot Limousine",
      html: `<p>Hi ${name}, welcome to Le Charlot Limousine!</p>`,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// Login Step 1: Request OTP (MFA)
// ---------------------------
export const loginRequest = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // 🔥 If TOTP enabled → skip email OTP
    if (user.isTOTPEnabled) {
      return res.json({ mfa: "TOTP_REQUIRED", email: user.email });
    }

    // 🔥 Otherwise generate email OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.mfaCode = await bcrypt.hash(otp, 10);
    user.mfaCodeExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your MFA/OTP Code",
      html: `<p>Your OTP code is <strong>${otp}</strong>. Expires in 5 minutes.</p>`,
    });

    res.json({ message: "OTP sent to your email", email: user.email });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------------------------
// Login Step 2: Verify OTP & Issue JWT
// ---------------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isTOTPEnabled) {
      return res.json({ mfa: "TOTP_REQUIRED", email: user.email });
    }


    if (!user.mfaCode || !user.mfaCodeExpiry)
      return res.status(400).json({ message: "OTP not generated" });

    if (user.mfaCodeExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const isValid = await bcrypt.compare(otp, user.mfaCode);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    // Clear OTP after verification
    user.mfaCode = undefined;
    user.mfaCodeExpiry = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/enable-totp
export const enableTOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a new TOTP secret
    const secret = speakeasy.generateSecret({
      name: "Le Charlot Limousine",
      length: 20,
    });

    // Save secret in user document (TOTP not yet enabled)
    user.totpSecret = secret.base32;
    await user.save();

    // Generate QR code image
    const qrImage = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      qrCode: qrImage,
      secret: secret.base32,
      message: "Scan this QR code in Google Authenticator or Authy to set up TOTP",
    });
  } catch (error) {
    console.error("enableTOTP error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const verifyTOTPSetup = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user._id);

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) return res.status(400).json({ message: "Invalid code" });

    user.isTOTPEnabled = true;
    await user.save();

    res.json({ message: "Authenticator App enabled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyTOTPLogin = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isValid = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!isValid) return res.status(400).json({ message: "Invalid code" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};



// ---------------------------
// Get Profile (Protected)
// ---------------------------
export const getProfile = async (req, res) => {
  if (!req.user) return res.status(404).json({ message: "User not found" });

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
  });
};

// ---------------------------
// Update Profile (Protected)
// ---------------------------
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      token: generateToken(updatedUser._id, updatedUser.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// Password Reset Request (Public)
// ---------------------------
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const rawToken = `${user._id}-${Date.now()}`;
    const hashedToken = await bcrypt.hash(rawToken, 10);

    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `https://yourwebsite.com/reset-password?token=${encodeURIComponent(rawToken)}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Hi ${user.name}, click <a href="${resetLink}">here</a> to reset your password. Expires in 1 hour.</p>`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Change Password (Logged-in user)
// ---------------------------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ---------------------------
// Reset Password (Protected / Link Verification)
// ---------------------------
export const resetPasswordWithToken = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const isValid = await bcrypt.compare(token, user.resetToken);
    if (!isValid) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
