import mongoose from "mongoose";
import shortid from "shortid";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: shortid.generate,
  },
  purchase_datetime: {
    type: String,
    default: () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const year = now.getFullYear().toString();
      const hours = now.getHours().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}`;
    },
  },
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
