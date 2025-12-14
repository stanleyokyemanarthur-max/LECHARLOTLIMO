import User from "../models/User.js";
import { sendEmail } from "../lib/sendgrid.js";
import twilio from "twilio";
import dotenv from "dotenv";

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

    const emailJobs = [];
    const smsJobs = [];

    for (const user of users) {
      // 📧 EMAIL
      if ((channel === "email" || channel === "both") && user.email) {
        emailJobs.push(
          sendEmail({
            to: user.email,
            subject,
            html: `<p>${message}</p>`,
          })
        );
      }

      // 📱 SMS
      if (
        (channel === "sms" || channel === "both") &&
        user.phone &&
        twilioClient
      ) {
        smsJobs.push(
          twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to: user.phone,
          })
        );
      }
    }

    // Run all jobs in parallel
    await Promise.all([...emailJobs, ...smsJobs]);

    return res.json({
      success: true,
      emailSent: emailJobs.length,
      smsSent: smsJobs.length,
    });
  } catch (error) {
    console.error("❌ Broadcast error:", error);
    return res.status(500).json({ message: "Broadcast failed" });
  }
};
