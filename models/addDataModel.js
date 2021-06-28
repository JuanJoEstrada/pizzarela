// INSERT in MySQL https://www.mysqltutorial.org/mysql-nodejs/insert/

const db = require('../config/db');
const pgp = require('pg-promise')({ capSQL: true });
const createError = require('http-errors');

const PayModel = require('../models/payModel');
const PayModelInstance = new PayModel();

module.exports = class AddDataModel {

  async usuarios_sr (body) {

    try {

      const data = [
        body.nombres,
        body.apellidos,
        body.email,
        body.entrega,
        body.distrito,
        body.urbanizacion,
        body.calle,
        body.numero,
        body.apartamento,
        body.bloque,
        body.telefono,
        body.detalles,
      ];

      const statement = `
        INSERT INTO usuarios_sr (
          nombres, apellidos, email, entrega, distrito, urbanizacion, calle, numero, apartamento, bloque, telefono, detalles
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const result = await db.query(statement, data);
      
      if (result) {
        return result.insertId
      }

      return null;

    } catch (err) {
      console.log(err)
      throw createError(500, 'Error relacionado con datos de usuario.')
    }

  }

  async ordenes_sr (body, id) {

    try {
      
      let tipo;
      const individual = body.productos.every(e => e.promo === false);
      const promocion = body.productos.every(e => e.promo === true);
      if (individual) {
        tipo = 'I';
      } else if (promocion) {
        tipo = 'P';
      } else {
        tipo = 'A';
      }
      const data = [
        tipo,
        'Online',
        'Izipay',
        'Aborted',
        'En espera',
        id,
      ];
      const statement = `
        INSERT INTO ordenes_sr (
          tipo, canal_compra, canal_pago, status, proceso, usuario_id
        ) VALUES (?, ?, ?, ?, ?, ?);
      `;
      const result = await db.query(statement, data);
      
      if (result) {
        return result.insertId
      }

      return null;

    } catch (err) {
      console.log(err);
      throw createError(500, 'Error al insertar orden de compra.')
    }

  }

  async costos_sr (body, id) {

    try {

      const priceDelivery = async () => {
        
        try {
          // deliveyrDistritoPrecio => [{name: 'Breña', price: 5.00}, {name: 'Jesús María', price: 5.00}, ...]
          const deliveryDistritoTable = await PayModelInstance.priceDistrito();
          const deliveryDistritoObj = deliveryDistritoTable.find(index => index.name === body.distrito);
          if (!deliveryDistritoObj) throw createError(406, 'Distrito not matching with servers');
          return Number(deliveryDistritoObj.price);
        } catch (err) {
          throw createError(500, 'Error en priceDelivery')
        }

      };
      const price = body.entrega === 'delivery' ? await priceDelivery() : null;
        
      const data = [
        id,
        price,
        Number((Number(body.totalPrice) / 100).toFixed(2)),
      ];
      const statement = `
        INSERT INTO costos_sr (
          orden_id, delivery, total_bruto
        ) VALUES (?, ?, ?);
      `;
      await db.query(statement, data);

    } catch (err) {
      console.log(err);
      throw createError(500, 'Error al insertar costos.');
    }

  }

  async orden_producto_sr (body, id) {

    try {
      let data = [];
      for (let i = 0; i < body.productos.length; i++) {

        if (body.productos[i].promo === false) {

          data.push([
            id,
            body.productos[i].grupo,
            body.productos[i].nombre,
            body.productos[i].tamaño,
            body.productos[i].precio,
            body.productos[i].cantidad
          ])

        } else if (body.productos[i].promo === true) {

          if (body.productos[i].grupo === 'Dúos Grandes') {

            data.push([
              id,
              body.productos[i].grupo,
              body.productos[i].pizza1.name,
              body.productos[i].pizza1.size_tradicional,
              // This is price for promo, not for individual pizza
              body.productos[i].precio,
              // This is number of individual pizza of promo, not number of promo
              body.productos[i].pizza1.cantidad
            ])
            data.push([
              id,
              body.productos[i].grupo,
              body.productos[i].pizza2.name,
              body.productos[i].pizza2.size_tradicional,
              // This is price for promo, not for individual pizza
              body.productos[i].precio,
              // This is number of individual pizza of promo, not number of promo
              body.productos[i].pizza2.cantidad
            ])

          } else {

            data.push([
              id,
              body.productos[i].grupo,
              body.productos[i].pizza.name,
              body.productos[i].pizza.size_casa || body.productos[i].pizza.size_tradicional,
              // This is price for promo, not for individual pizza
              body.productos[i].precio,
              // This is number of individual pizza of promo, not number of promo
              body.productos[i].pizza.cantidad
            ])
            data.push([
              id,
              body.productos[i].grupo,
              body.productos[i].complemento.name,
              null,
              // This is price for promo, not for individual pizza
              body.productos[i].precio,
              // This is number of individual pizza of promo, not number of promo
              body.productos[i].complemento.cantidad
            ])
            data.push([
              id,
              body.productos[i].grupo,
              body.productos[i].bebida.name,
              body.productos[i].bebida.description,
              // This is price for promo, not for individual pizza
              body.productos[i].precio,
              // This is number of individual pizza of promo, not number of promo
              body.productos[i].bebida.cantidad
            ])

          }

        }

      }
      const statement = `
        INSERT INTO orden_producto_sr (
          orden_id, grupo, producto, medida, precio, cantidad
        ) VALUES ?  
      `;
      await db.query(statement, [data]);

    } catch (err) {
      console.log(err);
      throw createError(500, 'Error al insertar pizzas.')
    }

  }

}