const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'ed1b5cabd5a035', // Replace with your Mailtrap username
    pass: 'd1f25b4988e46a', // Replace with your Mailtrap password
  },
});

module.exports = transporter;


