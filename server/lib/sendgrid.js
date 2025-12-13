import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";


dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY) {
  throw new Error("❌ SENDGRID_API_KEY is missing");
}

sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * sendEmail function with optional replyTo
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML body
 * @param {string} [params.replyTo] - Optional reply-to email
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
    };

    if (replyTo) {
      msg.replyTo = replyTo; // add reply-to if provided
    }

    await sgMail.send(msg);
    console.log(`📨 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error);
    throw error;
  }
};
