import { sendEmail } from "../lib/nodemailer.js";

export const contactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong><br/>${message}</p>
  `;

  try {
    await sendEmail({
      to: "info@lecharlotlimousine.com", // client inbox
      subject: `[Contact Form] ${subject}`,
      html,
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message" });
  }
};
