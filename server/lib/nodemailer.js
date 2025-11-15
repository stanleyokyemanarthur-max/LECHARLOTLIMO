import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 

const email =process.env.EMAIL_ADDRESS ;
const pass =process.env.EMAIL_PASS ;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass,
    
  },
});
console.log("EMAIL_ADDRESS:", process.env.EMAIL_ADDRESS);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


export const mailOptions = {
  from: `ANGELIC TOUCH CARES LLC <${email}>`,
  to: "lecharlotlimousine@gmail.com",
};
