const productRouter = require('./productRouter');
const payRouter = require('./payRouter');
const ordersRouter = require('./ordersRouter');
const adminRouter = require('./admin');

module.exports = (app, passport) => {
  productRouter(app);
  payRouter(app);
  ordersRouter(app);
  adminRouter(app, passport)
}