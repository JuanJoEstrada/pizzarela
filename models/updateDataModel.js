const db = require('../config/db');
const pgp = require('pg-promise')({ capSQL: true });
const lookup = require('binlookup')();
const createError = require('http-errors');

module.exports = class UpdateDataModel {

  async onlineOrdenes_srOnUnsuccessfulToken (orderId) {

    try {

      const data = [orderId]
      const statement = `
        UPDATE ordenes_sr SET status = 'Form Token Unsuccessful' WHERE id = ?;
      `;

      await db.query(statement, data);

    } catch (err) {
      console.log(err)
      throw createError(500, 'Error en el token Izipay.')
    }

  }

  async onlineOrdenes_sr (answer) {
    // TO MAKE BETTER
    // Since the user will have 4 chances to make a successful transaction, if there are errors
    // micuentaweb.pe will hit this endpoint as many times as errors. Thus the DB will update
    // the same times with the same information, except for "orderStatus" from IPN
    try {

      // Saving ipAdress and browserAgent from user
      const data = [answer.orderDetails.orderId];
      const statement = `
        SELECT ordenes_sr.usuario_id
        FROM ordenes_sr
        JOIN usuarios_sr ON usuarios_sr.id = ordenes_sr.usuario_id
        WHERE ordenes_sr.id = ?
      `;
      const results = await db.query(statement, data);

      if (results.length) {

        // Updating IP from client
        const data1 = [answer.customer.extraDetails.ipAddress, results[0]['usuario_id']];
        const statement1 = `
          UPDATE usuarios_sr SET direccion_ip = ? WHERE id = ?;
        `;
        await db.query(statement1, data1);

      }

      // Updating status
      let data2;
      if (answer.orderStatus !== 'PAID') {
        data2 = {
          status: answer.orderStatus,
          transaccion_id: answer.transactions[0].transactionDetails.cardDetails.legacyTransId,
          motivo: answer.transactions[0].detailedErrorMessage || answer.transactions[0].errorMessage,
        }
      } else {
        data2 = {
          status: answer.orderStatus,
          transaccion_id: answer.transactions[0].transactionDetails.cardDetails.legacyTransId,
          motivo: null,
        };
      }
      const superData = [data2, answer.orderDetails.orderId]
      const statement2 = `
        UPDATE ordenes_sr SET ? WHERE id = ?;
      `;
      await db.query(statement2, superData);

    } catch (err) {
      console.log(err)
      throw createError(500, 'Error al insertar orden online.')
    }

  }

  async onlineCostos_sr (answer) {
    
    try {

      // If it's possible to detect brand and type of card from answer, write comisiones
      let porcentaje_comision;
      let comision;
      let igv_comision;
      let suma_comision_transaccion;
      let total_neto;
      const brand = answer.transactions[0].transactionDetails.cardDetails.authenticationResponse.protocol.network;
      const type = answer.transactions[0].operationType;
      const total_buto = (answer.orderDetails.orderTotalAmount) / 100;

      if (brand && type) {

        if (brand === 'VISA' && type === 'DEBIT'){
          porcentaje_comision = 3.19;
          comision = Number((total_buto * porcentaje_comision / 100).toFixed(2));
          igv_comision = Number((comision * 18 / 100).toFixed(2));
          suma_comision_transaccion = comision + igv_comision + 0.5 + 0.09;
          total_neto = total_buto - suma_comision_transaccion;
        } else {
          porcentaje_comision = 3.95;
          comision = Number((total_buto * porcentaje_comision / 100).toFixed(2));
          igv_comision = Number((comision * 18 / 100).toFixed(2));
          suma_comision_transaccion = comision + igv_comision + 0.5 + 0.09;
          total_neto = total_buto - suma_comision_transaccion;
        }

      } else {

        // In case Izipay do not return brand or type of card, use binlookup
        const pan = answer.transactions[0].transactionDetails.cardDetails.pan;
        const iin = pan.slice(0,6);
        // If you hit the limit (ten per minut), or there is an err, return null and do nothing (do not update DB) 
        const data = await lookup(iin).then(e => e).catch(err => null);
        // console.log('This is data: ', data)
        if (data == null) {
          return null
        } else if (data.scheme === 'visa' && data.type === 'debit' && data.country.name === 'Peru') {
          porcentaje_comision = 3.19;
          comision = Number((total_buto * porcentaje_comision / 100).toFixed(2));
          igv_comision = Number((comision * 18 / 100).toFixed(2));
          suma_comision_transaccion = comision + igv_comision + 0.5 + 0.09;
          total_neto = total_buto - suma_comision_transaccion;
        } else {
          porcentaje_comision = 3.95;
          comision = Number((total_buto * porcentaje_comision / 100).toFixed(2));
          igv_comision = Number((comision * 18 / 100).toFixed(2));
          suma_comision_transaccion = comision + igv_comision + 0.5 + 0.09;
          total_neto = total_buto - suma_comision_transaccion;
        }
        // return null;

      }

      const data = {
        porcentaje_comision,
        comision,
        igv_comision,
        suma_comision_transaccion,
        total_neto,
      };
      // Updating costos_sr;
      const superData = [ data, answer.orderDetails.orderId];
      const statement = `
        UPDATE costos_sr SET ? WHERE id = ?;
      `;
      await db.query(statement, superData);

    } catch (err) {
      console.log(err);
      throw createError(500, 'Error al actualizar costos.')
    }

  }

  async onlineOrdenes_srProceso (order) {
    
    try {

      const data = [order.proceso, order.id];
      const statement = `
        UPDATE ordenes_sr SET proceso = ? WHERE id = ?;
      `;
      await db.query(statement, data)

    } catch (err) {
      console.log(err)
      throw createError(400, 'Error al actualizar proceso.')
    }

  }

};