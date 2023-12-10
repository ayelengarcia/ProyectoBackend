import Product from "../Dao/mongoManager/product.mongo.js";
import Assert from "assert";
import mongoose from "mongoose";
import config from "../config/config.js";

mongoose
  .connect(config.dbURL, { dbName: config.dbNameTest })
  .then(() => console.log("DB TEST conectada"))
  .catch((e) => console.error("ERROR DB TEST"));

//Nativo de node
const assert = Assert.strict;

describe("Testing Product DAO", () => {
  it("El DAO debe poder obtener los Productos", async function () {
    this.timeout(5000);
    const productDao = new Product();
    const result = await productDao.getProducts();

    assert.strictEqual(Array.isArray(result), true);
  });

  it("El DAO debe poder crear Productos", async function () {
    this.timeout(5000);
    let product = {
      title: "Test product",
      thumbnail: "Test img",
      description: "Test description",
      stock: 85,
      price: 3065,
    };

    const productDao = new Product();
    const result = await productDao.addProducts(product);

    assert.ok(result._id);
  });

  it("El DAO debe poder obtener un Producto por ID", async function () {
    this.timeout(5000);
    let product = {
      title: "Producto a obtener por ID",
      thumbnail: "Imagen",
      description: "Descripción",
      stock: 10,
      price: 100,
    };

    const productDao = new Product();
    const createdProduct = await productDao.addProducts(product);

    // Obtener producto por ID
    const result = await productDao.getProductById(createdProduct._id);

    assert.strictEqual(result._id.toString(), createdProduct._id.toString());
    assert.strictEqual(result.title, product.title);
  });

  it("El DAO debe poder actualizar un Producto por ID", async function () {
    this.timeout(5000);
    let product = {
      title: "Producto a actualizar por ID",
      thumbnail: "Imagen",
      description: "Descripción",
      stock: 10,
      price: 100,
    };
  
    const productDao = new Product();
    const createdProduct = await productDao.addProducts(product);
  
    // Producto actualizado
    const updatedProductData = {
      title: "Producto Actualizado",
      stock: 20,
      price: 150,
    };
  
    const updatedProduct = await productDao.updatedProductById(createdProduct._id, updatedProductData);
  
    assert.strictEqual(updatedProduct.title, updatedProductData.title);
    assert.strictEqual(updatedProduct.stock, updatedProductData.stock);
    assert.strictEqual(updatedProduct.price, updatedProductData.price);
  });
  
  it("El DAO debe poder eliminar un Producto por ID", async function () {
    this.timeout(5000);
    let product = {
      title: "Producto a eliminar por ID",
      thumbnail: "Imagen",
      description: "Descripción",
      stock: 10,
      price: 100,
    };
  
    const productDao = new Product();
    const createdProduct = await productDao.addProducts(product);
  
    const result = await productDao.deleteProduct(createdProduct._id);
    assert.ok(result, true);
  });
  

});
