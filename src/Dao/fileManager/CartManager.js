import fs from "fs";
import ProductManager from "./ProductManager.js";

export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  //Generar codigo
  generarCode(index) {
    const CODE = "CART" + (index + 1);
    return CODE;
  }

  //Mostrar todos los carritos
  getCarts = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error, no se encontró el archivo");
      return [];
    }
  };

  //Agregar carrito nuevo
  addCart = async (cart) => {
    const cartsAll = await this.getCarts();
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

    await fs.promises.writeFile(this.path, JSON.stringify(cartsAll));
  };


  //Agregar productos a carrito existente por ID
  async addProductToCart(cartId, product) {
    try {
      const cartData = await this.getCarts();
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
        const existingProduct = await productManager.getProductById(
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
      await fs.promises.writeFile(this.path, JSON.stringify(cartData));

      return;
    } catch (error) {
      throw new Error(
        `Error al agregar el producto al carrito: ${error.message}`
      );
    }
  }

  //Obtener carrito por ID
  getCartById = async (cartId) => {
    const cartsAll = await this.getCarts();
    const cart = cartsAll.find((cart) => cart.id === cartId);

    if (cart) return cart;
    else return console.log("Carrito no identificado.");
  };


  //Eliminar Carrito
  deleteCart = async (cartId) => {
    try {
      const cartsAll = await this.getCarts();
      const cartIndex = cartsAll.findIndex((cart) => cart.id === cartId);

      if (cartIndex !== -1) {
        const deletedCart = cartsAll.splice(cartIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(cartsAll));

        return deletedCart;
      }
    } catch (error) {
      return console.error("Error al eliminar el carrito:", error);
    }
  };
}

async function run() {
  const carrito = new CartManager("ddbb/carrito.json");

  // const cart = {
  //   products: [
  //     {
  //       productId: 5,
  //       quantity: 1,
  //     },
  //   ],
  // };

  // await carrito.addCart(cart);

  // console.log("Lista de carritos", await carrito.getCarts());

  //console.log("Carrito ID", await carrito.getCartById(2));
  // console.log("Carrito eliminado", await carrito.deleteCart(3));
}

run();
