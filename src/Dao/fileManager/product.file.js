import FileManager from "./managers/FileManager.js";
import ProductManager from "./managers/ProductManager.js";

const ProductManager = new ProductManager();

export default class Product extends FileManager {
  constructor(filename = "./ddbb/productos.json") {
    super(filename);
  }

  getProducts = async (limit) => {
    if (limit) {
      const products = await this.getObjets();
      return products.slice(0, limit);
    } else {
      return this.getObjets();
    }
  };

  getProductById = async (id) => {
    return await this.getObjetsById(id);
  };

  addProducts = async (data) => {
    return await ProductManager.addProducts(data);
  };

  updatedProductById = async (id, updatedProduct) => {
    return await this.updateObject(id, updatedProduct);
  };

  deleteProduct = async (id) => {
    return await this.deleteObjets(id);
  };
}
