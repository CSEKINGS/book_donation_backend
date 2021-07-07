const nodemailer = require("nodemailer");

const sendEmail = (data) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GPASS,
    },
  });

  const mailOptions = {
    to: data.email,
    subject: data.subject,
    html: data.profile,
  };

  transporter.sendMail(mailOptions, function (err, info, next) {
    if (err) {
      next(err);
    } else {
      return true;
    }
  });
};

module.exports = sendEmail;