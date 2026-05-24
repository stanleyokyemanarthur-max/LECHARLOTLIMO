import User from "../models/User.js";
import { sendEmail } from "../lib/sendEmail.js";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

// Initialize Twilio ONLY if credentials exist
let twilioClient = null;

if (
  process.env.TWILIO_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_PHONE
) {
  twilioClient = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log("✅ Twilio SMS enabled");
} else {
  console.log("⚠️ Twilio SMS disabled (missing credentials)");
}

export const broadcastMessage = async (req, res) => {
  const { channel, subject, message } = req.body;

  if (!message || (channel !== "sms" && !subject)) {
    return res.status(400).json({ message: "Invalid broadcast payload" });
  }

  try {
    const users = await User.find({}, "email phone");

    let emailSent = 0;
    let smsSent = 0;

    // 🔁 Process in batches (prevents overload)
    const batchSize = 20;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      const jobs = batch.map(async (user) => {
        try {
          // 📧 EMAIL
          if ((channel === "email" || channel === "both") && user.email) {
            await sendEmail({
              to: user.email,
              subject,
              html: `<p>${message}</p>`,
            });
            emailSent++;
          }

          // 📱 SMS
          if (
            (channel === "sms" || channel === "both") &&
            user.phone &&
            twilioClient
          ) {
            await twilioClient.messages.create({
              body: message,
              from: process.env.TWILIO_PHONE,
              to: user.phone,
            });
            smsSent++;
          }
        } catch (err) {
          console.error(`❌ Failed for user ${user.email || user.phone}`, err.message);
        }
      });

      // ✅ safer than Promise.all (won’t crash everything)
      await Promise.allSettled(jobs);
    }

    return res.json({
      success: true,
      emailSent,
      smsSent,
    });
  } catch (error) {
    console.error("❌ Broadcast error:", error);
    return res.status(500).json({ message: "Broadcast failed" });
  }
};