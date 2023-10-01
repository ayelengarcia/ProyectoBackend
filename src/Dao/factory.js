import config from "../config/config.js";
import mongoose, { mongo } from "mongoose";

export let Cart;
export let Product;
export let User;
export let Ticket;

console.log(`Persistencia con ${config.persistence}`);

switch (config.persistence) {
  case "MONGO":
    mongoose.connect(config.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: config.dbName,
    });

    const { default: ProductMongo } = await import(
      "./mongoManager/product.mongo.js"
    );
    const { default: CartMongo } = await import("./mongoManager/cart.mongo.js");
    const { default: UserMongo } = await import("./mongoManager/user.mongo.js");
    const { default: TicketMongo } = await import(
      "./mongoManager/ticket.mongo.js"
    );

    Product = ProductMongo;
    Cart = CartMongo;
    User = UserMongo;
    Ticket = TicketMongo;
    break;

  case "FILE":
    const { default: ProductFile } = await import(
      "./fileManager/product.file.js"
    );
    const { default: CartFile } = await import("./fileManager/cart.file.js");
    const { default: UserFile } = await import("./fileManager/user.file.js");
    const { default: TicketFile } = await import(
      "./fileManager/ticket.file.js"
    );

    Product = ProductFile;
    Cart = CartFile;
    User = UserFile;
    Ticket = TicketFile;
    break;

  default:
    break;
}
