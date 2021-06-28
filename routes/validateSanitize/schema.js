const { body } = require('express-validator');

const squema = [
  body('totalPrice')
    // Sanitize
    // Validate
      .exists({ checkFalsy: true }) //  fields with falsy values (eg "", 0, false, null) will also not exist
      .isString() 
      .isNumeric({ no_symbols: true }) // e.g. no +, -, ., space, <, >, / , (, ), - 
      .custom(value => value !== '0') // totalPrice must not be '0'
      .toInt()
      .isInt({ min: 100}), // mínimo un sol
  body('productos')
    .exists({ checkFalsy: true })
    .isArray({ min: 1 }), // at least one element
    // wildcard * . Same of objecs inside arrays
    // {
    //   "productos": [
    //     { "grupo": "De la Casa", "nombre": "Zarela" },
    //     { "grupo": "De la Casa", "nombre": "Marinara", ... }
    //   ]
    // }
    body('productos.*.promo')
      .exists()
      .isBoolean(),
    body('productos.*.grupo')
      .exists({ checkFalsy: true }).withMessage('grupo must exists')
      .isString()
      .whitelist('\\[a-zA-ZÀ-ÿ0-9 \\]') // just output letter and spaces, it not reject. The characters are used in a RegExp and so you will need to escape some chars, e.g. blacklist(input, '\\[\\]')
      .notEmpty()
      .trim(), // remove spaces from left and right sides
    body('productos.*.id')
      .exists()
      .isNumeric()
      .not() // this is how you reject string and acept only numbers. Negates the result of the next validator.
      .isString(),
    body('productos.*.nombre')
      .optional()
      // .exists({ checkFalsy: true })
      .isString()
      .whitelist('\\[a-zA-ZÀ-ÿ0-9 \\]')
      .notEmpty()
      .trim(),
    body('productos.*.tamaño')
      .optional()
      // .exists()
      .custom(value => value === null || typeof(value) === 'string')
      .if(value => typeof(value) === 'string')// run the next validation (isString) if value is string
      .isString()
      .whitelist('\\[a-zA-ZÀ-ÿ0-9. \\]')
      .notEmpty()
      .trim(),
      body('productos.*.pizza.id')
      .optional()
        .isNumeric()
        .not()
        .isString(),
      body('productos.*.pizza.name')
        .optional()
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9 \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza.size_casa')
        .optional()
        .custom(value => value === null || typeof(value) === 'string')
        .if(value => typeof(value) === 'string')// run the next validation (isString) if value is string
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza.size_tradicional')
        .optional()
        .custom(value => value === null || typeof(value) === 'string')
        .if(value => typeof(value) === 'string')// run the next validation (isString) if value is string
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza.description')
        .optional()
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9,. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza.price')
        .optional()
        .isString()
        .isNumeric(),
      body('productos.*.pizza.cantidad')
        .optional()
        .isNumeric({ no_symbols: true })
        .not()
        .isString(),
      body('productos.*.bebida.id')
        .optional()
        .isNumeric()
        .not()
        .isString(),
      body('productos.*.bebida.name')
        .optional()
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9 \\]')
        .notEmpty()
        .trim(),
      body('productos.*.bebida.description')
        .optional()
        .custom(value => value === null || typeof(value) === 'string')
        .if(value => typeof(value) === 'string')// run the next validation (isString) if value is string
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.bebida.price')
        .optional()
        .isString()
        .isNumeric(),
      body('productos.*.bebida.cantidad')
        .optional()
        .isNumeric({ no_symbols: true })
        .not()
        .isString(),
      body('productos.*.complemento.id')
        .optional()
        .isNumeric()
        .not()
        .isString(),
      body('productos.*.complemento.name')
        .optional()
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9 \\]')
        .notEmpty()
        .trim(),
      body('productos.*.complemento.price')
        .optional()
        .isString()
        .isNumeric(),
      body('productos.*.complemento.cantidad')
        .optional()
        .isNumeric({ no_symbols: true })
        .not()
        .isString(),
      body('productos.*.pizza1.id')
        .optional()
        .isNumeric()
        .not()
        .isString(),
      body('productos.*.pizza1.name')
        .optional()
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9 \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza1.size_casa')
        .optional()
        .custom(value => value === null || typeof(value) === 'string')
        .if(value => typeof(value) === 'string')// run the next validation (isString) if value is string
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza1.size_tradicional')
        .optional()
        .custom(value => value === null || typeof(value) === 'string')
        .if(value => typeof(value) === 'string')// run the next validation (isString) if value is string
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza1.description')
        .optional()
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9,. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza1.price')
        .optional()
        .isString()
        .isNumeric(),
      body('productos.*.pizza1.cantidad')
        .optional()
        .isNumeric({ no_symbols: true })
        .not()
        .isString(),
      body('productos.*.pizza2.id')
        .optional()
        .isNumeric()
        .not()
        .isString(),
      body('productos.*.pizza2.name')
        .optional()
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9 \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza2.size_casa')
        .optional()
        .custom(value => value === null || typeof(value) === 'string')
        .if(value => typeof(value) === 'string')// run the next validation (isString) if value is string
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza2.size_tradicional')
        .optional()
        .custom(value => value === null || typeof(value) === 'string')
        .if(value => typeof(value) === 'string')// run the next validation (isString) if value is string
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza2.description')
        .optional()
        .isString()
        .whitelist('\\[a-zA-ZÀ-ÿ0-9,. \\]')
        .notEmpty()
        .trim(),
      body('productos.*.pizza2.price')
        .optional()
        .isString()
        .isNumeric(),
      body('productos.*.pizza2.cantidad')
        .optional()
        .isNumeric({ no_symbols: true })
        .not()
        .isString(),
    body('productos.*.precio')
      .exists({ checkFalsy: true }) // also not 0
      .isNumeric()
      .not() // this is how you reject string and acept only numbers. Negates the result of the next validator.
      .isString(),
    body('productos.*.cantidad')
      .exists({ checkFalsy: true })
      .isNumeric({ no_symbols: true })
      .not()
      .isString(),
    body('productos.*.subTotal')
      .exists({ checkFalsy: true })
      .isString()
      .isNumeric()
      .custom(value => value !== '0'),
    body('productos.*.imagen')
      .exists({ checkFalsy: true })
      .isString()
      .whitelist('\\[a-zA-Z \\]')
      .notEmpty()
      .trim(),
  body('nombres')
    .exists({ checkFalsy: true })
    .isString()
    .whitelist('\\[a-zA-ZÀ-ÿ \\]')
    .notEmpty()
    .trim(),
  body('apellidos')
    .exists({ checkFalsy: true })
    .isString()
    .whitelist('\\[a-zA-ZÀ-ÿ \\]')
    .notEmpty()
    .trim(),
  body('email')
    .exists({ checkFalsy: true})
    .isString()
    .isEmail()
    .normalizeEmail(),
  body('entrega')
    .exists({ checkFalsy: true })
    .isString()
    .whitelist('\\[a-zA-Z\\]')
    .notEmpty()
    .trim(),
  body('distrito')
    .exists()
    .custom(value => value === null || typeof(value) === 'string')
    .if(value => typeof(value) === 'string')// run the next validation (whitelist) if value is string
    .whitelist('\\[a-zA-ZÀ-ÿ \\]')
    .notEmpty()
    .trim(),
  body('urbanizacion')
    .exists()
    .custom(value => value === null || typeof(value) === 'string')
    .if(value => typeof(value) === 'string')
    .whitelist('\\[a-zA-ZÀ-ÿ0-9,. \\]')
    .notEmpty()
    .trim(),
  body('telefono')
    .exists()
    .custom(value => value === null || typeof(value) === 'string')
    .if(value => typeof(value) === 'string')
    .isNumeric({ no_symbols: true })
    .isLength({ min:7, max: 9 }),
  body('calle')
    .exists()
    .custom(value => value === null || typeof(value) === 'string')
    .if(value => typeof(value) === 'string')
    .whitelist('\\[a-zA-ZÀ-ÿ0-9,. \\]')
    .notEmpty()
    .trim(),
  body('numero')
    .exists()
    .custom(value => value === null || typeof(value) === 'string')
    .if(value => typeof(value) === 'string')
    .whitelist('\\[a-zA-ZÀ-ÿ0-9,. \\]')
    .notEmpty()
    .trim(),
  body('apartamento')
    .exists()
    .custom(value => value === null || typeof(value) === 'string')
    .if(value => typeof(value) === 'string')
    .whitelist('\\[a-zA-ZÀ-ÿ0-9,. \\]')
    .notEmpty()
    .trim(),
  body('bloque')
    .exists()
    .custom(value => value === null || typeof(value) === 'string')
    .if(value => typeof(value) === 'string')
    .whitelist('\\[a-zA-ZÀ-ÿ0-9,. \\]')
    .notEmpty()
    .trim(),
  body('detalles')
    .exists()
    .custom(value => value === null || typeof(value) === 'string')
    .if(value => typeof(value) === 'string')
    .whitelist('\\[a-zA-ZÀ-ÿ0-9,. \\]')
    .notEmpty()
    .trim(),
];

module.exports = squema;