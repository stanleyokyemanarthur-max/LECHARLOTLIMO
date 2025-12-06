import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    birthday: { type: Date },
    role: { type: String, enum: ["customer", "driver", "admin"], default: "customer" },
    address: { type: String },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "blocked"], default: "active" },

    // 🔹 Password reset fields
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },

    // 🔹 MFA / OTP fields
    mfaCode: { type: String },
    mfaCodeExpiry: { type: Date },

    totpSecret: { type: String },             // Base32 secret
    isTOTPEnabled: { type: Boolean, default: false },
    totpSetupPending: { type: Boolean, default: false },
    backupCodes: [{ type: String }],          // optional
    tempTOTPToken: String,
    tempTOTPTokenExpires: Date,

    // 🔹 TOTP reset fields (for "Reset Authenticator")
    totpResetToken: { type: String },
    totpResetExpires: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
