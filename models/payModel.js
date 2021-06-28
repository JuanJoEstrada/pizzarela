const db = require('../config/db');

module.exports = class PayModel {

  // Intended to return an array of all products
  async idPriceDeLaCasa () {
    try {

      const stmt = `
        SELECT de_la_casa_size.id, de_la_casa_size.price
        FROM de_la_casa
        JOIN de_la_casa_size
        ON de_la_casa.id = de_la_casa_size.de_la_casa_id;
      `;
      const results = await db.query(stmt);
      if (results.length) {
        return results;
      }

      return ['Emty result from de_la_casa_size.id, de_la_casa_size.price'];

    } catch(err) {
      throw err;
    }
  }

  async idPriceTradicionales () {
    try {

      const stmt = `
        SELECT tradicionales_size.id, tradicionales_size.price
        FROM tradicionales
        JOIN tradicionales_size
        ON tradicionales.id = tradicionales_size.tradicional_id;
      `;
      const results = await db.query(stmt);
      if (results.length) {
        return results;
      }

      return ['Emty result from tradicionales_size.id, tradicionales_size.price'];

    } catch(err) {
      throw err;
    }
  }

  async idPriceComplementos () {

    try {
      const stmt = `
        SELECT id, price FROM complementos;
      `;
      const results = await db.query(stmt);
      if (results.length) {
        return results;
      }

      return ['Emty result from SELECT id, price FROM complementos;'];

    } catch (err) {
      throw err;
    }

  }

  async idPriceBebidas () {

    try {
      const stmt = `
        SELECT id, price FROM bebidas;
      `;
      const results = await db.query(stmt);
      if (results.length) {
        return results;
      }

      return ['Emty result from SELECT id, price FROM bebidas;'];
      
    } catch (err) {
      throw err;
    }

  }

  async idPricePromociones () {

    try {
      const stmt = `SELECT id, price FROM promociones;`;
      const results = await db.query(stmt);
      if (results.length) {
        return results;
      }

      return ['Emty result from SELECT id, price FROM promociones;'];

    } catch (err) {
      throw err
    }

  }

  async priceDistrito () {
    try {

      const stmt = `SELECT name, price FROM delivery_distrito;`;
      const results = await db.query(stmt);
      if (results.length) {
        return results;
      }

      return ['Emty result from delivery_distrito'];

    } catch(err) {
      throw err;
    }
  }

};