import Product from "../Dao/mongoManager/product.mongo.js";
import Assert from "assert";
import mongoose from "mongoose";
import config from "../config/config.js";

mongoose
  .connect(config.dbURL, { dbName: config.dbNameTest })
  .then(() => console.log("DB TEST conectada"))
  .catch((e) => console.error("ERROR DB TEST"));

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
});
