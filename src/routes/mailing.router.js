import { Router } from "express";
import nodemailer from "nodemailer";
import twilio from "twilio";
import __dirname from "../utils.js";
import config from "../config/config.js";

const router = Router();

const client = twilio(config.twilio_sid, config.twilio_token);

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "ayelengarcia7@gmail.com",
    pass: "skglapnqwtgbonzi",
  },
});

router.get("/sms", async (req, res) => {
  try {
    const result = await client.messages.create({
      body: "REGISTRO EXITOSO. Tu usuario registrado es: ayelengarcia7@gmail.com",
      from: config.twilio_phone,
      to: "+541124979403",
    });

    console.log(result);
    res.send("Sms sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Sms send failed");
  }
});

router.get("/mail", async (req, res) => {
  try {
    const result = await transport.sendMail({
      from: "ayelengarcia7@gmail.com",
      to: "ayelengarcia7@gmail.com",
      subject: "Notificación de registro",
      html: `
      <div>
        <h2>REGISTRO EXITOSO</h2>
        <p>Tu usuario registrado es: <b>ayelengarcia7@gmail.com</b></p>
        <br>
        <img src="cid:img1" />
      </div>
      `,
      attachments: [
        {
          filename: "zorro.png",
          path: `${__dirname}/public/img/zorro.png`,
          cid: "img1",
        },
      ],
    });

    console.log(result);
    res.send("Email sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Email send failed");
  }
});

export default router;
