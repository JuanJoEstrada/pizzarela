const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const rateLimit = require("express-rate-limit");
const email = require('../services/email');

const squema = require('./validateSanitize/schema');
const validateReqSchema = require('./validateSanitize/reqSchema');
const validateAnswerTransactionFromIPN = require('./validateSanitize/answerTransactionIPN');
const PayService = require('../services/payService');
const PayServiceInstance = new PayService();

// Client can only access any endpoint 3 times in 1 minute.
const apiLimiter = rateLimit({
  // If you need a more robust solution, I recommend using an external store
  // He just recomeds Redis Store, Memcached Store, Mongo Store. But not connect-pg-simple
  // store: new (require('connect-pg-simple')(session))()
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // 3 requests,
  message: "Demasiadas peticiones de la misma IP, por favor inténtalo más tarde.",
});

module.exports = app => {
  
  app.use('/payForm', router);
  
  // Use to limit repeated requests to public APIs and/or endpoints such as password reset
  router.post('/', apiLimiter, squema, validateReqSchema, async (req, res, next) => {
    
    try {
      const bodyChecked = await PayServiceInstance.totalPriceRight(req.body);
      const orderId = await PayServiceInstance.registerOrderOnline(bodyChecked);
      const response = await PayServiceInstance.callFormToken(bodyChecked, orderId);

      if (response.status !== 'SUCCESS') {
        await PayServiceInstance.unsuccessfulFormToken(orderId);
        throw createError(502, 'Form Token Unsuccessful');
      }

      res.status(200).send(response);

    } catch (err) {

      email.mailOptions.subject = 'Error in /payFrom rout';
      email.mailOptions.text = `${err} On ${Date()}`;
      email.transporter.sendMail(email.mailOptions);
      next(err);

    }

  });

  router.post('/status', validateAnswerTransactionFromIPN, async (req, res, next) => {

    // remember req.body['kr-answer'] is a string
    const answer = JSON.parse(req.body['kr-answer'])
    
    try {

      await PayServiceInstance.checkIPNstatus(answer);
      res.status(200).send('ok');

    } catch (err) {

      email.mailOptions.subject = 'Error in /payFrom/status rout';
      email.mailOptions.text = `${err} On ${Date()}`;
      email.transporter.sendMail(email.mailOptions);
      next(err);

    }

  });

};
