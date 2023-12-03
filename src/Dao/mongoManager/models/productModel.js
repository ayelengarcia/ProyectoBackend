import mongoose from "mongoose";
import mongoosePagination from "mongoose-paginate-v2";

const productsCollections = "product";

const productsSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  description: String,
  stock: Number,
  price: Number,
  code: String,
  category: String,
  owner: { type: String, default: "Admin" },
});

productsSchema.plugin(mongoosePagination);

const ProductModel = mongoose.model(productsCollections, productsSchema);

export default ProductModel;
