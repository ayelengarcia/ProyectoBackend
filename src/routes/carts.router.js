import { Router } from "express";
import productModel from "../Dao/mongoManager/models/productModel.js";
import cartModel from "../Dao/mongoManager/models/cartModel.js";

const router = Router();

//Agregar carrito nuevo
router.post("/carts", async (req, res) => {
  try {
    new cartModel({ products: [] }).save();
    res.send("Carrito creado");
  } catch (e) {
    res.status(500).send("Error al crear el carrito");
  }
});

// Agregar productos a un carrito existente
router.post("/carts/:cartId/product", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = parseInt(req.body.quantity || 1);

  try {
    let cart = await cartModel.findById(cid);
    let productos = await productModel.findById(pid);

    if (!cart) {
      cart = new cartModel({ products: { pid, quantity } });
      await cart.save();
    }
    if (productos) {
      const existProduct = cart.products.find(
        (item) => item.pid.toString() === pid
      );

      if (existProduct) {
        existProduct.quantity += quantity;
        await cart.save();
      } else {
        cart.products.push({ pid, quantity });
        await cart.save();
      }
      res.send({ message: "producto agregado" });
    }
  } catch (e) {
    console.error("Error al agregar el producto:", e);
    res.status(500).send({ error: "Error al agregar el producto" });
  }
});

//Mostrar todos los carritos
router.get("/carts", async (req, res) => {
  const limit = parseInt(req.query.limit);

  if (limit) {
    try {
      const carritos = await cartModel.find().lean().exec();
      const limitedProducts = carritos.slice(0, limit); // Agregar límite acá

      return res.status(200).json(limitedProducts);
    } catch (error) {
      return res.status(404).json({ error: "Error al obtener los productos" });
    }
  } else {
    const carritos = await cartModel.find().lean().exec();
    return res.status(200).json(carritos);
  }
});

//Mostrar carrito por ID
router.get("/carts/:cid", async (req, res) => {
  let cid = parseInt(req.params.cid);

  try {
    const cart = await cartModel.findOne({ _id: cid }).populate("products.pid");
    if (cart) {
      res.send(cart);
    } else {
      res.send("El carrito:" + cid + " no se encontró");
    }
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

//Eliminar carrito
router.delete("/carts/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);

  try {
    await cartModel.updateOne(id);
    return res.status(200).json({ message: "Carrito Eliminado" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el carrito" });
  }
});

export default router;
