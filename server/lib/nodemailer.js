
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.EMAIL_ADDRESS;
const pass = process.env.EMAIL_PASS;

if (!email || !pass) {
  throw new Error("EMAIL_ADDRESS or EMAIL_PASS not set in .env");
}

// Create transporter using Gmail SMTP + App Password
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass, // App Password from Google
  },
});

// Generic send email function
export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Le Charlot Limousine" <${email}>`, // sender name & address
      to,       // recipient(s)
      subject,  // email subject
      html,     // email content (HTML)
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
