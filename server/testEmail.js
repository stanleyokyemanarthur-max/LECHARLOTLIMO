import { transporter, mailOptions } from "./lib/nodemailer.js";

async function test() {
  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: "Test Email",
      text: "This is a test message",
    });
    console.log("Email sent successfully!");
  } catch (err) {
    console.error(err);
  }
}

test();
