const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('../config/db')
const helmet = require("helmet");
const createError = require('http-errors');
const { PRODUCTION, SESSION } = require('../config/config');

const isProduction = PRODUCTION === 'production';
const whitelist = ['https://pizzarela-artesanal.herokuapp.com/', 'https://static.micuentaweb.pe'];
const corsOptions = {
  origin: isProduction ? 
    function (origin, callback) {
      // If you do not want to block REST tools or server-to-server requests, add a !origin check
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(createError(502, 'Not allowed by CORS'))
      }
    } 
    : "*",
  methos: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: true,
};

module.exports = app => {

  app.use(express.static('public'));

  // You are using compression because of express-sse
  // Read compression configuration if you want to configure it
  // https://github.com/expressjs/compression#server-sent-events
  app.use(compression());
  
  // Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
  app.use(helmet());
  
  // Enable Cross Origin Resource Sharing
  app.use(cors(corsOptions));

  // HTTP request logger
  // :method :url :status :response-time ms - :res[content-length]
  isProduction ? null : app.use(morgan('dev'));

  // Transforms raw string of req.body into JSON
  app.use(express.json());

  // Parsing the URL-encoded data with the qs library instead of querystring library
  app.use(express.urlencoded({ extended: true}));

  // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // see https://expressjs.com/en/guide/behind-proxies.html
  // app.set('trust proxy', 1);

  app.use(session({
    name: SESSION.NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSION.SECRET,
    // Connection pool
    // https://www.npmjs.com/package/express-mysql-session#usage With an existing MySQL connection or pool
    store: new MySQLStore({}/* session store options */, db.promisePool),
    cookie: {
      maxAge: 1000 * 60 * 60 * 11,
      // maxAge: 1000 * 60,
      sameSite: true,
      // If you have your node.js behind a proxy and are using secure: true, you need to set "trust proxy" in express
      secure: isProduction,
    }
  }));

  

  return app;

};