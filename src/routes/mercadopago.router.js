import { Router } from "express";
import { createPreferenceMp } from "../controllers/mercadopago.controller.js";

const router = Router();

router.post("/create_preference", createPreferenceMp);

export default router;
