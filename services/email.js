const nodemailer = require('nodemailer');
const config = require('../config/config')

// Create the transporter with the required configuration for Outlook
// change the user and pass !
let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
     ciphers:'SSLv3'
  },
  auth: {
      user: config.OUTLOOKUSER,
      pass: config.OUTLOOKPASSWORD
  }
});

// setup e-mail data, even with unicode symbols
let mailOptions = {
  from: '"Pizzarela Artesanal " <pizzarelaArtesanal@outlook.com>', // sender address (who sends)
  to: 'juan_estrada_1@hotmail.com', // list of receivers (who receives)
  // subject: 'Hello ',
  // text: 'Hello world ',
};

module.exports = {
  transporter,
  mailOptions,
}