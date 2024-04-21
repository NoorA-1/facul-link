import nodemailer from "nodemailer";
import config from "./emailConfig.js";

const transporter = nodemailer.createTransport(config);

export const sendEmail = async (from, to, subject, text, html) => {
  try {
    const message = {
      from, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    };

    const info = await transporter.sendMail(message);
    console.log(info);
    return {
      messageId: info.messageId,
      link: nodemailer.getTestMessageUrl(info),
      success: true,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message,
      // errorCode: error.code,
    };
  }
};
