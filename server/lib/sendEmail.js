import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("❌ RESEND_API_KEY is missing");
}

const resend = new Resend(RESEND_API_KEY);

/**
 * Send Email Function
 */

export const sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    if (!to) throw new Error("Recipient email is required");
    if (!subject) throw new Error("Email subject is required");
    if (!html) throw new Error("Email HTML is required");

    const response = await resend.emails.send({
      from: "Le Charlot Limousine <mail.lecharlotlimousine.com>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo && { reply_to: replyTo }),
    });

    console.log(`📨 Email sent to ${to}`, response?.id);

    return response;
  } catch (error) {
    console.error("❌ Resend error:", error.message);
    throw error;
  }
};