export default class ProductRepository {
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

  updatedProductById = async (id, updatedProduct) => {
    return await this.dao.updatedProductById(id, updatedProduct);
  };

  deleteProduct = async (id) => {
    return await this.dao.deleteProduct(id);
  };
}
