// utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS on port 587
  family: 4, // Force IPv4 for cloud hosts like Render
  auth: {
    user: process.env.DELIVERY_EMAIL,
    pass: process.env.APPPWD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Reusable helper function to send emails across your app
 */
export const sendEmail = async ({
  emailName,
  to,
  subject,
  text,
  html,
  replyTo,
}) => {
  return await transporter.sendMail({
    from: {
      name: emailName,
      address: process.env.SUPPORT_EMAIL,
    },
    to,
    subject,
    text,
    html,
    replyTo,
  });
};

export default transporter;
