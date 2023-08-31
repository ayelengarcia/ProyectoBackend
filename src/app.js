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
import initPassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";

const producto = new ProductManager("ddbb/productos.json");

const app = express();
const dbName = "DBecommerce";
const URL =
  "mongodb+srv://ayelengarcia7:eIXUnjHpOu7NgSKF@clustercoder.t6a33ln.mongodb.net/?retryWrites=true&w=majority";

//Data for post JSON
app.use(express.json());
app.use("/static", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //Conectamos cookies con nuestro sv

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Mongo session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: URL,
      dbName,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100,
    }),
    secret: "mysecret",
    resave: true, //Mantener sesion activa
    saveUninitialized: true, //Save sesion, así esté vacía
  })
);

//Passport
initPassport();
app.use(passport.initialize());
app.use(passport.session());

//Rutas
app.use("/", viewsRouter);
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/api/sessions", sessionsRouter);

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

      socket.on("new", (user) =>
        console.log(`${user} se acaba de conectar al chat`)
      );

      socket.on("message", (data) => {
        messages.push(data);
        io.emit("logs", messages);
      });
    });
  })
  .catch((e) => {
    console.log("Error al conectar a la DB");
  });
