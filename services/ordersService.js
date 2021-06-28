const OrdersModule = require('../models/ordersModule');
const OrdersModuleInstance = new OrdersModule();

const UpdateDataModel = require('../models/updateDataModel');
const UpdateDataModelInstance = new UpdateDataModel();

module.exports = class ordersService {

  async paidOrders () {
    try {
      const paidOrders = await OrdersModuleInstance.find();
      return paidOrders;
    } catch (err) {
      throw err
    }
  }

  async paidOrdersNotification (req, res) {
    try {
      await OrdersModuleInstance.listen(req, res);
    } catch (err) {
      throw err;
    }
  }

  async orderProcess (order) {
    try {
      await UpdateDataModelInstance.onlineOrdenes_srProceso(order)
    } catch (err) {
      throw err;
    }
  }

}