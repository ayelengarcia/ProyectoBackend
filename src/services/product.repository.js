import ProductDTO from "../Dao/DTO/product.dto.js";

export default class ProductDTO {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async (limit) => {
    return await this.dao.getProducts(limit);
  };

  addProducts = async (data) => {
    return await this.dao.addProducts(data);
  };

  getProductById = async (id) => {
    return await this.dao.getProductById(id);
  };

  updatedProductById = async (id) => {
    return await this.dao.updatedProductById(id);
  };

  deleteProduct = async (id) => {
    return await this.dao.deleteProduct(id);
  };
}
