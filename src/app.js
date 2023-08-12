import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import __dirname from "./utils.js";
import ProductManager from "./Dao/fileManager/ProductManager.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
// import cookieParser from "cookie-parser";
// import FileStore from "session-file-store";

const producto = new ProductManager("ddbb/productos.json");

const app = express();
// const fileStore = FileStore(session);
const dbName = "DBecommerce";
const URL =
  "mongodb+srv://ayelengarcia7:eIXUnjHpOu7NgSKF@clustercoder.t6a33ln.mongodb.net/?retryWrites=true&w=majority";

app.use("/static", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser("HacemosLasCookiesCifradas")); //conectamos cookies con nuestro sv
app.use(
  session({
    // store: new fileStore({
    //   path: "./sessions",
    //   ttl: 100,
    //   retries: 2,
    // }),
    store: MongoStore.create({
      mongoUrl: URL,
      dbName,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100,
    }),
    secret: "ParaFirmarElIDenElBrowser",
    resave: true, //Para mantener la sesion activa
    saveUninitialized: true, //Guardar cualquier cosa, así esté vacío
  })
);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api", productsRouter);
app.use("/api", cartsRouter);

mongoose.set("strictQuery", false);

mongoose
  .connect(URL, { dbName })
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
