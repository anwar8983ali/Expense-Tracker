const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter object. This is the service that sends the email.
  // We are configuring it for Gmail.
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email address from the .env file
      pass: process.env.EMAIL_PASS, // Your email password or app password from the .env file
    },
  });

  // 2. Define the email options (who to send it to, subject, content).
  const mailOptions = {
    from: `Expense Tracker <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Use the transporter to send the email.
  await transporter.sendMail(mailOptions);
};

// 4. Export the function so other files (like App.js) can use it.
module.exports = sendEmail;