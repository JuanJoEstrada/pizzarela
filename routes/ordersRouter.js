const express = require('express');
const router = express.Router();
const SSE = require('express-sse');
const email = require('../services/email');

const OrdersService = require('../services/ordersService');
const OrdersServiceInstance = new OrdersService();

const { isAuth } = require('./authenticated/authenticated');

module.exports = app => {

  app.use('/orders', isAuth, router);
  // app.use('/orders', router);

  router.get('/', async (req, res, next) => {
    
    try {
      
      const response = await OrdersServiceInstance.paidOrders();
      res.status(200).send(response);

    } catch (err) {

      email.mailOptions.subject = 'Error in /orders/ rout';
      email.mailOptions.text = `${err} On ${Date()}`;
      email.transporter.sendMail(email.mailOptions);
      next(err);

    }
  });
    
   router.post('/process', async (req, res, next) => {

    try {

      await OrdersServiceInstance.orderProcess(req.body);
      res.status(200).send('ok');

    } catch (err) {

      email.mailOptions.subject = 'Error in /orders/process rout';
      email.mailOptions.text = `${err} On ${Date()}`;
      email.transporter.sendMail(email.mailOptions);
      next(err)

    }

   });

};

