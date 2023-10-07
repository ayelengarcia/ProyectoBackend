import { Router } from "express";
import { generateProducts } from "../utils.js";

const router = Router();

router.get("/mockingproducts", async (req, res) => {
  try {
    const products = [];

    for (let index = 0; index < 100; index++) {
      products.push(generateProducts());
    }

    res.send({ status: "Success", payload: products });
  } catch (error) {
    res.status(500).send({ status: "Failed" });
  }
});

export default router;
