//solo contendra renderizaciones
import { Router } from "express";
import ProductManager from "../Dao/fileManager/ProductManager.js";
import ProductModel from "../Dao/mongoManager/models/productModel.js";

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

//PAGINATE
router.get("/products/paginate", async (req, res) => {
  const page = parseInt(req.query?.page || 1);

  const products = await ProductModel.paginate(
    {},
    { limit: 2, page, lean: true }
  );

  return res.render("paginate", products);
});
//http://127.0.0.1:8080/products/paginate?page=1

export default router;
