import FileManager from "./managers/FileManager.js";
import CartManager from "./managers/CartManager.js";

const CartManager = new CartManager();

export default class Cart extends FileManager {
  constructor(filename = "./ddbb/carrito.json") {
    super(filename);
  }

  createCart = async (cart) => {
    return await CartManager.addCart(cart);
  };

  getCarts = async (limit) => {
    if (limit) {
      const carts = await this.getObjets();
      return carts.slice(0, limit);
    } else {
      return await this.getObjets();
    }
  };

  getCartById = async (id) => {
    return await this.getObjetsById(id);
  };

  deleteCartById = async (id) => {
    return await this.deleteObjets(id);
  };

  addProductCart = async (cid, pid, quantity) => {
    const cart = this.getCartById(cid);
    cart.products.quantity = quantity;
    return await CartManager.addProductToCart(cid, pid);
  };
}
