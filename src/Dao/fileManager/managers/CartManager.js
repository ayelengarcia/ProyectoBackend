import fs from "fs";
import ProductManager from "./ProductManager.js";
import FileManager from "./FileManager.js";

class CartManager extends FileManager {
  constructor(filename = "./ddbb/carrito.json") {
    super(filename);
    this.carts = [];
  }

  //Carrito
  addCart = async (cart) => {
    const cartsAll = await this.getObjets();
    const newIndex = cartsAll.length;

    const newCart = {
      id: newIndex + 1,
      code: this.generarCode(newIndex),
      products: [],
    };

    const productManager = new ProductManager("ddbb/productos.json");

    await Promise.all(
      cart.products.map(async (item) => {
        const product = await productManager.getProductById(item.productId);
        if (product) {
          newCart.products.push({
            product,
            quantity: item.quantity,
          });
        }
      })
    );

    cartsAll.push(newCart);

    await fs.promises.writeFile(this.filename, JSON.stringify(cartsAll));
  };

  //Agregar productos a carrito existente por ID
  async addProductToCart(cartId, product) {
    try {
      const cartData = await this.getObjets();
      const cartIndex = cartData.findIndex((item) => item.id === cartId);

      if (cartIndex === -1) {
        throw new Error(`No se encontró el carrito con el ID: ${cartId}`);
      }

      const cart = cartData[cartIndex];
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.id === product.productId
      );

      if (existingProductIndex !== -1) {
        // Si existe aumentar la cantidad
        cart.products[existingProductIndex].quantity += product.quantity;
      } else {
        // No existe agregar como un nuevo producto
        const productManager = new ProductManager("ddbb/productos.json");
        const existingProduct = await productManager.getObjetsById(
          product.productId
        );

        if (!existingProduct) {
          throw new Error(
            `No se encontró el producto con el ID: ${product.productId}`
          );
        }

        cart.products.push({
          product: existingProduct,
          quantity: product.quantity,
        });
      }

      cartData[cartIndex] = cart;
      await fs.promises.writeFile(this.filename, JSON.stringify(cartData));

      return;
    } catch (error) {
      throw new Error(
        `Error al agregar el producto al carrito: ${error.message}`
      );
    }
  }
}

export default CartManager;
