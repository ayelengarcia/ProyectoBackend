import mongoose from "mongoose";

const productsCollections = "products";

const productsSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  description: String,
  code: String,
  stock: Number,
  price: Number,
});

const productModel = mongoose.model(productsCollections, productsSchema);

export default productModel;
