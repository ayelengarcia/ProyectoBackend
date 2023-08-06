//solo contendra renderizaciones

import { Router } from "express";
import ProductManager from "../Dao/fileManager/ProductManager.js";

const producto = new ProductManager("ddbb/productos.json");
const router = Router();

//Ruta principal
router.get("/", (req, res) => {
  res.render("index", {});
});

//Todos los productos
router.get("/products", async (req, res) => {
  const products = await producto.getProducts();

  res.render("products", { products });
});

//Form crear productos
router.get("/form-products", async (req, res) => {
  res.render("form", {});
});

router.post("/form-products", async (req, res) => {
  const { title, description, price, thumbnail } = req.body;

  await producto.addProduct(title, description, price, thumbnail);
  res.redirect("/products");
});

// Real times products
router.get("/products-realtime", async (req, res) => {
  const products = await producto.getProducts();

  res.render("products-realtime", { products });
});

router.post("/form-products", async (req, res) => {
  const { title, description, price, thumbnail } = req.body;

  await producto.addProduct(title, description, price, thumbnail);

  io.emit("new-product", { title, description, price, thumbnail });

  res.redirect("/products-realtime");
});

export default router;
