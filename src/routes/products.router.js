import { Router } from "express";
import ProductManager from "../Manager/ProductManager.js";

const router = Router();

const producto = new ProductManager("ddbb/productos.json");

//query - Mostrar todos los productos
router.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit);

  if (limit) {
    try {
      const products = await producto.getProducts();
      const limitedProducts = products.slice(0, limit); // Agregar límite acá

      return res.status(200).json(limitedProducts);
    } catch (error) {
      return res.status(404).json({ error: "Error al obtener los productos" });
    }
  } else {
    const products = await producto.getProducts();
    return res.status(200).json(products);
  }
});
// http://127.0.0.1:8080/api/products o // http://127.0.0.1:8080/api/products?limit=5

//params - Mostrar producto por ID
router.get("/products/:pid", async (req, res) => {
  let id = parseInt(req.params.pid);

  try {
    const productoId = await producto.getProductById(id);
    id = productoId;

    return res.status(200).json(id);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los productos" });
  }
});
// http://127.0.0.1:8080/api/products/2

//Agregar producto (body)
router.post("/products", async (req, res) => {
  const { title, description, price, thumbnail } = req.body;

  try {
    await producto.addProduct(title, description, price, thumbnail);
    return res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al agregar el producto" });
  }
});

//Actualizar producto
router.put("/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const { title, description, price, thumbnail } = req.body;

  try {
    const updatedProduct = await producto.updateProduct(id, {
      title,
      description,
      price,
      thumbnail,
    });
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el producto" });
  }
});


//Eliminar Producto
router.delete("/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

  try {
    await producto.deleteProduct(id);
    return res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
