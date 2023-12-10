import FileManager from "./managers/FileManager.js";
import FileProducts from "./product.file.js";

export default class Cart extends FileManager {
  constructor(filename = "./ddbb/carrito.json") {
    super(filename);
    this.carts = [];
  }

  createCart = async () => {
    const cartsAll = await this.getObjects();
    const newIndex = cartsAll.length;

    const newCart = {
      id: newIndex + 1,
      code: this.generarCode(newIndex),
      products: [],
    };

    cartsAll.push(newCart);
    await this.writeObjects(cartsAll);

    return newCart;
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

  addProductCart = async (cartId, productId, quantity) => {
    const cartsAll = await this.getObjects();
    const cartIndex = cartsAll.findIndex((c) => c.id === parseInt(cartId));

    if (cartIndex === -1) {
      return null;
    }

    const existingProductIndex = cartsAll[cartIndex].products.findIndex(
      (product) => product.product.id === productId
    );

    if (existingProductIndex !== -1) {
      cartsAll[cartIndex].products[existingProductIndex].quantity += quantity;
    } else {
      const product = {
        product: { id: productId },
        quantity: quantity,
      };
      cartsAll[cartIndex].products.push(product);
    }

    await this.writeObjects(cartsAll);

    return cartsAll[cartIndex];
  };

  finishPurchase = async (cid) => {
    try {
      const cart = await this.getObjectsById(cid);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const cartProducts = cart.products;
      const productsFile = new FileProducts();

      for (const product of cartProducts) {
        const productInStock = await productsFile.getObjectsById(product.id);

        if (!productInStock) {
          throw new Error(`Producto no encontrado en stock`);
        }

        if (productInStock.stock >= product.quantity) {
          productInStock.stock -= product.quantity;

          await this.writeObjects(productInStock);
        } else {
          throw new Error(`Stock insuficiente para el producto`);
        }
      }

      return cartProducts;
    } catch (error) {
      throw error;
    }
  };
}
