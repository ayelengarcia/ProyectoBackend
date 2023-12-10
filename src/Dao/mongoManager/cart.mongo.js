import CartModel from "./models/cartModel.js";
import ProductModel from "./models/productModel.js";

export default class Cart {
  createCart = async () => {
    const cart = await CartModel.create({ products: [] });
    return await cart.save();
  };

  getCarts = async (limit) => {
    if (limit) {
      const carts = await CartModel.find().lean().exec();
      return carts.slice(0, limit);
    } else {
      return await CartModel.find().lean().exec();
    }
  };

  getCartById = async (id) => {
    return await CartModel.findOne({ _id: id });
  };

  deleteCartById = async (id) => {
    return await CartModel.findByIdAndDelete(id);
  };

  addProductCart = async (cid, pid, quantity) => {
    const cart = await CartModel.findById(cid);
    const product = await ProductModel.findById(pid);

    if (!product) throw new Error("No existe el producto");

    if (!cart) {
      const newCart = new CartModel({ products: [{ pid, quantity }] });
      await newCart.save();
      return newCart;
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.pid._id.toString() === pid
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ pid, quantity });
    }

    await cart.save();
    return cart;
  };

  deleteProductCart = async (cid, pid) => {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const existingProductIndex = cart.products.findIndex(
      (item) => item.pid._id.toString() === pid
    );

    if (existingProductIndex !== -1) {
      const productToRemove = cart.products[existingProductIndex];

      if (productToRemove.quantity > 1) {
        productToRemove.quantity -= 1;
      } else {
        cart.products.splice(existingProductIndex, 1);
      }
      await cart.save();
    } else {
      throw new Error("El producto no está en el carrito");
    }
    return cart;
  };

  finishPurchase = async (cid) => {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const cartProducts = cart.products;
    const productsToRemove = [];

    for (const cartProduct of cartProducts) {
      const productInCart = await ProductModel.findById(cartProduct.pid);

      if (!productInCart) throw new Error(`Producto no encontrado`);

      if (productInCart.stock >= cartProduct.quantity) {
        productInCart.stock -= cartProduct.quantity;
        await productInCart.save();
      } else {
        productsToRemove.push(cartProduct.pid);
      }
    }
    const productosComprados = cart.products.filter(
      (cartProduct) => !productsToRemove.includes(cartProduct.pid)
    );

    const total = productosComprados.reduce((accumulator, product) => {
      const subtotal = product.pid.price * product.quantity;
      return accumulator + subtotal;
    }, 0);

    cart.products = cart.products.filter((cartProduct) =>
      productsToRemove.includes(cartProduct.pid)
    );

    await cart.save();

    return {
      sinStock: productsToRemove,
      buyProducts: productosComprados,
      amountTotalBuy: total,
    };
  };
}
