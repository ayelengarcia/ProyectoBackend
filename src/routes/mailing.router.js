import { Router } from "express";
import nodemailer from "nodemailer";
import twilio from "twilio";
import __dirname from "../utils.js";
import config from "../config/config.js";
import { generateTokenPass } from "../utils.js";

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

router.post("/sent-email", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const token = generateTokenPass({ user: userEmail });
    const resetLink = `http://127.0.0.1:8080/resetPassConfirm?token=${token}`;

    const result = await transport.sendMail({
      from: "ayelengarcia7@gmail.com",
      to: userEmail,
      subject: "Restablecimiento de Contraseña",
      html: `
      <div>
        <h2>Restablecimiento de Contraseña</h2>
        <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>;
      </div>
      `,
    });

    console.log(result);
    res.send("Email enviado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Fallo al enviar el correo electrónico");
  }
});

export default router;

// attachments: [
//   {
//     filename: "zorro.png",
//     path: `${__dirname}/public/img/zorro.png`,
//     cid: "img1",
//   },
// ],
