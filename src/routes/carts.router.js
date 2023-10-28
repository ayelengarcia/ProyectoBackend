import { Router } from "express";
import {
  addProductCart,
  createCart,
  deleteCartById,
  deleteProductCart,
  finishPurchase,
  getCartById,
  getCarts,
} from "../controllers/carts.controller.js";
import {
  authorizationAddToCart,
  authorizationRol,
  authorizationStrategy,
} from "../utils.js";

const router = Router();

//Crear carrito nuevo
router.post("/carts", createCart);

//Mostrar todos los carritos
router.get("/carts", getCarts);

//Mostrar carrito por ID
router.get("/carts/:cid", getCartById);

// Agregar productos a carrito existente
router.post(
  "/carts/:cid/:pid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Usuario", "Premium"]),
  authorizationAddToCart,
  addProductCart
);

//eliminar product to cart
router.delete(
  "/carts/:cid/:pid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Usuario"),
  deleteProductCart
);

//Eliminar carrito
router.delete(
  "/carts/:cid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Usuario"),
  deleteCartById
);

//Finalizar compra
router.post(
  "/carts/purchase/buy/:cid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Usuario"),
  finishPurchase
);

export default router;
