const axios = require('axios');

const sendEmail = async ({ email, subject, message }) => {
  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { name: 'Expense Tracker', email: process.env.EMAIL },
      to: [{ email }],
      subject,
      textContent: message,
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
};

module.exports = sendEmail;
