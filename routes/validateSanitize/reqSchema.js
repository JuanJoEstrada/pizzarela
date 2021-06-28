const { validationResult } = require('express-validator');
const createError = require('http-errors');

const validateReqSchema = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('This is error for validation: ', errors.array())
    next(createError(406, 'Validación de pedido rechazada'));
  }
  next();
};

module.exports = validateReqSchema;