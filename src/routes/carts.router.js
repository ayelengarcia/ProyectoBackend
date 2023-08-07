import { Router } from "express";
import CartModel from "../Dao/mongoManager/models/cartModel.js";
import ProductModel from "../Dao/mongoManager/models/productModel.js";

const router = Router();

//Crear carrito nuevo
router.post("/carts", async (req, res) => {
  try {
    const cart = await CartModel.create({ products: [] });
    return res
      .status(200)
      .json({ message: "Carrito creado exitosamente", cart });
  } catch (e) {
    res.status(500).send("Error al crear el carrito");
  }
});

// Agregar productos a un carrito existente
router.post("/carts/:cid/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.query.quantity || 1;

  try {
    const cart = await CartModel.findById(cid);
    const product = await ProductModel.findById(pid);

    if (!product) {
      return res.status(404).json({ message: "No existe el producto" });
    }

    if (!cart) {
      const newCart = new CartModel({ products: [{ pid, quantity }] });
      await newCart.save();
      return res.status(201).json({ message: "Producto agregado al carrito" });
    }

    const existingProduct = cart.products.find(
      (item) => item.pid.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ pid, quantity });
    }

    await cart.save();
    res.send({ message: "Producto agregado al carrito" });
  } catch (e) {
    console.error("Error al agregar el producto:", e);
    res.status(500).send({ error: "Error al agregar el producto" });
  }
});

//Mostrar todos los carritos
router.get("/carts", async (req, res) => {
  const limit = req.query.limit;

  if (limit) {
    try {
      const carts = await CartModel.find().lean().exec();
      const limitCarts = carts.slice(0, limit);

      res.send("Carrito creado", limitCarts);
    } catch (error) {
      return res.status(404).json({ error: "Error al obtener los carritos" });
    }
  } else {
    const carts = await CartModel.find().lean().exec();
    return res.status(200).json(carts);
  }
});

//Mostrar carrito por ID
router.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const cart = await CartModel.findOne({ _id: cid });

    if (cart) {
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ error: "El carrito no se encontró" });
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

//Eliminar carrito
router.delete("/carts/:cid", async (req, res) => {
  const id = req.params.cid;

  try {
    const deleteCart = await CartModel.findByIdAndDelete(id);
    if (!deleteCart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    return res.status(200).json({ message: "Carrito eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el carrito" });
  }
});

export default router;
