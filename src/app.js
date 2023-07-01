import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
app.use(express.json());

app.use("/api", productsRouter);
app.use("/api", cartsRouter);

app.listen(8080);
