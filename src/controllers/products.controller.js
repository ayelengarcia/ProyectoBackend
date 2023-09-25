// import ProductMongo from "../Dao/mongoManager/product.mongo.js";
import { productService } from "../services/index.js";

// const productService = new ProductMongo();

export const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const result = await productService.getProducts(limit);

    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

export const addProducts = async (req, res) => {
  const data = req.body;
  try {
    const result = await productService.addProducts(data);
    res
      .status(201)
      .json({ message: "Producto agregado exitosamente", payload: result });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto" });
  }
};

export const getProductById = async (req, res) => {
  const id = req.params.pid;

  try {
    const result = await productService.getProductById(id);

    res.send({ message: "Producto encontrado", payload: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

export const updatedProductById = async (req, res) => {
  const productId = req.params.pid;
  const { title, description, price, thumbnail, stock, code } = req.body;
  try {
    const result = await productService.updatedProductById(productId, {
      $set: {
        title,
        description,
        price,
        thumbnail,
        stock,
        code,
      },
    });

    res.send({ status: "Producto actualizado exitosamente", payload: result });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

export const deletedProduct = async (req, res) => {
  const productId = req.params.pid;
  try {
    const result = await productService.deleteProduct(productId);

    res.send({ status: "Producto eliminado exitosamente", payload: result });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
