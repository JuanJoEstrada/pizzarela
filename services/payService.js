const axios = require('axios');
const createError = require('http-errors');

const { IZIUSER, IZIPASSWORD } = require('../config/config');

const PayModel = require('../models/payModel');
const PayModelInstance = new PayModel();
const AddDataModel = require('../models/addDataModel');
const AddDataModelInstance = new AddDataModel();
const UpdateDataModel = require('../models/updateDataModel');
const UpdateDataModelInstance = new UpdateDataModel();

// plain-text string
// const str = '21907733:testpassword_EuZEQ50TWwRj8SvVtCRPxgxX9yjeDqpmb2v6NS0IHqCH7';
const str = `${IZIUSER}:${IZIPASSWORD}`;
// create a buffer
const buff = Buffer.from(str, 'utf-8');
// decode buffer as Base64
// Authorization
const base64 = buff.toString('base64');
// print Base64 string
// console.log(`Authorization: ${base64}`);

module.exports = class PayService {

  async totalPriceRight (body) {

    try {

      let totalPrice;
      let idPriceDeLaCasa = null;
      let idPriceTradicionales = null;
      let idPriceComplementos = null;
      let idPriceBebidas = null;
      let idPricePromociones = null;
      const toSumTotalPriceNoDelivery = [];

      // Check price with DB

      const checkPrice_Subtotal = (idPriceTable, i) => {
        // idPriceTable => [{id: 1, price: 14.90}, {id: 2, price: 19.90}, ..., {id: n, price: n}]
        let rowTable = idPriceTable.find(index => index.id === body.productos[i].id);
        if (rowTable.price !=  body.productos[i].precio) {
          throw createError(406,'Price not matching with servers');
        } else {
          let subTotal = Number((rowTable.price * body.productos[i].cantidad).toFixed(2));
          if ( subTotal !== Number(body.productos[i].subTotal)) {
            throw createError(406,'Subtotal not matching with servers');
          } else {
            toSumTotalPriceNoDelivery.push(subTotal);
          }
        }
      };

      // Loop through all orders in products

      for (let i = 0; i < body.productos.length; i ++) {
        // Ask DB for information to compare
        // let idPriceTable;
        // Add more price of products
        if (body.productos[i].promo === false && body.productos[i].grupo === 'De la Casa' && idPriceDeLaCasa === null) {
          idPriceDeLaCasa = await PayModelInstance.idPriceDeLaCasa();
          // checkPrice_Subtotal(idPriceDeLaCasa, i);
        } else if (body.productos[i].promo === false && body.productos[i].grupo === 'Tradicionales' && idPriceTradicionales === null) {
          idPriceTradicionales = await PayModelInstance.idPriceTradicionales();
          // checkPrice_Subtotal(idPriceTradicionales, i);
        } else if (body.productos[i].promo === false && body.productos[i].grupo === 'Complementos' && idPriceComplementos === null) {
          idPriceComplementos = await PayModelInstance.idPriceComplementos();
        } else if (body.productos[i].promo === false && body.productos[i].grupo === 'Bebidas' && idPriceBebidas === null) {
          idPriceBebidas = await PayModelInstance.idPriceBebidas();
        } else if (body.productos[i].promo === true && idPricePromociones === null) {
          idPricePromociones = await PayModelInstance.idPricePromociones();
        }

        if (body.productos[i].grupo === 'De la Casa') checkPrice_Subtotal(idPriceDeLaCasa, i);
        if (body.productos[i].grupo === 'Tradicionales') checkPrice_Subtotal(idPriceTradicionales, i);
        if (body.productos[i].grupo === 'Complementos') checkPrice_Subtotal(idPriceComplementos, i);
        if (body.productos[i].grupo === 'Bebidas') checkPrice_Subtotal(idPriceBebidas, i);
        if (body.productos[i].promo === true) checkPrice_Subtotal(idPricePromociones, i);

      }
          
      // totalPrice is inteded to be sent to izipay as an integer, not decimal (.00)
      // add delivery price
      const totalPriceNoDelivery = toSumTotalPriceNoDelivery.reduce((a, b) => a + b);

      if (body.entrega === 'local') {
        // when it is local, there is no charge
        totalPrice = Number((totalPriceNoDelivery * 100).toFixed(0));
      } else if (body.entrega === 'delivery') {
        // deliveyrDistritoPrecio => [{name: 'Breña', price: 5.00}, {name: 'Jesús María', price: 5.00}, ...]
        const deliveryDistritoTable = await PayModelInstance.priceDistrito();
        const deliveryDistritoObj = deliveryDistritoTable.find(index => index.name === body.distrito);
        if (!deliveryDistritoObj) throw createError(406, 'Distrito not matching with servers');
        totalPrice = Number(((Number(deliveryDistritoObj.price) + totalPriceNoDelivery) * 100).toFixed(0));
      } else {
        throw createError(406, 'Entrega not matching with servers');
      }

      if (totalPrice !== Number(body.totalPrice)) {
        throw createError(406, 'totalPrice not matching with servers');
      } else {
        return body;
      }

    } catch (err) {
      throw err;
    }

  }

  async callFormToken (body, orderId) {

    try {
      const response = await axios({
        url: 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment',
        method: 'post',
        headers: {
          Authorization:  `Basic ${base64}`,
          'Content-Type': 'application/json'
        },
        data: {
          // "amout" es entero, lo dos últimos números son los centavos 
          // documents specify that amount is an integer, however in test works with string
          "amount": body.totalPrice,
          "currency": "PEN",
          "orderId": `${orderId}`,
          "customer": {
            "email": body.email,
          }
        }
      }).then(response => response.data)

      return response;
      
    } catch (err) {
      throw err;
    }
  }

  async registerOrderOnline (body) {
    
    try { 
      // createOrder is a number - createOrder = id
      const createUser = await AddDataModelInstance.usuarios_sr(body);
      const createOrder = await AddDataModelInstance.ordenes_sr(body, createUser);
      await AddDataModelInstance.costos_sr(body, createOrder);
      await AddDataModelInstance.orden_producto_sr(body, createOrder);
      return createOrder;
    } catch (err) {
      throw err;
    }

  }

  async unsuccessfulFormToken (orderId) {

    try {
      await UpdateDataModelInstance.onlineOrdenes_srOnUnsuccessfulToken(orderId);
    } catch (err) {
      throw err;
    }

  }

  async checkIPNstatus (answer) {

    try {
      await UpdateDataModelInstance.onlineOrdenes_sr(answer);
      await UpdateDataModelInstance.onlineCostos_sr(answer);
    } catch (err) {
      throw err;
    }
  }

};