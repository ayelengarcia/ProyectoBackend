import { Product, Cart, User, Ticket } from "../Dao/factory.js";
import ProductRepository from "./product.repository.js";
import CartRepository from "./carts.repository.js";
import UserRepository from "./users.repository.js";
import TicketRepository from "./ticket.repository.js";

export const productService = new ProductRepository(new Product());
export const cartService = new CartRepository(new Cart());
export const userService = new UserRepository(new User());
export const ticketService = new TicketRepository(new Ticket());
