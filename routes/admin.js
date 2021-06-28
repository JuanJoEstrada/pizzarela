const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { isAuthLogin } = require('./authenticated/authenticated');

const apiLimiter = rateLimit({
  // If you need a more robust solution, I recommend using an external store
  // He just recomeds Redis Store, Memcached Store, Mongo Store. But not connect-pg-simple
  // store: new (require('connect-pg-simple')(session))()
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // 3 requests,
  message: "Demasiadas peticiones de la misma IP, por favor inténtalo más tarde.",
});

module.exports = (app, passport) => {

  app.use('/cajePizLaIm', router);

  router.get('/login',apiLimiter, isAuthLogin, async (req, res, next) => {
    
    try {
      
      res.send(`
        <form method="POST" action="/cajePizLaIm/login" >
          <div>
            <label>Username:</label>
            <input type="text" name="username"/>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password"/>
          </div>
          <div>
            <input type="submit" value="Log In"/>
          </div>
        </form>
      `);

    } catch (err) {
      next(err);
    }
  });

  router.get('/logout', async (req, res, next) => {
    req.logout();
    res.redirect('/');
  });

  router.post('/login', apiLimiter, passport.authenticate('local', { successRedirect: '/vistaCajero', failureRedirect: '/cajePizLaIm/login' }));

};
