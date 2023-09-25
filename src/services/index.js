import { Product, Cart } from "../Dao/factory.js";
import ProductRepository from "./product.repository.js";
import CartRepository from "./carts.repository.js";

export const productService = new ProductRepository(new Product());
export const cartService = new CartRepository(new Cart());
