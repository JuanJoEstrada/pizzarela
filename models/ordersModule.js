const { Client } = require('pg');
const { DB } = require('../config/config');
const db = require('../config/db');
const createError = require('http-errors');

module.exports = class OrdersModule {

  async find() {
    
    try {
      const stmt = `
        SELECT ordenes_sr.id, ordenes_sr.tipo, ordenes_sr.status, ordenes_sr.proceso, ordenes_sr.transaccion_id, 
               usuarios_sr.nombres, usuarios_sr.apellidos, DATE_FORMAT(ordenes_sr.hora, '%d-%m-%Y %h:%i:%s') AS hora, usuarios_sr.entrega, 
               usuarios_sr.distrito, usuarios_sr.urbanizacion,
               usuarios_sr.calle, usuarios_sr.numero, usuarios_sr.apartamento, usuarios_sr.bloque, usuarios_sr.telefono, usuarios_sr.detalles,
               JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', orden_producto_sr.id, 'grupo', orden_producto_sr.grupo,
                  'pizza', orden_producto_sr.producto, 'medida', orden_producto_sr.medida,
                  'cantidad', orden_producto_sr.cantidad
                )
               ) AS pizzas
        FROM   ordenes_sr
        JOIN   usuarios_sr ON ordenes_sr.usuario_id = usuarios_sr.id
        JOIN   orden_producto_sr ON ordenes_sr.id = orden_producto_sr.orden_id
        WHERE  ordenes_sr.status = 'PAID' AND ordenes_sr.proceso <> 'Entregado'
        GROUP BY ordenes_sr.id, usuarios_sr.nombres, usuarios_sr.apellidos,
                 usuarios_sr.entrega, usuarios_sr.distrito, usuarios_sr.urbanizacion, usuarios_sr.calle,
                 usuarios_sr.numero, usuarios_sr.apartamento, usuarios_sr.bloque, usuarios_sr.telefono, usuarios_sr.detalles
        ORDER BY ordenes_sr.id DESC;
      `;
      const results = await db.query(stmt);
      if (results.length) {
        return results;
      }
      return ['No hay órdenes nuevas.'];
    } catch (err) {
      console.log(err)
      throw createError(500, 'Error al seleccionar orden de pizzas pagadas.')
    }
  }

  async listen(sse) {

    try {

      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });

      const config = {
        user: DB.PGUSER,
        host: DB.PGHOST,
        database: DB.PGDATABASE,
        password: DB.PGPASSWORD,
        port: DB.PGPORT,
      }
  
      // const client = new Client(config);
  
      await client.connect();
  
      await client.query('LISTEN paid_pizzas');
  
      client.on('notification', async data => {

        try {
          const payload = JSON.parse(data.payload);
          console.log('row added!', payload);
          const stmt = `
            SELECT ordenes_sr.id, ordenes_sr.tipo, ordenes_sr.status, ordenes_sr.proceso, ordenes_sr.transaccion_id, 
                  usuarios_sr.nombres, usuarios_sr.apellidos, TO_CHAR(ordenes_sr.hora,'YYYY-MM-DD HH24:MI:SS') AS hora, usuarios_sr.entrega, 
                  usuarios_sr.distrito, usuarios_sr.urbanizacion,
                  usuarios_sr.calle, usuarios_sr.numero, usuarios_sr.apartamento, usuarios_sr.bloque, usuarios_sr.telefono, usuarios_sr.detalles,
                  ARRAY_AGG (
                    JSON_BUILD_OBJECT (
                      'id', orden_producto_sr.id, 'grupo', orden_producto_sr.grupo,
                      'pizza', orden_producto_sr.producto, 'medida', orden_producto_sr.medida,
                      'cantidad', orden_producto_sr.cantidad
                    )
                  ) AS pizzas
            FROM   ordenes_sr
            JOIN   usuarios_sr ON ordenes_sr.usuario_id = usuarios_sr.id
            JOIN   orden_producto_sr ON ordenes_sr.id = orden_producto_sr.orden_id
            WHERE  ordenes_sr.id = ${payload.id}
            GROUP BY ordenes_sr.id, usuarios_sr.nombres, usuarios_sr.apellidos,
                    usuarios_sr.entrega, usuarios_sr.distrito, usuarios_sr.urbanizacion, usuarios_sr.calle,
                    usuarios_sr.numero, usuarios_sr.apartamento, usuarios_sr.bloque, usuarios_sr.telefono, usuarios_sr.detalles;
          `;
          const response = await db.query(stmt);
          const results = response.rows;
          // console.log(`This is pizzas from id ${results[0].id}: `, results[0].pizzas)
          // There is no need for JSON.stringify using express-sse library
          // Without library:
          // res.write(`data: ${JSON.stringify(results.rows)}\n\n`);
          sse.send(results);

        } catch (err) {
          console.log(err)
          throw createError(500, 'Error al seleccionar pizzas pagadas al notificar.')
        }

      })
  
    } catch (err) {
      console.log(err)
      throw createError(500, 'Error en notificaciones de pizzas.')
    }
  }

}