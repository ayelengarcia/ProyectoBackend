import mongoose from "mongoose";

const UserModel = mongoose.model(
  "users",
  new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    password: String,
    email: { type: String, unique: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
    roles: { type: String, default: "Usuario" },
    documents: [{
      name: String,
      fileType: String,
      reference: String
    }],
    last_connection:{type: String, default: ""},
    status: { type: String, default: "file not uploaded"},
  })
);

export default UserModel;
