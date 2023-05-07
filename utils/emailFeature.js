const nodemailer = require('nodemailer')



exports.getMail = async (options) => {
const transport = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port : process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

const mailOptions = {
  from: 'Team tourApp <mailservices@tourApp.com>',
  to: options.email,
  subject: options.subject,
  text: options.message,
};

await transport.sendMail(mailOptions)
}
