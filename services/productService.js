const ProductModel = require('../models/productModel');

const ProductModelInstance = new ProductModel();

module.exports = class ProductService {

  async productsList () {

    try {

      const products = await ProductModelInstance.find();
      return products;
      
    } catch (err) {
      throw err;
    }
  }

};