import { Router } from "express";
import {
  addProducts,
  deletedProduct,
  getProductById,
  getProducts,
  updatedProductById,
} from "../controllers/products.controller.js";

const router = Router();

//query - Mostrar todos los productos
router.get("/products", getProducts);
// http://127.0.0.1:8080/api/products o
// http://127.0.0.1:8080/api/products?limit=5

//Agregar producto (body)
router.post("/products", addProducts);

//params - Mostrar producto por ID
router.get("/products/:pid", getProductById);
// http://127.0.0.1:8080/api/products/2

// Actualizar producto
router.put("/products/:pid", updatedProductById);

//Eliminar Producto
router.delete("/products/:pid", deletedProduct);

export default router;
