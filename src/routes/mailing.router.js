import { Router } from "express";
import {
  sent_email,
  sent_sms,
  sent_success,
  sent_contacto
} from "../controllers/mailing.controller.js";

const router = Router();

router.get("/sms", sent_sms);

router.post("/sent-email", sent_email);

router.post("/sent-success", sent_success);

router.post("/sent-contacto", sent_contacto);

export default router;

// attachments: [
//   {
//     filename: "zorro.png",
//     path: `${__dirname}/public/img/zorro.png`,
//     cid: "img1",
//   },
// ],
