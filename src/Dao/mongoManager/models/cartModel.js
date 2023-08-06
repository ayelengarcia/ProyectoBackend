import mongoose from "mongoose";

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
  products: [
    {
      pid: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: Number,
    },
  ],
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
