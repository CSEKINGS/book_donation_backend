const nodemailer = require("nodemailer");

const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host:process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    to: data.email,
    subject: data.subject,
    html: data.profile,
  };

  return await transporter.sendMail(mailOptions).then((info) => { return { "info": info } }).catch((err) => { return { "err": err } });

};

module.exports = sendEmail;