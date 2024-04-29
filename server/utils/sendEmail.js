import nodemailer from "nodemailer";
import config from "./emailConfig.js";

const transporter = nodemailer.createTransport(config);

export const sendEmail = async (from, to, subject, text, html, files) => {
  try {
    const message = {
      from, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html content
    };

    if (files && files.length > 0) {
      message.attachments = files.map((file) => ({
        filename: file.originalname,
        path: file.path,
      }));
    }

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
