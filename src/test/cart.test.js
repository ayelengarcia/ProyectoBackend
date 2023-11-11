import Cart from "../Dao/mongoManager/cart.mongo.js";
import Product from "../Dao/mongoManager/product.mongo.js";
import Assert from "assert";
import mongoose from "mongoose";
import config from "../config/config.js";

mongoose
  .connect(config.dbURL, { dbName: config.dbNameTest })
  .then(() => console.log("DB TEST conectada"))
  .catch((e) => console.error("ERROR DB TEST"));

const assert = Assert.strict;

describe("Testing Cart DAO", () => {
  it("El DAO debe poder obtener los Carritos", async function () {
    this.timeout(5000);
    const cartDao = new Cart();
    const result = await cartDao.getCarts();

    assert.strictEqual(Array.isArray(result), true);
  });

  it("El DAO debe poder crear Carritos", async function () {
    this.timeout(5000);
    let cart = [];

    const cartDao = new Cart();
    const result = await cartDao.createCart(cart);

    assert.ok(result._id);
  });

  it("El DAO debe poder crear Carritos con una lista de Productos vacía", async function () {
    this.timeout(5000);
    let cart = [];

    const cartDao = new Cart();
    const result = await cartDao.createCart(cart);

    assert.deepStrictEqual(result.products, []);
  });

  it("El DAO debe poder obtener un Carrito por ID", async function () {
    this.timeout(5000);
    let cart = [];

    const cartDao = new Cart();
    const createdCart = await cartDao.createCart(cart);

    // Obtener cart por ID
    const result = await cartDao.getCartById(createdCart._id);

    assert.strictEqual(result._id.toString(), createdCart._id.toString());
  });

  it("El DAO debe poder eliminar un Carrito por ID", async function () {
    this.timeout(5000);
    let cart = [];
  
    const cartDao = new Cart();
    const createdCart = await cartDao.createCart(cart);
  
    const result = await cartDao.deleteCartById(createdCart._id);
    assert.ok(result, true);
  });

  it("El DAO debe poder agregar un Producto al Carrito", async function () {
    this.timeout(5000);
    let product = {
      title: "Producto para agregar al carrito",
      thumbnail: "Imagen",
      description: "Descripción",
      stock: 10,
      price: 100,
    };

    const productDao = new Product();
    const createdProduct = await productDao.addProducts(product);

    const cartDao = new Cart();
    const createdCart = await cartDao.createCart();

    // Agregar el producto al carrito
    const result = await cartDao.addProductCart(createdCart._id, createdProduct._id, 2);

    // Verificar que se agrega
    assert.strictEqual(result.products.length, 1);
    assert.strictEqual(result.products[0].pid._id.toString(), createdProduct._id.toString());
    assert.strictEqual(result.products[0].quantity, 2);
  });

  it("El DAO debe poder finalizar una compra", async function () {
    this.timeout(5000);
    let product1 = {
      title: "Producto 1",
      thumbnail: "Imagen 1",
      description: "Descripción 1",
      stock: 5,
      price: 50,
    };
  
    let product2 = {
      title: "Producto 2",
      thumbnail: "Imagen 2",
      description: "Descripción 2",
      stock: 10,
      price: 30,
    };
  
    const productDao = new Product();
    const createdProduct1 = await productDao.addProducts(product1);
    const createdProduct2 = await productDao.addProducts(product2);
  
    const cartDao = new Cart();
    const createdCart = await cartDao.createCart();
  
    await cartDao.addProductCart(createdCart._id, createdProduct1._id, 2);
    await cartDao.addProductCart(createdCart._id, createdProduct2._id, 3);
  
    const initialCart = await cartDao.getCartById(createdCart._id);
  
    const purchaseResult = await cartDao.finishPurchase(createdCart._id);
    assert.ok(purchaseResult);
  
    //Solo chequeo que sea menor y no que esté vacio ya que pueden quedar los carritos sin stock cargados en el carrito.
    const updatedCart = await cartDao.getCartById(createdCart._id);
    assert.ok(initialCart.products.length > updatedCart.products.length,);
  });
  
  
});
