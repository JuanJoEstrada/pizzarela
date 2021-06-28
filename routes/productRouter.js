const express = require('express');
const router = express.Router();
const email = require('../services/email')

const ProductService = require("../services/productService");
const ProductServiceInstance = new ProductService();

module.exports = app => {

  app.use('/pizzas', router);

  router.get('/', async (req, res, next) => {
    
    try {
      
      const response = await ProductServiceInstance.productsList();
      res.status(200).send(response);

    } catch (err) {

      email.mailOptions.subject = 'Error in /pizzas rout';
      email.mailOptions.text = `${err} On ${Date()}`;
      email.transporter.sendMail(email.mailOptions);
      next(err);

    }
  });

};
