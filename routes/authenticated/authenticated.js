const createError = require('http-errors')

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    throw createError(401, 'No estás autorizado para ver esto.');
  }
};

const isAuthLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/vistaCajero');
  } else {
    next();
  }
};

module.exports = {isAuth, isAuthLogin};