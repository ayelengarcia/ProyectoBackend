import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import ProductManager from "./Manager/ProductManager.js";

const producto = new ProductManager("ddbb/productos.json");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api", productsRouter);
app.use("/api", cartsRouter);

const httpServer = app.listen(8080);
const io = new Server(httpServer);

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
});
