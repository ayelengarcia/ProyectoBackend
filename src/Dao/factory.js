import config from "../config/config.js";
import mongoose, { mongo } from "mongoose";

export let Cart;
export let Product;

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

    Product = ProductMongo;
    Cart = CartMongo;
    break;

  case "FILE":

    const { default: ProductFile } = await import("./fileManager/product.file.js");
    const { default: CartFile } = await import("./fileManager/cart.file.js");

    Product = ProductFile;
    Cart = CartFile;
    break;

  default:
    break;
}
