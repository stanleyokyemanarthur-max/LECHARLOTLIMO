import { mailOptions, transporter } from "../lib/nodemailer.js";

// Helper to generate HTML content for company email
const generateCompanyEmailContent = (data) => `
  <h2>New Contact Message</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Phone:</strong> ${data.number}</p>
  <p><strong>Subject:</strong> ${data.subject}</p>
  <p><strong>Message:</strong> ${data.message}</p>
`;

const generateAutoReplyContent = (name) => ({
  subject: "We Received Your Message",
  text: `Hi ${name},\n\nThank you for contacting us! We received your message and will get back to you shortly.\n\nBest regards,\nAngelic Touch Cares LLC`,
  html: `<p>Hi ${name},</p>
         <p>Thank you for contacting us! We received your message and will get back to you shortly.</p>
         <p>Best regards,<br/>Angelic Touch Cares LLC</p>`,
});

export const sendContactEmail = async (req, res) => {
  const data = req.body;

  // Validation
  if (!data || !data.name || !data.email || !data.number || !data.subject || !data.message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1️⃣ Send email to company
    await transporter.sendMail({
      ...mailOptions,
      subject: `Contact Form: ${data.subject}`,
      html: generateCompanyEmailContent(data),
      text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.number}
Subject: ${data.subject}
Message: ${data.message}
      `,
    });

    // 2️⃣ Send auto-reply to user
    await transporter.sendMail({
      from: mailOptions.from,
      to: data.email,
      ...generateAutoReplyContent(data.name),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
