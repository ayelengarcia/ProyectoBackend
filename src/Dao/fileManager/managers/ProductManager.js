import fs from "fs";
import FileManager from "./FileManager.js";

class ProductManager extends FileManager {
  constructor(filename = "./ddbb/productos.json") {
    super(filename);
    this.getObjets();
  }

  addProduct = async (title, description, price, thumbnail) => {
    const productosAll = await this.getObjets();
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

    await fs.promises.writeFile(this.filename, JSON.stringify(productosAll));
  };
}

export default ProductManager;
