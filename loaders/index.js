const express = require('express');
const expressLoader = require('./express');
const passportLoader = require('./passport');
const routeLouder = require('../routes/index');
const { isAuth } = require('../routes/authenticated/authenticated');

module.exports = async app => {

  // Load express midlewares
  const expressApp = await expressLoader(app);

  // Load Passport middleware
  const passport = await passportLoader(expressApp);
  
  
  // Load API route handlers
  await routeLouder(expressApp, passport);
  
  // Load Admin if authenticated
  app.use('/vistaCajero', [isAuth, express.static('admin')]);

  // Error handler
  // Notice that when not calling “next” in an error-handling function,
  // you are responsible for writing (and ending) the response.
  // Otherwise those requests will “hang” and will not be eligible for garbage collection
  // That's why "return"
  app.use((err, req, res, next) => {
    console.log(`Error message: ${err.message}`)
    const { message, status } = err;
    return res.status(status).send({ message });
  });

};