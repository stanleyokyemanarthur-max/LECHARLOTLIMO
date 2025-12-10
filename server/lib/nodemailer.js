
import nodemailer from "nodemailer";

const email = process.env.EMAIL_ADDRESS;
const pass = process.env.EMAIL_PASS;

// Create transporter using Gmail SMTP + App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass,
  },
});

// Generic send email function
export const sendEmail = async ({ to, subject, html }) => {
  if (!email || !pass) {
    throw new Error("❌ EMAIL_ADDRESS or EMAIL_PASS missing in environment");
  }

  try {
    await transporter.sendMail({
      from: `"Le Charlot Limousine" <${email}>`,
      to,
      subject,
      html,
    });

    console.log(`📨 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

