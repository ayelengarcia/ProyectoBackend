import { productService } from "../services/index.js";
import config from "../config/config.js";
import { handleError } from "../utils.js";

export const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const result = await productService.getProducts(limit);

    res.send({ status: "Success", payload: result });
  } catch (error) {
    req.logger.error("No se pudo obtener los productos");
    handleError(config.product_not_found, res);
  }
};

export const addProducts = async (req, res) => {
  const data = req.body;
  const { email } = req.user.user;
  data.owner = email;

  try {
    const result = await productService.addProducts(data);

    res
      .status(201)
      .json({ message: "Producto agregado exitosamente", payload: result });
  } catch (error) {
    console.error(error);
    req.logger.error("No se pudo agregar el producto");
    handleError(config.product_not_add, res);
  }
};

export const getProductById = async (req, res) => {
  const id = req.params.pid;
  try {
    const result = await productService.getProductById(id);

    if (result) {
      res.send({ status: "Producto encontrado", payload: result });
    } else {
      req.logger.warning("No se encontró");
      res.send({ status: "No se encontró" });
    }
  } catch (error) {
    req.logger.error("No se pudo obtener el producto");
    handleError(config.product_not_found, res);
  }
};

export const updatedProductById = async (req, res) => {
  const productId = req.params.pid;
  const { code, title, description, stock, price, thumbnail, category, owner } =
    req.body;
  const updatedProduct = {
    code,
    title,
    description,
    stock,
    price,
    thumbnail,
    category,
    owner,
  };

  try {
    const result = await productService.updatedProductById(
      productId,
      updatedProduct
    );

    res.send({ status: "Producto actualizado exitosamente", payload: result });
  } catch (error) {
    req.logger.error("No se pudo actualizar el producto");
    handleError(config.product_not_update, res);
  }
};

export const deletedProduct = async (req, res) => {
  const productId = req.params.pid;
  try {
    const result = await productService.deleteProduct(productId);

    if (result) {
      res.send({ status: "Producto eliminado exitosamente", payload: result });
    } else {
      req.logger.warning("No se pudo eliminar");
      res.send({ status: "No se pudo eliminar" });
    }
  } catch (error) {
    req.logger.error("Error eliminar el producto");
    handleError(config.product_not_delete, res);
  }
};
