import FileManager from "./managers/FileManager.js";

export default class Product extends FileManager {
  constructor(filename = "./ddbb/productos.json") {
    super(filename);
  }

  getProducts = async (limit) => {
    if (limit) {
      const products = await this.getObjects();
      return products.slice(0, limit);
    } else {
      return this.getObjects();
    }
  };

  getProductById = async (id) => {
    return await this.getObjectsById(id);
  };

  updatedProductById = async (id, updatedProduct) => {
    return await this.updateObject(id, updatedProduct);
  };

  deleteProduct = async (id) => {
    return await this.deleteObjets(id);
  };

  addProducts = async (title, description, price, thumbnail) => {
    const productosAll = await this.getObjects();
    const newIndex = productosAll.length;

    const newProduct = {
      id: newIndex + 1,
      title,
      description,
      price,
      thumbnail,
      stock: 80,
      code: this.generarCode(newIndex),
    };

    if (!title || !description || !price || !thumbnail)
      return console.log("Todos los campos son obligatorios.");

    const idExiste = productosAll.some(
      (producto) => producto.id === newProduct.id
    );
    if (idExiste) {
      newProduct.id = +(newProduct.id + "0");
    }

    productosAll.push(newProduct);

    await this.writeObjects(productosAll);

    return newProduct;
  };
}
