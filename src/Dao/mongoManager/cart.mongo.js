import CartModel from "./models/cartModel.js";
import ProductModel from "./models/productModel.js";

export default class Cart {
  createCart = async () => {
    return await CartModel.create({ products: [] });
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

    if (!product) {
      throw new Error("No existe el producto");
    }

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

  finishPurchase = async (cid) => {
    try {
      const cartUser = await CartModel.findOne({ _id: cid });

      if (!cartUser) {
        throw new Error("Carrito no encontrado");
      }

      const cartProducts = cartUser.products;

      for (const product of cartProducts) {
        const productInStock = await ProductModel.findById(product._id);

        if (!productInStock) {
          throw new Error(`Producto  no encontrado en stock`);
        }

        if (productInStock.stock >= product.products.quantity) {
          productInStock.stock -= product.products.quantity;

          await productInStock.save();
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
