const mysql = require('mysql2/promise');
const { DB } = require('./config');

const { de_la_casaTableStmt, 
        de_la_casa_sizeTableStmt,
        tradicionalesTableStmt,
        tradicionales_sizeTableStmt,
        complementosTableStmt,
        bebidasTableStmt,
        promocionesTableStmt,
        usuarios_srTableStmt,
        costos_srTableStmt,
        ordenes_srTableStmt,
        orden_producto_srTableStmt,
        delivery_distritoTableStmt,
        order_statusFunction,
        after_update_statusTrigger,
        sessionTableStmt,
} = require('./tables&populating/tablesStmt');

const { de_la_casaPopulateStmt, 
        de_la_casa_sizePopulateStmt,
        tradicionalesPopulateStmt,
        tradicionales_sizePopulateStmt,
        complementosPopulateStmt,
        bebidasPopulateStmt,
        promocionesPopulateStmt, 
        delivery_distritoPopulateStmt,
} = require('./tables&populating/populatingStmt');

const config = {
  user: DB.PGUSER,
  host: DB.PGHOST,
  database: DB.PGDATABASE,
  password: DB.PGPASSWORD,
  port: DB.MYPORT,
}

;(async () => {

  try {

    const connection = await mysql.createConnection(config);

    await connection.connect();

    // Creating tables
    console.log('CREATING de_la_casaTableStmt');
    await connection.query(de_la_casaTableStmt)
    console.log('de_la_casaTableStmt FINISHED!\n');
    console.log('CREATING de_la_casa_sizeTableStmt');
    await connection.query(de_la_casa_sizeTableStmt)
    console.log('de_la_casa_sizeqTableStmt FINISHED!\n');
    console.log('CREATING tradicionalesTableStmt');
    await connection.query(tradicionalesTableStmt)
    console.log('tradicionalesTableStmt FINISHED!\n');
    console.log('CREATING tradicionales_sizeTableStmt');
    await connection.query(tradicionales_sizeTableStmt)
    console.log('tradicionales_sizeqTableStmt FINISHED!\n');
    console.log('CREATING complementosTableStmt');
    await connection.query(complementosTableStmt)
    console.log('complementosTableStmt FINISHED!\n');
    console.log('CREATING bebidasTableStmt');
    await connection.query(bebidasTableStmt)
    console.log('bebidasTableStmt FINISHED!\n');
    console.log('CREATING promocionesTableStmt');
    await connection.query(promocionesTableStmt)
    console.log('promocionesTableStmt FINISHED!\n');
    console.log('CREATING usuarios_srTableStmt');
    await connection.query(usuarios_srTableStmt)
    console.log('usuarios_srTableStmt FINISHED!\n');
    console.log('CREATING ordenes_srTableStmt');
    await connection.query(ordenes_srTableStmt)
    console.log('ordenes_srTableStmt FINISHED!\n');
    console.log('CREATING costos_srTableStmt');
    await connection.query(costos_srTableStmt)
    console.log('costos_srTableStmt FINISHED!\n');
    console.log('CREATING orden_producto_srTableStmt');
    await connection.query(orden_producto_srTableStmt)
    console.log('orden_producto_srTableStmt FINISHED!\n');
    console.log('CREATING delivery_distritoTableStmt');
    await connection.query(delivery_distritoTableStmt)
    console.log('delivery_distritoTableStmt FINISHED!\n');
    // console.log('CREATING order_statusFunction');
    // await connection.query(order_statusFunction)
    // console.log('order_statusFunction FINISHED!\n');
    // console.log('CREATING after_update_statusTrigger');
    // await connection.query(after_update_statusTrigger)
    // console.log('after_update_statusTrigger FINISHED!\n');
    // console.log('CREATING sessionTableStmt');
    // await connection.query(sessionTableStmt)
    // console.log('sessionTableStmt FINISHED!\n');

    console.log('______________________________________________\n');
    // Populating tables;
    // console.log('Populating de_la_casaTableStmt');
    // await connection.query(de_la_casaPopulateStmt)
    // console.log('de_la_casaTableStmt FINISHED!\n');
    // console.log('Populating de_la_casa_sizeTableStmt');
    // await connection.query(de_la_casa_sizePopulateStmt)
    // console.log('de_la_casa_sizeTableStmt FINISHED!\n');
    // console.log('Populating tradicionalesTableStmt');
    // await connection.query(tradicionalesPopulateStmt)
    // console.log('tradicionalesTableStmt FINISHED!\n');
    // console.log('Populating tradicionales_sizeTableStmt');
    // await connection.query(tradicionales_sizePopulateStmt)
    // console.log('tradicionales_sizeTableStmt FINISHED!\n');
    // console.log('Populating complementosTableStmt');
    // await connection.query(complementosPopulateStmt)
    // console.log('complementosTableStmt FINISHED!\n');
    // console.log('Populating bebidasTableStmt');
    // await connection.query(bebidasPopulateStmt)
    // console.log('bebidasTableStmt FINISHED!\n');
    // console.log('Populating promocionesTableStmt');
    // await connection.query(promocionesPopulateStmt)
    // console.log('promocionesTableStmt FINISHED!\n');
    // console.log('Populating delivery_distritoPopulateStmt');
    // await connection.query(delivery_distritoPopulateStmt)
    // console.log('delivery_distritoPopulateStmt FINISHED!\n');

    await connection.end();

  } catch(err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }

})();