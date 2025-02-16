const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '22e273f19d1abd', // Replace with your Mailtrap username
    pass: '4531a931d009dc', // Replace with your Mailtrap password
  },
});

module.exports = transporter;


