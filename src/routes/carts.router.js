import { Router } from "express";
import {
  addProductCart,
  createCart,
  deleteCartById,
  getCartById,
  getCarts,
} from "../controllers/carts.controller.js";
import { authorizationRol, authorizationStrategy } from "../utils.js";

const router = Router();

//Crear carrito nuevo
router.post("/carts", createCart);

//Mostrar todos los carritos
router.get("/carts", getCarts);

// Agregar productos a carrito existente
router.post(
  "/carts/:cid/:pid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol("Usuario"),
  addProductCart
);

//Mostrar carrito por ID
router.get("/carts/:cid", getCartById);

//Eliminar carrito
router.delete("/carts/:cid", deleteCartById);

export default router;
