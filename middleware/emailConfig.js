const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'Lavoro', // Replace with your Mailtrap username
    pass: 'Lavoro@esprit2025'
  },
});

module.exports = transporter;


