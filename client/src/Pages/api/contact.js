import { mailOptions, transporter } from "../../../../server/lib/nodemailer";

const CONTACT_MESSAGE_FIELDS = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  subject: "Subject",
  message: "Message",
};

const generateEmailContent = (data) => {
  const stringData = Object.entries(data).reduce(
    (str, [key, val]) => (str += `${CONTACT_MESSAGE_FIELDS[key]}:\n${val}\n\n`),
    ""
  );

  const htmlData = Object.entries(data).reduce(
    (str, [key, val]) =>
      str +
      `<h3 style="font-weight:600; margin:0 0 4px;">${CONTACT_MESSAGE_FIELDS[key]}</h3>
       <p style="margin:0 0 12px;">${val}</p>`,
    ""
  );

  return {
    text: stringData,
    html: `<html>
             <body style="margin:0; padding:20px; font-family:Arial, sans-serif;">
               <h2>New Contact Message</h2>
               <div style="border:1px solid #ddd; padding:20px; margin-top:20px;">
                 ${htmlData}
               </div>
             </body>
           </html>`,
  };
};

// **Auto-reply content**
const generateAutoReply = (name) => ({
  subject: "We Received Your Message",
  text: `Hi ${name},\n\nThank you for contacting us! We received your message and will get back to you shortly.\n\nBest regards,\nAngelic Touch Cares LLC`,
  html: `<html>
           <body style="font-family:Arial, sans-serif; padding:20px;">
             <h2>Hi ${name},</h2>
             <p>Thank you for contacting us! We received your message and will get back to you shortly.</p>
             <p>Best regards,<br/>Angelic Touch Cares LLC</p>
           </body>
         </html>`,
});

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const data = req.body;

  if (!data || !data.name || !data.email || !data.phone || !data.subject || !data.message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1️⃣ Send main email to company
    await transporter.sendMail({
      ...mailOptions,
      subject: data.subject,
      ...generateEmailContent(data),
    });

    // 2️⃣ Send auto-reply to user
    await transporter.sendMail({
      from: mailOptions.from,
      to: data.email,
      ...generateAutoReply(data.name),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
