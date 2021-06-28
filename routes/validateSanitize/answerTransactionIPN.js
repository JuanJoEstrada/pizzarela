const createError = require('http-errors');
const sha256 = require('js-sha256');
const { IZIPASSWORD } = require('../../config/config');
const { PRODUCTION } = require('../../config/config');
const email = require('../../services/email')

const isPorduction = PRODUCTION === 'production'

const validateAnswerTransactionFromIPN = (req, res, next) => {
  // This will work only with true IPN
  // console.log('Recuerda activar la verificación de la IPN cuando estés haciendo pruebas no localmente')
  if (isPorduction) {
    
    const hash = sha256.hmac(IZIPASSWORD, req.body['kr-answer']);
    if (hash !== req.body['kr-hash']) {
      const err = createError(502, 'Respuesta alterada por terceros')
      email.mailOptions.subject = 'Error in validateAnswerTransactionFromIPN middleware';
      email.mailOptions.text = `${err} On ${Date()}`;
      email.transporter.sendMail(email.mailOptions);
      next(err);
    } else {
      next();
    }
    
  } else {
    next();
  }
};

module.exports = validateAnswerTransactionFromIPN;