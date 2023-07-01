import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager("db.json");

let nextCartId = 1;
const carts = [];

router.post("/carts", async (req, res) => {
  try {
    const newCart = {
      id: generateCartId(),
      products: [],
    };

    carts.push(newCart);
    return res.status(201).json({ message: "Carrito creado" });
  } catch (error) {
    return res.status(500).json({ error: "Error al crear un nuevo carrito" });
  }
});

// Listar los productos de un carrito específico
router.get("/carts/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = getCartById(cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Agregar un producto al carrito
router.post("carts/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  const cart = getCartById(cid);

  if (cart) {
    const existingProductIndex = cart.products.findIndex(
      (product) => product.product === pid
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      const product = productManager.getProductById(pid);

      if (product) {
        cart.products.push({
          product: pid,
          quantity: quantity,
        });
      }
    }

    res.json(cart.products);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// generar un id unico para el carrito
function generateCartId() {
  const uniqueId = nextCartId;
  nextCartId++;
  return uniqueId.toString();
}

// obtener carrito por id
function getCartById(cartId) {
  return carts.find((cart) => cart.id === cartId);
}

export default router;
