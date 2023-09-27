import { Router } from "express";
import {
  addProducts,
  deletedProduct,
  getProductById,
  getProducts,
  updatedProductById,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/products", getProducts);
// http://127.0.0.1:8080/api/products?limit=5

router.post("/products", addProducts);

router.get("/products/:pid", getProductById);

router.put("/products/:pid", updatedProductById);

router.delete("/products/:pid", deletedProduct);

export default router;
