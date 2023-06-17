import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.getProducts();
  }

  generarCode(index) {
    const CODE = "PROD" + (index + 1);
    return CODE;
  }

  getProducts = async () => {
    try {
      const data = await fs.promises.readFile(this.path, this.format);
      return JSON.parse(data);
    } catch (error) {
      console.log("Error, no se encontró el archivo");
      return [];
    }
  };

  addProduct = async (title, description, price, thumbnail) => {
    const productosAll = await this.getProducts();
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

    await fs.promises.writeFile(this.path, JSON.stringify(productosAll));
  };

  getProductById = async (productId) => {
    const productosAll = await this.getProducts();
    const product = productosAll.find((product) => product.id === productId);

    if (product) return product;
    else return console.log("Producto no identificado.");
  };

  deleteProduct = async (productId) => {
    try {
      const productosAll = await this.getProducts();
      const productIndex = productosAll.findIndex(
        (product) => product.id === productId
      );

      if (productIndex !== -1) {
        const eliminado = productosAll.splice(productIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(productosAll));

        return eliminado;
      }
    } catch (error) {
      return console.error("Error al eliminar el producto:", error);
    }
  };

  updateProduct = async (productId, updatedFields) => {
    try {
      const productosAll = await this.getProducts();
      const productIndex = productosAll.findIndex(
        (product) => product.id === productId
      );

      if (productIndex) {
        const updatedProduct = {
          ...productosAll[productIndex],
          ...updatedFields,
        };

        productosAll[productIndex] = updatedProduct;
        await fs.promises.writeFile(this.path, JSON.stringify(productosAll));

        return updatedProduct;
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };
}

async function run() {
  const producto = new ProductManager("db.json");
  // await producto.addProduct("Pañales", "Pampers", 90, "#");
  // await producto.addProduct("Pañales2", "Pampers", 90, "#");
  // await producto.addProduct("Pañales3", "Pampers", 90, "#");
  // await producto.addProduct("Pañales4", "Pampers", 90, "#");
  // await producto.addProduct("Pañales5", "Pampers", 90, "#");
  // await producto.addProduct("Pañales6", "Pampers", 90, "#");
  // await producto.addProduct("Pañales7", "Pampers", 90, "#");
  // await producto.addProduct("Pañales8", "Pampers", 90, "#");
  // await producto.addProduct("Pañales9", "Pampers", 90, "#");
  // await producto.addProduct("Pañales10", "Pampers", 90, "#");

  console.log("Lista de productos:", await producto.getProducts());
  // console.log("Encontrado:", await producto.getProductById(30));
  // console.log("Eliminado:", await producto.deleteProduct(3));

  // console.log(
  //   "Actualizado:",
  //   await producto.updateProduct(4, {
  //     title: "Lala4",
  //     description: "Campo2",
  //     price: 990,
  //     thumbnail: "#",
  //   })
  // );
}
run();
