import mongoose from "mongoose";

const productsCollections = "products";

const productsSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  description: String,
  stock: Number,
  price: Number,
  code: String,
});

const ProductModel = mongoose.model(productsCollections, productsSchema);

export default ProductModel;
