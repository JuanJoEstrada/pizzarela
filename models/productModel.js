const db = require('../config/db');

module.exports = class ProductModel {

  // Intended to return an array of all products
  async find() {
    let products = [];
    try {

      const stmt = `
        SELECT de_la_casa_size.id, de_la_casa.name, de_la_casa_size.size_casa, de_la_casa.description, de_la_casa_size.price
        FROM de_la_casa
        JOIN de_la_casa_size
        ON de_la_casa.id = de_la_casa_size.de_la_casa_id;
      `;
      const results = await db.query(stmt);
      if (results.length) { 
        products.push({name: 'De la Casa', arrPizzas: results});
      }

      const stmt2 = `
        SELECT tradicionales_size.id, tradicionales.name, tradicionales_size.size_tradicional, tradicionales.description, tradicionales_size.price
        FROM tradicionales
        JOIN tradicionales_size
        ON tradicionales.id = tradicionales_size.tradicional_id;
      `;
      const results2 = await db.query(stmt2);
      if (results2.length) {
        products.push({name: 'Tradicionales', arrPizzas: results2});
      }

      const stmt3 = `
        SELECT *
        FROM complementos;
      `;
      const results3 = await db.query(stmt3);
      if (results3.length) {
        products.push({name: 'Complementos', arrComplementos: results3});
      }

      const stmt4 = `
        SELECT *
        FROM bebidas;
      `;
      const results4 = await db.query(stmt4);
      if (results4.length) {
        products.push({name: 'Bebidas', arrBebidas: results4});
      }

      const stmt5 = `SELECT * FROM promociones`;
      const results5 = await db.query(stmt5);
      if (results5.length) {
        products.push({name: 'Promociones', arrPromociones: results5});
      }

      const stmtDelivery = `
        SELECT name, price FROM delivery_distrito;
      `;
      const resultsDelivery = await db.query(stmtDelivery);
      if (resultsDelivery.length) {
        products.push({name: 'Precios de Delivery', arrDelivery: resultsDelivery});
      }
      
      if (
        results.length 
        && results2.length 
        && results3.length 
        && results4.length
        && results5.length 
        && resultsDelivery.length
      ) {
        return products;
      };

      return ['Empty result from products'];

    } catch(err) {
      throw err;
    }
  }

};