import mongoose, { Schema } from "mongoose";

const cartCollection = "cart";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        pid: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: Number,
      },
    ],
  },
});

cartSchema.pre("findOne", function () {
  this.populate("products.pid");
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
