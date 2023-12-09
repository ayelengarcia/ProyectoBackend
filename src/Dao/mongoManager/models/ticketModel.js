import mongoose from "mongoose";
import shortid from "shortid";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: shortid.generate,
  },
  purchase_datetime: Date,
  amount: Number,
  purchaser: String,
  products: [
    {
      pid: {
        title: String,
        price: Number,
      },
      quantity: Number,
    },
  ],
});

const ticketModel = mongoose.model(ticketsCollection, ticketSchema);

export default ticketModel;
