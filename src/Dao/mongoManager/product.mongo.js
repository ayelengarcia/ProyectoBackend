import ProductModel from "./models/productModel.js";

export default class Product {
  getProducts = async (limit) => {
    if (limit) {
      const products = await ProductModel.find();
      return products.slice(0, limit);
    } else {
      return ProductModel.find();
    }
  };

  addProducts = async (data) => {
    return await ProductModel.create(data);
  };

  //Perfil admin // user: admin@coder.com // contraseña: 1234
  //Perfil Premium // user: premium@coder.com // contraseña: 1234

  getProductById = async (id) => {
    return await ProductModel.findById(id);
  };

  updatedProductById = async (id, updatedProduct) => {
    const update = {
      $set: updatedProduct,
    };

    return await ProductModel.findByIdAndUpdate(id, update, {
      new: true,
    });
  };

  deleteProduct = async (id) => {
    return await ProductModel.findByIdAndDelete(id);
  };
}
