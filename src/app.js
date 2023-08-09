import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import ProductManager from "./Dao/fileManager/ProductManager.js";
import mongoose from "mongoose";

const producto = new ProductManager("ddbb/productos.json");

const app = express();

app.use("/static", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api", productsRouter);
app.use("/api", cartsRouter);

mongoose.set("strictQuery", false);
const URL =
  "mongodb+srv://ayelengarcia7:eIXUnjHpOu7NgSKF@clustercoder.t6a33ln.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(URL, { dbName: "DBecommerce" })
  .then(() => {
    console.log("DB connectada");
    const httpServer = app.listen("8080", () => console.log("Listening..."));
    const io = new Server(httpServer);
    let messages = [];

    io.on("connection", (socket) => {
      socket.on("new-product", async (data) => {
        await producto.addProduct(
          data.title,
          data.description,
          data.price,
          data.thumbnail
        );
        console.log(data);

        const products = await producto.getProducts();
        io.emit("update-products", products);
      });

      socket.on("new", (user) => console.log(`${user} se acaba de conectar`));

      socket.on("message", (data) => {
        messages.push(data);
        io.emit("logs", messages);
      });
    });
  })
  .catch((e) => {
    console.log("Error al conectar a la DB");
  });
