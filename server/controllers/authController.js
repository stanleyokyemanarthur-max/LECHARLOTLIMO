import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../lib/nodemailer.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

// controllers/authController.js (update registerUser)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, birthday } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      birthday,
    });

    await sendEmail({
      to: email,
      subject: "Welcome to Le Charlot Limousine",
      html: `<p>Hi ${name}, welcome to Le Charlot Limousine!</p>`,
    });

    // Return user info ONLY — no token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      message: "Account created. Please login to continue."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// controllers/authController.js getCurrentUser
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// Login Step 1: Request OTP / TOTP
// ---------------------------
export const loginRequest = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // If user has enabled authenticator, require TOTP next
    if (user.isTOTPEnabled) {
      return res.json({ mfa: "TOTP_REQUIRED", email: user.email });
    }

    // Otherwise: use email OTP fallback (always for non-TOTP users)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.mfaCode = await bcrypt.hash(otp, 10);
    user.mfaCodeExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your Le Charlot Limousine OTP",
      html: `<p>Your login code is <strong>${otp}</strong> — it expires in 5 minutes.</p>`,
    });

    return res.json({ message: "OTP sent to your email", email: user.email });
  } catch (error) {
    console.error("loginRequest error:", error);
    return res.status(500).json({ message: error.message });
  }
};


// ---------------------------
// Login Step 2: Verify OTP
// ---------------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isTOTPEnabled) return res.json({ mfa: "TOTP_REQUIRED", email: user.email });

    if (!user.mfaCode || !user.mfaCodeExpiry) return res.status(400).json({ message: "OTP not generated" });
    if (user.mfaCodeExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const isValid = await bcrypt.compare(otp, user.mfaCode);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    user.mfaCode = undefined;
    user.mfaCodeExpiry = undefined;
    await user.save();

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isTOTPEnabled: user.isTOTPEnabled,
        token: generateToken(user._id, user.role)
      },
      token: generateToken(user._id, user.role)
    });


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// Enable TOTP
export const enableTOTP = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.user._id);

    // Generate secret if user has none
    if (!user.totpSecret) {
      const secret = speakeasy.generateSecret({
        length: 20,
        name: user.email,
        issuer: "Le Charlot Limousine",
      });
      user.totpSecret = secret.base32;
      user.totpSetupPending = true;
      await user.save();
    }


    const otpauthUrl = `otpauth://totp/${encodeURIComponent(
      user.email
    )}?secret=${user.totpSecret}&issuer=${encodeURIComponent("Le Charlot Limousine")}`;

    const qrCode = await QRCode.toDataURL(otpauthUrl);

    res.json({
      qrCode,
      secret: user.totpSecret,
      alreadyEnabled: user.isTOTPEnabled,
      message: user.isTOTPEnabled
        ? "Authenticator already enabled. Backup QR provided."
        : "Scan this QR code in your authenticator app.",
    });
  } catch (error) {
    console.error("Enable TOTP failed:", error);
    return res.status(500).json({ message: "Failed to generate QR" });
  }
};




// Verify TOTP Setup
export const verifyTOTPSetup = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || code.trim().length !== 6)
      return res.status(400).json({ message: "Invalid code" });

    if (!req.user?._id)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id);
    if (!user || !user.totpSecret)
      return res.status(400).json({ message: "No TOTP secret found" });

    // ----- DEBUGGING -----
    const expectedCode = speakeasy.totp({
      secret: user.totpSecret,
      encoding: "base32",
    });
    console.log("Expected TOTP code (server):", expectedCode);
    console.log("Code received from client:", code.trim());

    const isValid = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: code.trim(),
      window: 1,
    });

    if (!isValid) {
      console.log("TOTP verification failed!");
      return res.status(400).json({ message: "Invalid TOTP code" });
    }

    user.isTOTPEnabled = true;
    user.totpSetupPending = false;
    await user.save();

    return res.json({ message: "Authenticator enabled successfully" });
  } catch (error) {
    console.error("Verify TOTP setup error:", error);
    return res.status(500).json({ message: "Failed to verify TOTP" });
  }
};



// Verify TOTP Login

export const verifyTOTPLogin = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.totpSecret) {
      console.log("TOTP ERROR: No totpSecret stored for user.");
      return res.status(400).json({ message: "TOTP not set up for this user" });
    }


    const isValid = speakeasy.totp.verify({ secret: user.totpSecret, encoding: "base32", token: code, window: 1 });
    if (!isValid) return res.status(400).json({ message: "Invalid code" });

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone:user.phone,
        role: user.role,
        isTOTPEnabled: true,
        token: generateToken(user._id, user.role),
      },
      token: generateToken(user._id, user.role),
    });


  } catch (err) {
    console.error("verifyTOTPLogin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// Get Profile
// ---------------------------
export const getProfile = async (req, res) => {
  if (!req.user) return res.status(404).json({ message: "User not found" });
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone, role: req.user.role });
};

// ---------------------------
// Update Profile
// ---------------------------
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);

    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, role: updatedUser.role, token: generateToken(updatedUser._id, updatedUser.role) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// Password Reset Request
// ---------------------------
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const rawToken = `${user._id}-${Date.now()}`;
    const hashedToken = await bcrypt.hash(rawToken, 10);

    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetLink = `https://yourwebsite.com/reset-password?token=${encodeURIComponent(rawToken)}`;
    await sendEmail({ to: email, subject: "Password Reset", html: `<p>Click <a href="${resetLink}">here</a> to reset. Expires in 1h.</p>` });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// Change Password (Logged-in)
// ---------------------------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// Reset Password With Token
// ---------------------------
export const resetPasswordWithToken = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const isValid = await bcrypt.compare(token, user.resetToken);
    if (!isValid) return res.status(400).json({ message: "Invalid token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------------------------
// Reset Authenticator (TOTP)
// POST /api/auth/reset-totp
export const resetTOTP = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1️⃣ Remove TOTP
    user.isTOTPEnabled = false;
    user.totpSecret = null;

    // 2️⃣ Generate Email OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.mfaCode = await bcrypt.hash(otp, 10);
    user.mfaCodeExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // 3️⃣ Send OTP to email
    await sendEmail({
      to: user.email,
      subject: "Reset Authenticator Verification Code",
      html: `<p>Your verification code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    // ✅ Return only email, no token yet
    return res.json({ message: "OTP sent to your email", email: user.email });
  } catch (error) {
    console.error("Reset TOTP error:", error);
    return res.status(500).json({ message: "Failed to reset authenticator" });
  }
};


// POST /reset-authenticator-login
export const resetAuthenticatorLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if OTP exists and is valid
    if (!user.mfaCode || !user.mfaCodeExpiry || user.mfaCodeExpiry < Date.now())
      return res.status(400).json({ message: "OTP invalid or expired" });

    const valid = await bcrypt.compare(otp, user.mfaCode);
    if (!valid) return res.status(400).json({ message: "Invalid OTP" });

    // Reset TOTP
    user.totpSecret = null;
    user.isTOTPEnabled = false;
    user.mfaCode = undefined;
    user.mfaCodeExpiry = undefined;
    await user.save();

    // Send login token
    res.json({
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isTOTPEnabled: false,
    token: generateToken(user._id, user.role)
  },
  token: generateToken(user._id, user.role)
});


  } catch (err) {
    console.error("resetAuthenticatorLogin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// POST /api/auth/request-totp-reset
export const requestTOTPReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.mfaCode = await bcrypt.hash(otp, 10);
    user.mfaCodeExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    await sendEmail({
      to: email,
      subject: "Reset Authenticator Verification Code",
      html: `<p>Your verification code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    return res.json({ message: "OTP sent to your email", email: user.email });
  } catch (err) {
    console.error("TOTP reset request failed:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};
// Enable TOTP (email-only users)
export const enableTOTPEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate secret if none exists
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

    res.json({
      qrCode,
      secret: user.totpSecret,
      message: user.isTOTPEnabled
        ? "Authenticator already enabled. Backup QR provided."
        : "Scan this QR code in your authenticator app.",
    });
  } catch (err) {
    console.error("Enable TOTP (email) error:", err);
    res.status(500).json({ message: "Failed to generate QR" });
  }
};

// Verify TOTP setup (email-only users)
export const verifyTOTPSetupEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code || code.trim().length !== 6)
      return res.status(400).json({ message: "Missing or invalid fields" });

    const user = await User.findOne({ email });
    if (!user || !user.totpSecret) return res.status(400).json({ message: "No TOTP secret found" });

    const isValid = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: "base32",
      token: code.trim(),
      window: 1,
    });

    if (!isValid) return res.status(400).json({ message: "Invalid TOTP code" });

    user.isTOTPEnabled = true;
    await user.save();

    res.json({ message: "Authenticator enabled successfully" });
  } catch (err) {
    console.error("verifyTOTPSetupEmail error:", err);
    res.status(500).json({ message: "Failed to verify TOTP" });
  }
};
