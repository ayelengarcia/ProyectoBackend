import { Router } from "express";
import CartManager from "../Manager/CartManager.js";

const router = Router();

const carrito = new CartManager("ddbb/carrito.json");

//Agregar carrito nuevo
router.post("/carts", async (req, res) => {
  const {
    products: [{ productId, quantity }],
  } = req.body;

  try {
    await carrito.addCart({
      products: [{ productId, quantity }],
    });
    return res.status(201).json({ message: "Carrito agregado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al agregar el carrito" });
  }
});

// Agregar productos a un carrito existente
router.post("/carts/:cartId/product", async (req, res) => {
  const cartId = parseInt(req.params.cartId);
  const { productId, quantity } = req.body;

  try {
    await carrito.addProductToCart(cartId, { productId, quantity });
    return res
      .status(201)
      .json({ message: "Producto agregado exitosamente al carrito" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al agregar el producto al carrito" });
  }
});

//Mostrar todos los carritos
router.get("/carts", async (req, res) => {
  const limit = parseInt(req.query.limit);

  if (limit) {
    try {
      const carritos = await carrito.getCarts();
      const limitedProducts = carritos.slice(0, limit); // Agregar límite acá

      return res.status(200).json(limitedProducts);
    } catch (error) {
      return res.status(404).json({ error: "Error al obtener los productos" });
    }
  } else {
    const carritos = await carrito.getCarts();
    return res.status(200).json(carritos);
  }
});
// http://127.0.0.1:8080/api/products o // http://127.0.0.1:8080/api/products?limit=5

//Mostrar carrito por ID
router.get("/carts/:cid", async (req, res) => {
  let id = parseInt(req.params.cid);

  try {
    const cartId = await carrito.getCartById(id);
    id = cartId;

    return res.status(200).json(id);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el carrito" });
  }
});
// http://127.0.0.1:8080/api/products/2

//Eliminar carrito
router.delete("/carts/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);

  try {
    await carrito.deleteCart(id);
    return res.status(200).json({ message: "Carrito Eliminado" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el carrito" });
  }
});

export default router;
