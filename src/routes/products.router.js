import { Router } from "express";
import {
  addProducts,
  deletedProduct,
  getProductById,
  getProducts,
  updatedProductById,
} from "../controllers/products.controller.js";
import { authorizationRol, authorizationStrategy } from "../utils.js";

const router = Router();

router.get("/products", getProducts);
// http://127.0.0.1:8080/api/products?limit=5

router.post(
  "/products",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Admin"),
  addProducts
);

router.get("/products/:pid", getProductById);

router.put(
  "/products/:pid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Admin"),
  updatedProductById
);

router.delete(
  "/products/:pid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Admin"),
  deletedProduct
);

export default router;
