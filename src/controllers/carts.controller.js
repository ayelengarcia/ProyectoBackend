import { cartService } from "../services/index.js";

export const createCart = async (req, res) => {
  try {
    const cart = cartService.createCart();
    res.send({ status: "success", payload: cart });
  } catch (e) {
    res.status(500).send("Error al crear el carrito");
  }
};

export const getCarts = async (req, res) => {
  const limit = req.query.limit;
  try {
    const carts = await cartService.getCarts(limit);
    res.send({ message: "Carritos obtenidos exitosamente", payload: carts });
  } catch (error) {
    res.status(404).json({ error: "Error al obtener los carritos" });
  }
};

export const getCartById = async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartService.getCartById(cid);
    res.send({ message: "Carrito obtenido exitosamente", payload: cart });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

export const addProductCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.query.quantity || 1;

  try {
    const result = await cartService.addProductCart(cid, pid, quantity);
    if (result) {
      res.send({ status: "Producto agregado al carrito", payload: result });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
};

export const checkStock = async (req, res) => {
  const cid = req.params.cid;
  const email = req.query.purchaser;
  try {
    const result = await cartService.checkStock(cid, email);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(404).send({ succes: false, message: error.message });
  }
};

export const deleteCartById = async (req, res) => {
  const cid = req.params.cid;
  try {
    const result = await cartService.deleteCartById(cid);
    res.send({ message: "Carrito eliminado exitosamente", payload: result });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el carrito" });
  }
};
