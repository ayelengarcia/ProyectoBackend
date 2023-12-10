import { Router } from "express";
import {
  createCheckoutSession,
  paymentCancel,
  paymentSuccess,
} from "../controllers/paymenst.controller.js";
import { authorizationRol, authorizationStrategy } from "../utils.js";

const router = Router();

router.post("/createCheckoutSession/:cid", createCheckoutSession);

router.get(
  "/success/:cid",
  authorizationStrategy("jwt", { session: false }),
  authorizationRol(["Premium", "Usuario"]),
  paymentSuccess
);

router.get("/cancel/:cid", paymentCancel);

export default router;
