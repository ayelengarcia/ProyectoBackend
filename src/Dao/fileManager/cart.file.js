import FileManager from "./managers/FileManager.js";
import ProductFile from "./product.file.js";

export default class Cart extends FileManager {
  constructor(filename = "./ddbb/carrito.json") {
    super(filename);
    this.carts = [];
  }

  createCart = async (cart) => {
    const cartsAll = await this.getObjects();
    const newIndex = cartsAll.length;

    const newCart = {
      id: newIndex + 1,
      code: this.generarCode(newIndex),
      products: [],
    };

    const productFile = new ProductFile("./ddbb/productos.json");

    await Promise.all(
      cart.products.map(async (item) => {
        const product = await productFile.getProductById(item.productId);
        if (product) {
          newCart.products.push({
            product,
            quantity: item.quantity,
          });
        }
      })
    );

    cartsAll.push(newCart);

    await this.writeObjects(cartsAll);
  };

  getCarts = async (limit) => {
    if (limit) {
      const carts = await this.getObjects();
      return carts.slice(0, limit);
    } else {
      return await this.getObjects();
    }
  };

  getCartById = async (id) => {
    return await this.getObjectsById(id);
  };

  deleteCartById = async (id) => {
    return await this.deleteObjets(id);
  };

  addProductCart = async (cartId, product) => {
    try {
      const cartData = await this.getObjects();
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
        const productFile = new ProductFile("./ddbb/productos.json");
        const existingProduct = await productFile.getObjectsById(
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
      await this.writeObjects(cartData);

      return;
    } catch (error) {
      throw new Error(
        `Error al agregar el producto al carrito: ${error.message}`
      );
    }
  };
}
