import { Router } from "express";
import ProductModel from "../Dao/mongoManager/models/productModel.js";

const router = Router();

//query - Mostrar todos los productos
router.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit);

  if (limit) {
    try {
      const products = await ProductModel.find();
      const limitedProducts = products.slice(0, limit); // Agregar límite acá

      return res.status(200).json(limitedProducts);
    } catch (error) {
      return res.status(404).json({ error: "Error al obtener los productos" });
    }
  } else {
    const products = await ProductModel.find();
    return res.status(200).json(products);
  }
});
// http://127.0.0.1:8080/api/products o // http://127.0.0.1:8080/api/products?limit=5

//Agregar producto (body)
router.post("/products", async (req, res) => {
  const data = req.body;

  try {
    const result = await ProductModel.create(data);
    return res
      .status(201)
      .json({ message: "Producto agregado exitosamente", result });
  } catch (error) {
    return res.status(500).json({ error: "Error al agregar el producto" });
  }
});

//params - Mostrar producto por ID
router.get("/products/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    const productoId = await ProductModel.findById(id);
    id = productoId;

    return res.status(200).json(id);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los productos" });
  }
});
// http://127.0.0.1:8080/api/products/2

// Actualizar producto
router.put("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  const { title, description, price, thumbnail, stock, code } = req.body;

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: {
          title,
          description,
          price,
          thumbnail,
          stock,
          code,
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

//Eliminar Producto
router.delete("/products/:pid", async (req, res) => {
  const productId = req.params.pid;

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    return res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
