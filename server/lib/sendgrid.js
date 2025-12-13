import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Get the SendGrid API key from environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// Ensure the API key exists
if (!SENDGRID_API_KEY) {
  throw new Error("❌ SENDGRID_API_KEY is missing");
}

// Set the SendGrid API key
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * Sends an email using SendGrid.
 * 
 * @param {{
 *   to: string,
 *   subject: string,
 *   html: string,
 *   replyTo?: string
 * }} params - Email parameters
 */
export const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const msg = {
      to,
      from: {
        email: "lecharlotlimousine@gmail.com", // verified sender
        name: "Le Charlot Limousine",
      },
      subject,
      html,
      ...(replyTo && { replyTo }), // only include replyTo if provided
    };

    await sgMail.send(msg);
    console.log(`📨 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error);
    throw error;
  }
};
