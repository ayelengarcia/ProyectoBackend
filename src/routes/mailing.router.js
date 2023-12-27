import { Router } from "express";
import {
  sent_email,
  sent_sms,
  sent_success,
  sent_contacto,
  sent_contacto_nave
} from "../controllers/mailing.controller.js";

const router = Router();

router.get("/sms", sent_sms);

router.post("/sent-email", sent_email);

router.post("/sent-success", sent_success);

router.post("/sent-contacto", sent_contacto);

router.post("/sent-contacto-nave", sent_contacto_nave);

export default router;

// attachments: [
//   {
//     filename: "zorro.png",
//     path: `${__dirname}/public/img/zorro.png`,
//     cid: "img1",
//   },
// ],
