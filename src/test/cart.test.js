import Cart from "../Dao/mongoManager/cart.mongo.js";
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
});
