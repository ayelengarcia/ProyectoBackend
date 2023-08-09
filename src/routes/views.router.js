//solo contendra renderizaciones
import { Router } from "express";
import ProductManager from "../Dao/fileManager/ProductManager.js";
import ProductModel from "../Dao/mongoManager/models/productModel.js";

const producto = new ProductManager("ddbb/productos.json");
const router = Router();

//Ruta principal
router.get("/", (req, res) => {
  res.render("index", {});
});

//Todos los productos
router.get("/products", async (req, res) => {
  const products = await producto.getProducts();

  res.render("products", { products });
});

//Form crear productos
router.get("/form-products", async (req, res) => {
  res.render("form", {});
});

router.post("/form-products", async (req, res) => {
  const { title, description, price, thumbnail } = req.body;

  await producto.addProduct(title, description, price, thumbnail);
  res.redirect("/products");
});

// Real times products
router.get("/products-realtime", async (req, res) => {
  const products = await producto.getProducts();

  res.render("products-realtime", { products });
});

router.post("/form-products", async (req, res) => {
  const { title, description, price, thumbnail } = req.body;

  await producto.addProduct(title, description, price, thumbnail);

  io.emit("new-product", { title, description, price, thumbnail });

  res.redirect("/products-realtime");
});

// PAGINATE
router.get("/products/paginate", async (req, res) => {
  const page = parseInt(req.query?.page || 1);
  const limit = parseInt(req.query?.limit || 3);

  const queryParams = req.query?.query || "";
  const query = {};

  if (queryParams) {
    const [field, value] = queryParams.split(",");
    if (!isNaN(parseInt(value))) {
      query[field] = value;
    }
  }

  const sortField = req.query?.sortField || "createdAt";
  const sortOrder = req.query?.sortOrder === "desc" ? -1 : 1;

  try {
    const products = await ProductModel.paginate(query, {
      limit,
      page,
      lean: true,
      sort: { [sortField]: sortOrder },
    });

    products.prevLink = products.hasPrevPage
      ? `/products/paginate/?page=${products.prevPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";
    products.nextLink = products.hasNextPage
      ? `/products/paginate/?page=${products.nextPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      : "";

    return res.render("paginate", products);
  } catch (error) {
    return res.status(500).send("Error al enviar products.");
  }
});

//127.0.0.1:8080/products/paginate/?page=&limit=7&sortField=price&sortOrder=desc

//Para enviar rta:

// const totalPages = Math.ceil(products.totalCount / limit);
// const hasPrevPage = page > 1;
// const hasNextPage = page < totalPages;

// const response = {
//   status: "success",
//   payload: products,
//   totalPages,
//   prevPage: hasPrevPage ? page - 1 : null,
//   nextPage: hasNextPage ? page + 1 : null,
//   page,
//   hasPrevPage,
//   hasNextPage,
//   prevLink: hasPrevPage
//     ? `/products/paginate/?page=${products.prevPage}&limit=${limit}`
//     : "",
//   nextLink: hasNextPage
//     ? `/products/paginate/?page=${products.nextPage}&limit=${limit}`
//     : "",
// };
// res.status(200).json(response);

http: router.get("/messages", (req, res) => {
  res.render("messages", {});
});

export default router;
