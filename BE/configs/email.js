const nodemailer = require("nodemailer");
const { GeneralSetting } = require("../models/GeneralSetting");

const sendEmail = async (to, subject, html) => {
  
  let fromEmail = process.env.EMAIL_FROM;

  try {
    const setting = await GeneralSetting.findOne();
    if (setting?.supportEmail) {
      fromEmail = `${setting.platformName} <${setting.supportEmail}>`;
      console.log(fromEmail);
    }
  } catch (err) {
    console.error("Failed to fetch general settings for email:", err);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
