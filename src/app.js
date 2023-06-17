import express from "express";
import ProductManager from "../ProductManager.js";

const app = express();
app.use(express.json());

const producto = new ProductManager("db.json");

//query
app.get("/products", async (req, res) => {
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
// http://127.0.0.1:8080/products o // http://127.0.0.1:8080/products?limit=5

//params
app.get("/products/:pid", async (req, res) => {
  let id = parseInt(req.params.pid);

  try {
    const productoId = await producto.getProductById(id);
    id = productoId;

    return res.status(200).json(id);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los productos" });
  }
});

app.listen(8080);
